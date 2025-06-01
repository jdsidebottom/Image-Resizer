import React, { useState, useEffect, useRef } from 'react';
import ResizeOptions from './ResizeOptions';

interface ImageEditorProps {
  image: File;
}

interface ResizeConfig {
  width: number | null;
  height: number | null;
  maintainAspectRatio: boolean;
  quality: number;
  format: 'jpeg' | 'png' | 'webp';
}

const ImageEditor: React.FC<ImageEditorProps> = ({ image }) => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [originalDimensions, setOriginalDimensions] = useState<{ width: number, height: number } | null>(null);
  const [resizeConfig, setResizeConfig] = useState<ResizeConfig>({
    width: null,
    height: null,
    maintainAspectRatio: true,
    quality: 90,
    format: 'jpeg',
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Load the image when it changes
  useEffect(() => {
    const url = URL.createObjectURL(image);
    setImageUrl(url);
    setPreviewUrl(null);
    
    // Get original dimensions
    const img = new Image();
    img.onload = () => {
      setOriginalDimensions({
        width: img.width,
        height: img.height,
      });
      
      // Reset resize config with original dimensions
      setResizeConfig({
        width: img.width,
        height: img.height,
        maintainAspectRatio: true,
        quality: 90,
        format: 'jpeg',
      });
    };
    img.src = url;
    
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [image]);

  const handleConfigChange = (newConfig: Partial<ResizeConfig>) => {
    setResizeConfig(prev => {
      const updated = { ...prev, ...newConfig };
      
      // Update height if maintaining aspect ratio and width changed
      if (updated.maintainAspectRatio && 
          originalDimensions && 
          newConfig.width && 
          newConfig.width !== prev.width) {
        const aspectRatio = originalDimensions.height / originalDimensions.width;
        updated.height = Math.round(newConfig.width * aspectRatio);
      }
      
      // Update width if maintaining aspect ratio and height changed
      if (updated.maintainAspectRatio && 
          originalDimensions && 
          newConfig.height && 
          newConfig.height !== prev.height) {
        const aspectRatio = originalDimensions.width / originalDimensions.height;
        updated.width = Math.round(newConfig.height * aspectRatio);
      }
      
      return updated;
    });
  };

  const generatePreview = () => {
    if (!canvasRef.current || !originalDimensions || !resizeConfig.width || !resizeConfig.height) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const img = new Image();
    img.onload = () => {
      // Set canvas dimensions to target size
      canvas.width = resizeConfig.width;
      canvas.height = resizeConfig.height;
      
      // Draw the image at the new size
      ctx.drawImage(img, 0, 0, resizeConfig.width, resizeConfig.height);
      
      // Convert to the selected format
      const mimeType = `image/${resizeConfig.format}`;
      const quality = resizeConfig.format === 'png' ? 1 : resizeConfig.quality / 100;
      
      // Generate preview URL
      const dataUrl = canvas.toDataURL(mimeType, quality);
      setPreviewUrl(dataUrl);
    };
    img.src = imageUrl;
  };

  const downloadImage = () => {
    if (!previewUrl) return;
    
    const link = document.createElement('a');
    link.href = previewUrl;
    link.download = `resized-${image.name.split('.')[0]}.${resizeConfig.format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Original Image</h3>
          <div className="border rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
            {imageUrl && (
              <img 
                src={imageUrl} 
                alt="Original" 
                className="max-w-full h-auto object-contain mx-auto"
                style={{ maxHeight: '300px' }}
              />
            )}
          </div>
          {originalDimensions && (
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Original size: {originalDimensions.width} × {originalDimensions.height} pixels
            </p>
          )}
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Preview</h3>
          <div className="border rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center" style={{ minHeight: '200px' }}>
            {previewUrl ? (
              <img 
                src={previewUrl} 
                alt="Preview" 
                className="max-w-full h-auto object-contain mx-auto"
                style={{ maxHeight: '300px' }}
              />
            ) : (
              <div className="text-center p-6 text-gray-500 dark:text-gray-400">
                <p>Click "Generate Preview" to see the result</p>
              </div>
            )}
          </div>
          {previewUrl && resizeConfig.width && resizeConfig.height && (
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              New size: {resizeConfig.width} × {resizeConfig.height} pixels
            </p>
          )}
        </div>
      </div>
      
      <ResizeOptions 
        config={resizeConfig}
        originalDimensions={originalDimensions}
        onChange={handleConfigChange}
      />
      
      <div className="flex space-x-4">
        <button 
          onClick={generatePreview}
          className="btn btn-primary"
          disabled={!originalDimensions}
        >
          Generate Preview
        </button>
        
        <button 
          onClick={downloadImage}
          className="btn btn-secondary"
          disabled={!previewUrl}
        >
          Download
        </button>
      </div>
      
      {/* Hidden canvas for image processing */}
      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
    </div>
  );
};

export default ImageEditor;
