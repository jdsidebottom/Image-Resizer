import { useState, useEffect } from 'react';
import { getCurrentUser, getImageUsage, getUserSubscription } from '../lib/supabase';
import ImageUploader from '../components/ImageProcessor/ImageUploader';
import ImageEditor from '../components/ImageProcessor/ImageEditor';
import BatchActions from '../components/ImageProcessor/BatchActions';
import UsageStats from '../components/Dashboard/UsageStats';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [usage, setUsage] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [images, setImages] = useState<File[]>([]);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { user } = await getCurrentUser();
        
        if (user) {
          setUser(user);
          
          // Fetch usage data
          const { usage } = await getImageUsage(user.id);
          setUsage(usage || { count: 0 });
          
          // Fetch subscription data
          const { subscription } = await getUserSubscription(user.id);
          setSubscription(subscription);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Failed to load user data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, []);

  const handleImageUpload = (files: File[]) => {
    setImages(prevImages => [...prevImages, ...files]);
    if (files.length > 0 && !selectedImage) {
      setSelectedImage(files[0]);
    }
    toast.success(`${files.length} image${files.length === 1 ? '' : 's'} uploaded`);
  };

  const handleImageSelect = (image: File) => {
    setSelectedImage(image);
  };

  const handleImageRemove = (image: File) => {
    setImages(prevImages => prevImages.filter(img => img !== image));
    if (selectedImage === image) {
      setSelectedImage(images.length > 1 ? images[0] : null);
    }
  };

  const isFreeTier = !subscription || subscription.plan === 'free';
  const monthlyLimit = 25; // Free tier limit
  const canProcessMore = !isFreeTier || (usage?.count || 0) < monthlyLimit;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Image Dashboard</h1>
        <UsageStats 
          usage={usage?.count || 0} 
          limit={isFreeTier ? monthlyLimit : null} 
          isPremium={!isFreeTier} 
        />
      </div>

      {!canProcessMore && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 dark:bg-yellow-900/30 dark:border-yellow-600">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700 dark:text-yellow-200">
                You've reached your monthly limit of {monthlyLimit} images.{' '}
                <a href="/pricing" className="font-medium underline text-yellow-700 hover:text-yellow-600 dark:text-yellow-200 dark:hover:text-yellow-100">
                  Upgrade to Premium
                </a>
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="card">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Upload Images</h2>
            <ImageUploader 
              onUpload={handleImageUpload} 
              disabled={!canProcessMore}
            />
          </div>
          
          {images.length > 0 && (
            <div className="card">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Your Images</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-2">
                {images.map((image, index) => (
                  <div 
                    key={index} 
                    className={`relative rounded-md overflow-hidden cursor-pointer border-2 ${selectedImage === image ? 'border-indigo-500' : 'border-transparent'}`}
                    onClick={() => handleImageSelect(image)}
                  >
                    <img 
                      src={URL.createObjectURL(image)} 
                      alt={`Uploaded image ${index + 1}`}
                      className="w-full h-20 object-cover"
                    />
                    <button
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleImageRemove(image);
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-2 space-y-6">
          {selectedImage ? (
            <>
              <div className="card">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Image Editor</h2>
                <ImageEditor image={selectedImage} />
              </div>
              
              <div className="card">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Batch Actions</h2>
                <BatchActions 
                  images={images} 
                  disabled={!canProcessMore}
                />
              </div>
            </>
          ) : (
            <div className="card flex flex-col items-center justify-center py-12">
              <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No image selected</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Upload and select an image to start editing
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
