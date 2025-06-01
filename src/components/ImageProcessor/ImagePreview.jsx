import { useImageStore } from '../../stores/imageStore'

export default function ImagePreview() {
  const { selectedImageId, images, processImage } = useImageStore()
  
  const selectedImage = selectedImageId
    ? images.find((img) => img.id === selectedImageId)
    : null
  
  if (!selectedImage) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100 dark:bg-gray-800 rounded-lg p-8">
        <p className="text-gray-500 dark:text-gray-400 text-center">
          Select an image to preview
        </p>
      </div>
    )
  }
  
  const handleProcess = () => {
    if (selectedImageId) {
      processImage(selectedImageId)
    }
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Preview
        </h3>
        
        <div className="flex space-x-2">
          {selectedImage.processed && (
            <a
              href={selectedImage.processed.url}
              download={`resized-${selectedImage.file.name}`}
              className="btn btn-accent"
            >
              Download
            </a>
          )}
          
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleProcess}
            disabled={selectedImage.isProcessing}
          >
            {selectedImage.isProcessing
              ? 'Processing...'
              : selectedImage.processed
              ? 'Resize Again'
              : 'Resize Image'}
          </button>
        </div>
      </div>
      
      <div className="relative bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
        <div className="aspect-video flex items-center justify-center">
          <img
            src={selectedImage.processed?.url || selectedImage.preview}
            alt={selectedImage.file.name}
            className="max-w-full max-h-full object-contain"
          />
        </div>
        
        {selectedImage.isProcessing && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
          <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-1">
            Original
          </h4>
          <div className="text-gray-600 dark:text-gray-400 space-y-1">
            <p>
              Dimensions: {selectedImage.file.width || '?'}×
              {selectedImage.file.height || '?'} px
            </p>
            <p>Size: {(selectedImage.file.size / 1024).toFixed(1)} KB</p>
            <p>Type: {selectedImage.file.type}</p>
          </div>
        </div>
        
        {selectedImage.processed && (
          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
            <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-1">
              Processed
            </h4>
            <div className="text-gray-600 dark:text-gray-400 space-y-1">
              <p>
                Dimensions: {selectedImage.processed.width}×
                {selectedImage.processed.height} px
              </p>
              <p>
                Size:{' '}
                {(selectedImage.processed.blob.size / 1024).toFixed(1)} KB
              </p>
              <p>
                Reduction:{' '}
                {(
                  ((selectedImage.file.size - selectedImage.processed.blob.size) /
                    selectedImage.file.size) *
                  100
                ).toFixed(1)}
                %
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
