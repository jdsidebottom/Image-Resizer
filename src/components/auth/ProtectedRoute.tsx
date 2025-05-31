import { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

const ProtectedRoute = () => {
  const { user, fetchUserData } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (user) {
          await fetchUserData();
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [user, fetchUserData]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
