import { Outlet, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getCurrentUser } from '../lib/supabase';

const MainLayout = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { user } = await getCurrentUser();
      setIsAuthenticated(!!user);
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-sm dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link to="/" className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                  ResizeMaster
                </Link>
              </div>
              <nav className="ml-6 flex items-center space-x-4">
                <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:bg-gray-50 dark:text-gray-100 dark:hover:bg-gray-700">
                  Home
                </Link>
                <Link to="/pricing" className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:bg-gray-50 dark:text-gray-100 dark:hover:bg-gray-700">
                  Pricing
                </Link>
                {isAuthenticated && (
                  <Link to="/dashboard" className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:bg-gray-50 dark:text-gray-100 dark:hover:bg-gray-700">
                    Dashboard
                  </Link>
                )}
              </nav>
            </div>
            <div className="flex items-center">
              {isLoading ? (
                <div className="h-5 w-20 bg-gray-200 rounded animate-pulse"></div>
              ) : isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <Link to="/profile" className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:bg-gray-50 dark:text-gray-100 dark:hover:bg-gray-700">
                    Profile
                  </Link>
                  <button 
                    className="btn btn-outline"
                    onClick={async () => {
                      await import('../lib/supabase').then(({ signOut }) => signOut());
                      setIsAuthenticated(false);
                    }}
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link to="/login" className="btn btn-outline">
                    Sign In
                  </Link>
                  <Link to="/register" className="btn btn-primary">
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
      <footer className="bg-white shadow-inner dark:bg-gray-800">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              &copy; {new Date().getFullYear()} ResizeMaster. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                Privacy
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                Terms
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
