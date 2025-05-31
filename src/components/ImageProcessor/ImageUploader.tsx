import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface ImageUploaderProps {
  onUpload: (files: File[]) => void;
  disabled?: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onUpload, disabled = false }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Filter for image files only
    const imageFiles = acceptedFiles.filter(file => 
      file.type.startsWith('image/')
    );
    
    if (imageFiles.length > 0) {
      onUpload(imageFiles);
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    disabled,
    maxSize: 10485760, // 10MB
  });

  return (
    <div 
      {...getRootProps()} 
      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
        isDragActive 
          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' 
          : 'border-gray-300 hover:border-indigo-400 dark:border-gray-600 dark:hover:border-indigo-500'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <input {...getInputProps()} />
      
      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      </svg>
      
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
        {isDragActive 
          ? 'Drop the images here...' 
          : disabled 
            ? 'Please upgrade to upload more images' 
            : 'Drag & drop images here, or click to select files'}
      </p>
      
      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
        PNG, JPG, GIF, WEBP up to 10MB
      </p>
    </div>
  );
};

export default ImageUploader;
