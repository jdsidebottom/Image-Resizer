import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { supabase, checkSupabaseConnection } from './lib/supabase';

// Simple loading component
const Loading = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <h2 className="text-xl font-semibold text-gray-700">Loading application...</h2>
    </div>
  </div>
);

// Home page component
const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-12">
          <h1 className="text-3xl font-bold text-indigo-800">Image Resizer</h1>
          <nav>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow transition">
              Sign In
            </button>
          </nav>
        </header>
        
        <main>
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2 p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Resize Your Images Instantly</h2>
                <p className="text-gray-600 mb-6">
                  Upload, resize, and optimize your images in seconds. Perfect for websites, social media, and more.
                </p>
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg shadow-md transition transform hover:scale-105">
                  Get Started
                </button>
              </div>
              <div className="md:w-1/2 bg-indigo-100 p-8 flex items-center justify-center">
                <div className="bg-white p-4 rounded-lg shadow-lg transform rotate-3 transition hover:rotate-0">
                  <img 
                    src="https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=600" 
                    alt="Image resizing illustration" 
                    className="w-full h-auto rounded"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-16 grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Batch Processing</h3>
              <p className="text-gray-600">Resize multiple images at once to save time and effort.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Secure Storage</h3>
              <p className="text-gray-600">Your images are securely stored and accessible only to you.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Fast Processing</h3>
              <p className="text-gray-600">Our optimized algorithms ensure quick resizing without quality loss.</p>
            </div>
          </div>
        </main>
        
        <footer className="mt-16 text-center text-gray-600 py-8">
          <p>© 2023 Image Resizer. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

// Main App component
function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [connectionOk, setConnectionOk] = useState(true);

  useEffect(() => {
    // Check Supabase connection
    const checkConnection = async () => {
      const isConnected = await checkSupabaseConnection();
      setConnectionOk(isConnected);
      if (!isConnected) {
        console.error('Failed to connect to Supabase');
      }
    };
    
    checkConnection();
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setLoading(false);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Cleanup subscription
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Show loading state
  if (loading) {
    return <Loading />;
  }

  // Show connection error if Supabase connection failed
  if (!connectionOk) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Connection Error</h1>
          <p className="text-gray-700 mb-4">
            Unable to connect to the database. Please check your internet connection and try again.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Add more routes as needed */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
