import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import { useAuthStore } from '../stores/authStore'
import LoadingSpinner from '../components/LoadingSpinner'

const Dashboard = () => {
  const { user, signOut, fetchUserData } = useAuthStore()
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true)
        const data = await fetchUserData()
        setProfile(data)
      } catch (error) {
        console.error('Error loading user data:', error)
        toast.error('Failed to load user data')
      } finally {
        setLoading(false)
      }
    }

    loadUserData()
  }, [fetchUserData])

  const handleSignOut = async () => {
    const result = await signOut()
    if (result.success) {
      toast.success('Logged out successfully')
      navigate('/login')
    } else {
      toast.error(result.error || 'Failed to log out')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size={60} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">ResizeMaster</h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSignOut}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded"
          >
            Sign Out
          </motion.button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8"
        >
          <h2 className="text-2xl font-bold mb-4">Welcome, {user?.email}</h2>
          <p className="text-gray-300">
            You are now logged into your ResizeMaster dashboard. Here you can manage your images and resize them according to your needs.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-gray-800 rounded-lg shadow-lg p-6"
          >
            <h3 className="text-xl font-bold mb-3">Upload Image</h3>
            <p className="text-gray-300 mb-4">Upload a new image to resize</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded font-medium"
            >
              Upload
            </motion.button>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="bg-gray-800 rounded-lg shadow-lg p-6"
          >
            <h3 className="text-xl font-bold mb-3">Recent Images</h3>
            <p className="text-gray-300 mb-4">View and manage your recently uploaded images</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded font-medium"
            >
              View Gallery
            </motion.button>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="bg-gray-800 rounded-lg shadow-lg p-6"
          >
            <h3 className="text-xl font-bold mb-3">Account Settings</h3>
            <p className="text-gray-300 mb-4">Manage your account preferences</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded font-medium"
            >
              Settings
            </motion.button>
          </motion.div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard
