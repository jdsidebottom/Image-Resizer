import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import { getCurrentUser, getProcessedImagesCount, getUserSubscription, saveImageProcessingHistory } from '../lib/supabase';

// Social media presets
const PRESETS = {
  instagram: {
    post: { width: 1080, height: 1080, label: 'Instagram Post' },
    story: { width: 1080, height: 1920, label: 'Instagram Story' },
    profile: { width: 320, height: 320, label: 'Instagram Profile' }
  },
  facebook: {
    post: { width: 1200, height: 630, label: 'Facebook Post' },
    cover: { width: 820, height: 312, label: 'Facebook Cover' },
    profile: { width: 170, height: 170, label: 'Facebook Profile' }
  },
  twitter: {
    post: { width: 1200, height: 675, label: 'Twitter Post' },
    header: { width: 1500, height: 500, label: 'Twitter Header' },
    profile: { width: 400, height: 400, label: 'Twitter Profile' }
  },
  linkedin: {
    post: { width: 1200, height: 627, label: 'LinkedIn Post' },
    cover: { width: 1584, height: 396, label: 'LinkedIn Cover' },
    profile: { width: 400, height: 400, label: 'LinkedIn Profile' }
  }
};

interface ImageFile extends File {
  preview?: string;
}

interface ResizeOptions {
  width: number;
  height: number;
  maintainAspectRatio: boolean;
  format: 'jpeg' | 'png' | 'webp';
  quality: number;
}

