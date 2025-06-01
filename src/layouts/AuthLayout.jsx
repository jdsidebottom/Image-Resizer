import { Outlet, Link } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <Link to="/" className="inline-block">
              <h2 className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
                ResizeMaster
              </h2>
            </Link>
            <Outlet />
          </div>
        </div>
      </div>
      <footer className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">
        &copy; {new Date().getFullYear()} ResizeMaster. All rights reserved.
      </footer>
    </div>
  );
};

export default AuthLayout;
