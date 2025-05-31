import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="text-center">
        <h1 className="text-9xl font-extrabold text-indigo-600 dark:text-indigo-400">404</h1>
        <h2 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">Page not found</h2>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
          Sorry, we couldn't find the page you're looking for.
        </p>
        <div className="mt-6">
          <Link to="/" className="btn btn-primary">
            Go back home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
