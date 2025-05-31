import { useState, useEffect } from 'react';
import { getCurrentUser, getUserProfile, updateUserProfile, getUserSubscription } from '../lib/supabase';
import toast from 'react-hot-toast';

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>({
    full_name: '',
    website: '',
    avatar_url: '',
  });
  const [subscription, setSubscription] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { user } = await getCurrentUser();
        
        if (user) {
          setUser(user);
          
          // Fetch profile data
          const { profile } = await getUserProfile(user.id);
          if (profile) {
            setProfile(profile);
          }
          
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      if (!user) return;

      const { data, error } = await updateUserProfile(user.id, {
        full_name: profile.full_name,
        website: profile.website,
        avatar_url: profile.avatar_url,
        updated_at: new Date().toISOString(),
      });

      if (error) {
        throw error;
      }

      toast.success('Profile updated successfully');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Your Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="card">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Personal Information</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <div className="mt-1">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={user?.email || ''}
                    disabled
                    className="input bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Your email cannot be changed
                </p>
              </div>

              <div>
                <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Full Name
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="full_name"
                    name="full_name"
                    value={profile.full_name || ''}
                    onChange={handleChange}
                    className="input"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="website" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Website
                </label>
                <div className="mt-1">
                  <input
                    type="url"
                    id="website"
                    name="website"
                    value={profile.website || ''}
                    onChange={handleChange}
                    className="input"
                    placeholder="https://example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="avatar_url" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Avatar URL
                </label>
                <div className="mt-1">
                  <input
                    type="url"
                    id="avatar_url"
                    name="avatar_url"
                    value={profile.avatar_url || ''}
                    onChange={handleChange}
                    className="input"
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="btn btn-primary"
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="md:col-span-1">
          <div className="card">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Subscription</h2>
            
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center dark:bg-indigo-900">
                <span className="text-3xl text-indigo-600 dark:text-indigo-400">
                  {subscription?.plan === 'premium' ? '⭐' : '👤'}
                </span>
              </div>
              
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                {subscription?.plan === 'premium' ? 'Premium Plan' : 'Free Plan'}
              </h3>
              
              {subscription?.plan === 'premium' ? (
                <div className="mt-2 text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Renewal date: {new Date(subscription.current_period_end).toLocaleDateString()}
                  </p>
                  <a href="#" className="mt-4 inline-block text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
                    Manage subscription
                  </a>
                </div>
              ) : (
                <div className="mt-2 text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Limited to 25 images per month
                  </p>
                  <a href="/pricing" className="mt-4 inline-block btn btn-primary">
                    Upgrade to Premium
                  </a>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 card">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Account Actions</h2>
            
            <div className="space-y-4">
              <button className="w-full btn btn-outline">
                Change Password
              </button>
              
              <button className="w-full btn btn-outline text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300">
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
