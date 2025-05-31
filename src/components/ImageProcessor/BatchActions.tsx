import React, { useState } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

interface BatchActionsProps {
  images: File[];
  disabled?: boolean;
}

interface BatchConfig {
  width: number;
  height: number;
  maintainAspectRatio: boolean;
  quality: number;
  format: 'jpeg' | 'png' | 'webp';
}

const BatchActions: React.FC<BatchActionsProps> = ({ images, disabled = false }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [config, setConfig] = useState<BatchConfig>({
    width: 1080,
    height: 1080,
    maintainAspectRatio: true,
    quality: 80,
    format: 'jpeg',
  });

  const handleConfigChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setConfig(prev => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : type === 'number' 
          ? parseInt(value) 
          : value,
    }));
  };

  const processImages = async () => {
    if (images.length === 0 || disabled) return;
    
    setIsProcessing(true);
    setProgress(0);
    
    try {
      const zip = new JSZip();
      const folder = zip.folder('resized-images');
      
      for (let i = 0; i < images.length; i++) {
        const image = images[i];
        const resizedImage = await resizeImage(image);
        
        if (folder && resizedImage) {
          const fileName = `${image.name.split('.')[0]}.${config.format}`;
          folder.file(fileName, resizedImage, { base64: true });
        }
        
        setProgress(Math.round(((i + 1) / images.length) * 100));
      }
      
      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, 'resized-images.zip');
    } catch (error) {
      console.error('Error processing images:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const resizeImage = (file: File): Promise<string | null> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        // Calculate dimensions
        let targetWidth = config.width;
        let targetHeight = config.height;
        
        if (config.maintainAspectRatio) {
          const aspectRatio = img.width / img.height;
          
          if (targetWidth / targetHeight > aspectRatio) {
            targetWidth = Math.round(targetHeight * aspectRatio);
          } else {
            targetHeight = Math.round(targetWidth / aspectRatio);
          }
        }
        
        // Create canvas and resize
        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(null);
          return;
        }
        
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
        
        // Convert to the selected format
        const mimeType = `image/${config.format}`;
        const quality = config.format === 'png' ? 1 : config.quality / 100;
        
        // Remove the data:image/xxx;base64, prefix
        const dataUrl = canvas.toDataURL(mimeType, quality);
        const base64 = dataUrl.split(',')[1];
        
        resolve(base64);
      };
      
      img.onerror = () => resolve(null);
      img.src = URL.createObjectURL(file);
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="batch-width" className="block text-xs text-gray-500 dark:text-gray-400">
            Width (px)
          </label>
          <input
            type="number"
            id="batch-width"
            name="width"
            value={config.width}
            onChange={handleConfigChange}
            min="1"
            max="10000"
            className="input mt-1"
            disabled={isProcessing}
          />
        </div>
        
        <div>
          <label htmlFor="batch-height" className="block text-xs text-gray-500 dark:text-gray-400">
            Height (px)
          </label>
          <input
            type="number"
            id="batch-height"
            name="height"
            value={config.height}
            onChange={handleConfigChange}
            min="1"
            max="10000"
            className="input mt-1"
            disabled={isProcessing}
          />
        </div>
        
        <div>
          <label htmlFor="batch-format" className="block text-xs text-gray-500 dark:text-gray-400">
            Format
          </label>
          <select
            id="batch-format"
            name="format"
            value={config.format}
            onChange={handleConfigChange}
            className="input mt-1"
            disabled={isProcessing}
          >
            <option value="jpeg">JPEG</option>
            <option value="png">PNG</option>
            <option value="webp">WebP</option>
          </select>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="batch-aspect-ratio"
            name="maintainAspectRatio"
            checked={config.maintainAspectRatio}
            onChange={handleConfigChange}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700"
            disabled={isProcessing}
          />
          <label htmlFor="batch-aspect-ratio" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
            Maintain aspect ratio
          </label>
        </div>
        
        <div className="flex-1">
          <label htmlFor="batch-quality" className="block text-xs text-gray-500 dark:text-gray-400">
            Quality: {config.quality}%
          </label>
          <input
            type="range"
            id="batch-quality"
            name="quality"
            min="10"
            max="100"
            value={config.quality}
            onChange={handleConfigChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 mt-1"
            disabled={isProcessing}
          />
        </div>
      </div>
      
      {isProcessing && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div 
              className="bg-indigo-600 h-2.5 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 text-center">
            Processing {progress}% complete
          </p>
        </div>
      )}
      
      <div className="flex justify-between">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {images.length} image{images.length !== 1 ? 's' : ''} selected
        </div>
        
        <button
          onClick={processImages}
          disabled={images.length === 0 || isProcessing || disabled}
          className="btn btn-primary"
        >
          {isProcessing ? 'Processing...' : 'Process & Download All'}
        </button>
      </div>
    </div>
  );
};

export default BatchActions;
