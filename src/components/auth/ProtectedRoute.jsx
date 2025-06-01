import { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import LoadingSpinner from '../LoadingSpinner';

const ProtectedRoute = () => {
  const { user, loading } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Simple check to see if auth is done loading
    if (!loading) {
      // Add a small delay to ensure auth state is fully processed
      const timer = setTimeout(() => {
        setIsChecking(false);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [loading]);

  if (loading || isChecking) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner size={60} />
      </div>
    );
  }

  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
