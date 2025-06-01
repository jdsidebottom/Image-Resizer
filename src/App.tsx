import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { getCurrentUser } from './lib/supabase';

// Import your components here
// Example:
// import Home from './pages/Home';
// import Dashboard from './pages/Dashboard';
// import Login from './pages/Login';
// import Register from './pages/Register';

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { user } = await getCurrentUser();
        setUser(user);
      } catch (error) {
        console.error('Error checking user:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        {/* Add your routes here */}
        {/* Example:
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
        */}
        
        {/* Temporary placeholder route */}
        <Route path="/" element={
          <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <h1 className="text-4xl font-bold text-indigo-600 mb-4">ResizeMaster</h1>
            <p className="text-xl text-gray-700 mb-8">Professional image resizing for content creators</p>
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
              <p className="text-gray-600 mb-4">
                Welcome to ResizeMaster! This application is currently in development.
              </p>
              <p className="text-gray-600">
                {user ? `Logged in as: ${user.email}` : 'Not logged in'}
              </p>
            </div>
          </div>
        } />
      </Routes>
    </div>
  );
};

export default App;
