import { useImageStore } from '../../stores/imageStore'
import { XMarkIcon, CheckIcon } from '@heroicons/react/24/outline'

export default function ImageList() {
  const { images, removeImage, selectImage, selectedImageId } = useImageStore()
  
  if (images.length === 0) {
    return null
  }
  
  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
        Uploaded Images ({images.length})
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {images.map((image) => (
          <div
            key={image.id}
            className={`relative group rounded-lg overflow-hidden border-2 transition-all duration-200 ${
              selectedImageId === image.id
                ? 'border-primary-500 shadow-md'
                : 'border-transparent hover:border-gray-300 dark:hover:border-gray-700'
            }`}
            onClick={() => selectImage(image.id)}
          >
            <div className="aspect-square relative">
              <img
                src={image.processed?.url || image.preview}
                alt={image.file.name}
                className="w-full h-full object-cover"
              />
              
              {image.isProcessing && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              
              {image.processed && (
                <div className="absolute top-2 right-2">
                  <span className="flex items-center justify-center w-6 h-6 bg-accent-500 rounded-full">
                    <CheckIcon className="w-4 h-4 text-white" />
                  </span>
                </div>
              )}
              
              {image.error && (
                <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
                  <span className="text-xs text-white bg-red-600 px-2 py-1 rounded">
                    Error
                  </span>
                </div>
              )}
            </div>
            
            <button
              type="button"
              className="absolute top-2 left-2 w-6 h-6 bg-gray-900/70 hover:bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              onClick={(e) => {
                e.stopPropagation()
                removeImage(image.id)
              }}
            >
              <XMarkIcon className="w-4 h-4 text-white" />
            </button>
            
            <div className="p-2">
              <p className="text-xs text-gray-700 dark:text-gray-300 truncate">
                {image.file.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {image.processed
                  ? `${image.processed.width}×${image.processed.height}`
                  : `${Math.round(image.file.size / 1024)} KB`}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
