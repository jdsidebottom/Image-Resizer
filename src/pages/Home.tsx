import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl dark:text-white">
          <span className="block">Professional Image Resizing</span>
          <span className="block text-indigo-600 dark:text-indigo-400">for Content Creators</span>
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl dark:text-gray-300">
          Resize, optimize, and batch process your images with ease. Perfect for social media, websites, and digital marketing.
        </p>
        <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
          <div className="rounded-md shadow">
            <Link to="/register" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10">
              Get started
            </Link>
          </div>
          <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
            <Link to="/pricing" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10 dark:bg-gray-800 dark:text-indigo-400 dark:hover:bg-gray-700">
              View pricing
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase dark:text-indigo-400">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
              Everything you need for image processing
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto dark:text-gray-300">
              Powerful tools designed specifically for content creators and marketers.
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              {[
                {
                  name: 'Batch Processing',
                  description: 'Process multiple images at once with the same settings to save time.',
                  icon: '📦',
                },
                {
                  name: 'Social Media Presets',
                  description: 'Quickly resize images to the perfect dimensions for any social platform.',
                  icon: '📱',
                },
                {
                  name: 'Custom Dimensions',
                  description: 'Set exact pixel dimensions or use percentage scaling for perfect results.',
                  icon: '📏',
                },
                {
                  name: 'Format Conversion',
                  description: 'Convert between JPG, PNG, and WebP formats for optimal file size and quality.',
                  icon: '🔄',
                },
              ].map((feature) => (
                <div key={feature.name} className="relative">
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                    <span className="text-xl">{feature.icon}</span>
                  </div>
                  <div className="ml-16">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">{feature.name}</h3>
                    <p className="mt-2 text-base text-gray-500 dark:text-gray-300">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-indigo-700 dark:bg-indigo-800 rounded-xl shadow-sm">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to streamline your workflow?</span>
            <span className="block">Start using ResizeMaster today.</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-indigo-200">
            Join thousands of content creators who save time with our powerful image processing tools.
          </p>
          <Link
            to="/register"
            className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 sm:w-auto"
          >
            Sign up for free
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
