import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { ArrowUpTrayIcon, PhotoIcon } from '@heroicons/react/24/outline'
import { useImageStore } from '../../stores/imageStore'
import { useAuthStore } from '../../stores/authStore'
import toast from 'react-hot-toast'

export default function Dropzone() {
  const { addImages } = useImageStore()
  const { userData, incrementUsage } = useAuthStore()
  
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      // Check if user has reached their limit
      if (userData && userData.subscription_tier === 'free') {
        const remainingUses = userData.monthly_limit - userData.monthly_usage
        
        if (remainingUses <= 0) {
          toast.error('You have reached your monthly limit. Please upgrade to continue.')
          return
        }
        
        if (acceptedFiles.length > remainingUses) {
          toast.error(`You can only process ${remainingUses} more images this month.`)
          acceptedFiles = acceptedFiles.slice(0, remainingUses)
        }
      }
      
      // Validate file types
      const validFiles = acceptedFiles.filter((file) => {
        const isValid = /^image\/(jpeg|png|gif|webp)$/.test(file.type)
        if (!isValid) {
          toast.error(`${file.name} is not a supported image format.`)
        }
        return isValid
      })
      
      if (validFiles.length === 0) return
      
      try {
        await addImages(validFiles)
        incrementUsage(validFiles.length)
        toast.success(`${validFiles.length} image${validFiles.length > 1 ? 's' : ''} added`)
      } catch (error) {
        toast.error('Failed to add images')
        console.error(error)
      }
    },
    [addImages, incrementUsage, userData]
  )
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/gif': [],
      'image/webp': [],
    },
    maxSize: 10485760, // 10MB
  })
  
  return (
    <div
      {...getRootProps()}
      className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-200 ${
        isDragActive
          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
          : 'border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50'
      }`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center p-6 text-center">
        {isDragActive ? (
          <>
            <ArrowUpTrayIcon className="w-12 h-12 text-primary-500 mb-4" />
            <p className="text-lg font-medium text-primary-600 dark:text-primary-400">
              Drop your images here
            </p>
          </>
        ) : (
          <>
            <PhotoIcon className="w-12 h-12 text-gray-400 dark:text-gray-600 mb-4" />
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
              Drag & drop images here
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              or click to select files
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Supports JPEG, PNG, GIF, WEBP (max 10MB)
            </p>
          </>
        )}
      </div>
    </div>
  )
}
