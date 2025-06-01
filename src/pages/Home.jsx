import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-3xl mx-auto"
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-6">Image Resizer</h1>
        <p className="text-xl mb-8">
          Easily resize your images for any purpose. Fast, secure, and free.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/login">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium"
            >
              Login
            </motion.button>
          </Link>
          
          <Link to="/register">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gray-700 text-white rounded-lg font-medium"
            >
              Register
            </motion.button>
          </Link>
        </div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
      >
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-3">Fast Processing</h3>
          <p>Resize your images in seconds with our optimized algorithms.</p>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-3">Multiple Formats</h3>
          <p>Support for JPG, PNG, WebP and more popular image formats.</p>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-3">Secure Storage</h3>
          <p>Your images are securely stored and automatically deleted after processing.</p>
        </div>
      </motion.div>
    </div>
  )
}

export default Home