const ImageResizer = () => {
  const [files, setFiles] = useState<ImageFile[]>([]);
  const [resizedImages, setResizedImages] = useState<{ file: Blob; name: string }[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [customDimensions, setCustomDimensions] = useState({ width: 800, height: 600 });
  const [resizeOptions, setResizeOptions] = useState<ResizeOptions>({
    width: 800,
    height: 600,
    maintainAspectRatio: true,
    format: 'jpeg',
    quality: 90
  });
  const [user, setUser] = useState<any>(null);
  const [processedCount, setProcessedCount] = useState(0);
  const [monthlyLimit, setMonthlyLimit] = useState(25); // Default free tier limit

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { user } = await getCurrentUser();
        setUser(user);
        
        if (user) {
          const count = await getProcessedImagesCount(user.id);
          setProcessedCount(count);
          
          const subscription = await getUserSubscription(user.id);
          if (subscription) {
            setMonthlyLimit(subscription.monthly_limit);
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    
    fetchUserData();
  }, []);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Check if adding these files would exceed the monthly limit
    if (processedCount + acceptedFiles.length > monthlyLimit) {
      toast.error(`You can only process ${monthlyLimit} images per month with your current plan. You have ${monthlyLimit - processedCount} remaining.`);
      return;
    }
    
    const newFiles = acceptedFiles.map(file => 
      Object.assign(file, {
        preview: URL.createObjectURL(file)
      })
    );
    
    setFiles(prev => [...prev, ...newFiles]);
  }, [processedCount, monthlyLimit]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxSize: 10485760, // 10MB
  });

  const handleRemoveFile = (index: number) => {
    setFiles(prev => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[index].preview || '');
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const handlePresetSelect = (platform: string, type: string) => {
    const preset = PRESETS[platform as keyof typeof PRESETS][type as keyof typeof PRESETS[keyof typeof PRESETS]];
    setSelectedPreset(`${platform}-${type}`);
    setResizeOptions(prev => ({
      ...prev,
      width: preset.width,
      height: preset.height
    }));
  };

  const handleCustomDimensionsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomDimensions(prev => ({
      ...prev,
      [name]: parseInt(value) || 0
    }));
    
    if (selectedPreset === 'custom') {
      setResizeOptions(prev => ({
        ...prev,
        [name]: parseInt(value) || 0
      }));
    }
  };

  const applyCustomDimensions = () => {
    setSelectedPreset('custom');
    setResizeOptions(prev => ({
      ...prev,
      width: customDimensions.width,
      height: customDimensions.height
    }));
  };

  const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setResizeOptions(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const resizeImage = (file: ImageFile): Promise<{ file: Blob; name: string }> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = file.preview || '';
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = resizeOptions;
        
        // Calculate dimensions if maintaining aspect ratio
        if (resizeOptions.maintainAspectRatio) {
          const aspectRatio = img.width / img.height;
          
          if (width && height) {
            // Both dimensions specified, adjust based on aspect ratio
            const canvasRatio = width / height;
            
            if (aspectRatio > canvasRatio) {
              // Image is wider than canvas ratio
              height = width / aspectRatio;
            } else {
              // Image is taller than canvas ratio
              width = height * aspectRatio;
            }
          } else if (width) {
            // Only width specified
            height = width / aspectRatio;
          } else if (height) {
            // Only height specified
            width = height * aspectRatio;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        
        // Draw image on canvas
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Could not create blob'));
              return;
            }
            
            // Generate filename
            const extension = resizeOptions.format === 'jpeg' ? 'jpg' : resizeOptions.format;
            const filename = file.name.replace(/\.[^/.]+$/, '') + `_${width}x${height}.${extension}`;
            
            resolve({ file: blob, name: filename });
          },
          `image/${resizeOptions.format}`,
          resizeOptions.quality / 100
        );
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
    });
  };

  const handleProcessImages = async () => {
    if (files.length === 0) {
      toast.error('Please add at least one image');
      return;
    }
    
    if (processedCount + files.length > monthlyLimit) {
      toast.error(`You can only process ${monthlyLimit} images per month with your current plan. You have ${monthlyLimit - processedCount} remaining.`);
      return;
    }
    
    setIsProcessing(true);
    setResizedImages([]);
    
    try {
      const resizedFiles = await Promise.all(files.map(resizeImage));
      setResizedImages(resizedFiles);
      
      // Update processed count in state
      setProcessedCount(prev => prev + files.length);
      
      // Save processing history to Supabase if user is logged in
      if (user) {
        for (const file of files) {
          await saveImageProcessingHistory(user.id, {
            original_filename: file.name,
            output_format: resizeOptions.format,
            width: resizeOptions.width,
            height: resizeOptions.height,
            file_size: file.size
          });
        }
      }
      
      toast.success(`Successfully resized ${files.length} image${files.length > 1 ? 's' : ''}`);
    } catch (error) {
      console.error('Error processing images:', error);
      toast.error('Failed to process images');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadAll = () => {
    if (resizedImages.length === 0) return;
    
    if (resizedImages.length === 1) {
      // Download single file directly
      saveAs(resizedImages[0].file, resizedImages[0].name);
    } else {
      // Create zip for multiple files
      const zip = new JSZip();
      
      resizedImages.forEach(({ file, name }) => {
        zip.file(name, file);
      });
      
      zip.generateAsync({ type: 'blob' }).then(content => {
        saveAs(content, 'resized_images.zip');
      });
    }
  };

  const handleDownloadSingle = (index: number) => {
    const { file, name } = resizedImages[index];
    saveAs(file, name);
  };

  // Clean up previews when component unmounts
  useEffect(() => {
    return () => {
      files.forEach(file => {
        if (file.preview) URL.revokeObjectURL(file.preview);
      });
    };
  }, [files]);

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Image Resizer</h1>
        
        {/* Usage limit warning */}
        {user && (
          <div className="mt-4 bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                Usage
              </h3>
              <div className="mt-2 max-w-xl text-sm text-gray-500 dark:text-gray-400">
                <p>You have processed {processedCount} of {monthlyLimit} images this month.</p>
              </div>
              <div className="mt-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div 
                  className="bg-indigo-600 h-2.5 rounded-full" 
                  style={{ width: `${Math.min(100, (processedCount / monthlyLimit) * 100)}%` }}
                ></div>
              </div>
              {processedCount >= monthlyLimit && (
                <div className="mt-4">
                  <Link
                    to="/pricing"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Upgrade your plan
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
        
        <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          {/* File upload section */}
          <div className="sm:col-span-6">
            <div 
              {...getRootProps()} 
              className={`dropzone ${isDragActive ? 'active' : ''} ${files.length > 0 ? 'border-indigo-300 dark:border-indigo-700' : ''}`}
            >
              <input {...getInputProps()} />
              <div className="text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  ></path>
                </svg>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  {isDragActive
                    ? "Drop the files here..."
                    : "Drag 'n' drop images here, or click to select files"}
                </p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                  Supports JPG, PNG, GIF, WEBP up to 10MB
                </p>
              </div>
            </div>
          </div>

          {/* Preview section */}
          {files.length > 0 && (
            <div className="sm:col-span-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Selected Images ({files.length})</h3>
              <div className="mt-2 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {files.map((file, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-w-1 aspect-h-1 rounded-lg bg-gray-100 overflow-hidden">
                      <img
                        src={file.preview}
                        alt={file.name}
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(index)}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 m-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <p className="mt-1 text-xs text-gray-500 truncate dark:text-gray-400">{file.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Resize options */}
          {files.length > 0 && (
            <>
              <div className="sm:col-span-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Resize Options</h3>
                
                {/* Social media presets */}
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Social Media Presets</h4>
                  <div className="mt-2 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                    {Object.entries(PRESETS).map(([platform, types]) => (
                      Object.entries(types).map(([type, preset]) => (
                        <div
                          key={`${platform}-${type}`}
                          onClick={() => handlePresetSelect(platform, type)}
                          className={`size-preset p-3 border rounded-lg cursor-pointer ${
                            selectedPreset === `${platform}-${type}` ? 'selected' : ''
                          }`}
                        >
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{preset.label}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{`${preset.width} × ${preset.height}`}</div>
                        </div>
                      ))
                    ))}
                  </div>
                </div>
                
                {/* Custom dimensions */}
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Custom Dimensions</h4>
                  <div className="mt-2 flex flex-wrap gap-4">
                    <div>
                      <label htmlFor="width" className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                        Width (px)
                      </label>
                      <input
                        type="number"
                        name="width"
                        id="width"
                        min="1"
                        max="10000"
                        value={customDimensions.width}
                        onChange={handleCustomDimensionsChange}
                        className="mt-1 block w-32 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                    <div>
                      <label htmlFor="height" className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                        Height (px)
                      </label>
                      <input
                        type="number"
                        name="height"
                        id="height"
                        min="1"
                        max="10000"
                        value={customDimensions.height}
                        onChange={handleCustomDimensionsChange}
                        className="mt-1 block w-32 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={applyCustomDimensions}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-indigo-400 dark:hover:bg-gray-600"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Advanced options */}
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Advanced Options</h4>
                  <div className="mt-2 space-y-4">
                    <div className="flex items-center">
                      <input
                        id="maintainAspectRatio"
                        name="maintainAspectRatio"
                        type="checkbox"
                        checked={resizeOptions.maintainAspectRatio}
                        onChange={handleOptionChange}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded dark:border-gray-600"
                      />
                      <label htmlFor="maintainAspectRatio" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                        Maintain aspect ratio
                      </label>
                    </div>
                    
                    <div>
                      <label htmlFor="format" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Output Format
                      </label>
                      <select
                        id="format"
                        name="format"
                        value={resizeOptions.format}
                        onChange={handleOptionChange}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      >
                        <option value="jpeg">JPEG</option>
                        <option value="png">PNG</option>
                        <option value="webp">WebP</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="quality" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Quality: {resizeOptions.quality}%
                      </label>
                      <input
                        type="range"
                        id="quality"
                        name="quality"
                        min="10"
                        max="100"
                        value={resizeOptions.quality}
                        onChange={handleOptionChange}
                        className="mt-1 block w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Process button */}
              <div className="sm:col-span-6">
                <button
                  type="button"
                  onClick={handleProcessImages}
                  disabled={isProcessing || files.length === 0}
                  className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    'Process Images'
                  )}
                </button>
              </div>
            </>
          )}

          {/* Results section */}
          {resizedImages.length > 0 && (
            <div className="sm:col-span-6">
              <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                    Processed Images
                  </h3>
                  <button
                    type="button"
                    onClick={handleDownloadAll}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Download All
                  </button>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:p-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {resizedImages.map((image, index) => {
                      const url = URL.createObjectURL(image.file);
                      return (
                        <div key={index} className="group relative">
                          <div className="aspect-w-1 aspect-h-1 rounded-lg bg-gray-100 overflow-hidden">
                            <img
                              src={url}
                              alt={`Resized ${index + 1}`}
                              className="object-cover"
                              onLoad={() => URL.revokeObjectURL(url)}
                            />
                          </div>
                          <div className="mt-2 flex justify-between items-center">
                            <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                              {image.name}
                            </p>
                            <button
                              type="button"
                              onClick={() => handleDownloadSingle(index)}
                              className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                              <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageResizer;
