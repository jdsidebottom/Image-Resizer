import { useState, useEffect } from 'react';
import { getCurrentUser, getUserProfile, updateUserProfile, getUserSubscription } from '../lib/supabase';
import toast from 'react-hot-toast';

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>({
    full_name: '',
    website: '',
    avatar_url: ''
  });
  const [subscription, setSubscription] = useState<any>({ tier: 'free', monthly_limit: 25 });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { user } = await getCurrentUser();
        setUser(user);
        
        if (user) {
          try {
            const profileData = await getUserProfile(user.id);
            if (profileData) {
              setProfile(profileData);
            }
          } catch (error) {
            console.error('Error fetching profile:', error);
          }
          
          try {
            const sub = await getUserSubscription(user.id);
            if (sub) {
              setSubscription(sub);
            }
          } catch (error) {
            console.error('Error fetching subscription:', error);
          }
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, []);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    setIsSaving(true);
    
    try {
      await updateUserProfile(user.id, profile);
      toast.success('Profile updated successfully');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Profile</h1>
      
      <div className="mt-6 bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
            Account Information
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
            Manage your personal details and subscription.
          </p>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:px-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Email
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                {user?.email}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Subscription Plan
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                {subscription.tier === 'free' ? 'Free Plan' : 'Premium Plan'}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Monthly Limit
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                {subscription.monthly_limit} images
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Account Created
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
              </dd>
            </div>
          </dl>
        </div>
        
        {/* Profile form */}
        <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
            Edit Profile
          </h3>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Full name
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="full_name"
                    id="full_name"
                    value={profile.full_name || ''}
                    onChange={handleProfileChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="website" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Website
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="website"
                    id="website"
                    value={profile.website || ''}
                    onChange={handleProfileChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </form>
        </div>
        
        {/* Subscription management */}
        <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
            Subscription Management
          </h3>
          
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h4 className="text-base font-medium text-gray-900 dark:text-white">
              {subscription.tier === 'free' ? 'Free Plan' : 'Premium Plan'}
            </h4>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {subscription.tier === 'free' 
                ? 'You can process up to 25 images per month.' 
                : 'You have access to all premium features and unlimited image processing.'}
            </p>
            
            <div className="mt-4">
              {subscription.tier === 'free' ? (
                <a
                  href="/pricing"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Upgrade to Premium
                </a>
              ) : (
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-600 dark:text-white dark:border-gray-500 dark:hover:bg-gray-500"
                >
                  Manage Subscription
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Account danger zone */}
        <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-red-600 dark:text-red-400 mb-4">
            Danger Zone
          </h3>
          
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
            <h4 className="text-base font-medium text-red-800 dark:text-red-400">
              Delete Account
            </h4>
            <p className="mt-1 text-sm text-red-700 dark:text-red-300">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            
            <div className="mt-4">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
