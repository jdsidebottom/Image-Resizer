import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCurrentUser, getUserImageHistory, getProcessedImagesCount, getUserSubscription } from '../lib/supabase';

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [recentImages, setRecentImages] = useState<any[]>([]);
  const [processedCount, setProcessedCount] = useState(0);
  const [subscription, setSubscription] = useState<any>({ tier: 'free', monthly_limit: 25 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { user } = await getCurrentUser();
        setUser(user);
        
        if (user) {
          // Get recent image history
          const history = await getUserImageHistory(user.id);
          setRecentImages(history?.slice(0, 5) || []);
          
          // Get processed images count
          const count = await getProcessedImagesCount(user.id);
          setProcessedCount(count);
          
          // Get subscription details
          const sub = await getUserSubscription(user.id);
          if (sub) setSubscription(sub);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Dashboard</h1>
      
      {/* Usage stats */}
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Images Processed This Month
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900 dark:text-white">
                      {processedCount} / {subscription.monthly_limit}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 px-4 py-4 sm:px-6">
            <div className="text-sm">
              <Link to="/dashboard/resize" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
                Resize more images
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Current Plan
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900 dark:text-white">
                      {subscription.tier === 'free' ? 'Free Plan' : 'Premium Plan'}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 px-4 py-4 sm:px-6">
            <div className="text-sm">
              <Link to="/pricing" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
                {subscription.tier === 'free' ? 'Upgrade to premium' : 'Manage subscription'}
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Quick Resize
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900 dark:text-white">
                      Social Media
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 px-4 py-4 sm:px-6">
            <div className="text-sm">
              <Link to="/dashboard/resize" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
                Start quick resize
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Recent activity */}
      <h2 className="mt-8 text-lg font-medium text-gray-900 dark:text-white">Recent activity</h2>
      <div className="mt-2 bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {recentImages.length > 0 ? (
            recentImages.map((image, index) => (
              <li key={index}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-indigo-600 truncate dark:text-indigo-400">
                      {image.original_filename || `Image ${index + 1}`}
                    </p>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                        {image.output_format || 'Processed'}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        {image.width && image.height ? `${image.width} × ${image.height}` : 'Resized'}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 dark:text-gray-400">
                      <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400 dark:text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                      <p>
                        {new Date(image.created_at).toLocaleDateString() || 'Recently'}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <li className="px-4 py-5 sm:px-6">
              <div className="text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">No recent activity</p>
                <Link to="/dashboard/resize" className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
                  Resize your first image
                </Link>
              </div>
            </li>
          )}
        </ul>
      </div>

      {/* Quick actions */}
      <h2 className="mt-8 text-lg font-medium text-gray-900 dark:text-white">Quick actions</h2>
      <div className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Batch resize</h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500 dark:text-gray-400">
              <p>Resize multiple images at once with the same settings.</p>
            </div>
            <div className="mt-3">
              <Link to="/dashboard/resize" className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Start batch resize
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Social media presets</h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500 dark:text-gray-400">
              <p>Quickly resize images for various social media platforms.</p>
            </div>
            <div className="mt-3">
              <Link to="/dashboard/resize" className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Use presets
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Custom dimensions</h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500 dark:text-gray-400">
              <p>Resize images to exact dimensions you need.</p>
            </div>
            <div className="mt-3">
              <Link to="/dashboard/resize" className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Custom resize
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
