import Dropzone from '../components/ImageUploader/Dropzone'
import ImageList from '../components/ImageUploader/ImageList'
import ResizeOptions from '../components/ImageProcessor/ResizeOptions'
import ImagePreview from '../components/ImageProcessor/ImagePreview'
import BatchActions from '../components/ImageProcessor/BatchActions'
import { useImageStore } from '../stores/imageStore'

export default function Editor() {
  const { images } = useImageStore()
  
  return (
    <div className="bg-gray-50 dark:bg-gray-900 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-8">
          Image Editor
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Upload and Options */}
          <div className="lg:col-span-1 space-y-8">
            <div className="card p-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Upload Images
              </h2>
              <Dropzone />
            </div>
            
            {images.length > 0 && (
              <div className="card p-6">
                <ResizeOptions />
              </div>
            )}
          </div>
          
          {/* Right Column - Preview and Results */}
          <div className="lg:col-span-2 space-y-8">
            {images.length > 0 ? (
              <>
                <div className="card p-6">
                  <ImagePreview />
                </div>
                
                <div className="card p-6">
                  <ImageList />
                  <BatchActions />
                </div>
              </>
            ) : (
              <div className="card p-12 text-center">
                <div className="mx-auto w-24 h-24 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center mb-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-primary-600 dark:text-primary-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                  No Images Uploaded
                </h2>
                <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
                  Upload images by dragging and dropping files or using the upload button.
                </p>
                <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
                  Supported formats: JPEG, PNG, GIF, WebP
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
