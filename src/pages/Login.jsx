import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import { useAuthStore } from '../stores/authStore'
import LoadingSpinner from '../components/LoadingSpinner'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { signIn, loading } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!email || !password) {
      toast.error('Please fill in all fields')
      return
    }
    
    try {
      setIsSubmitting(true)
      console.log('Attempting login with:', { email })
      
      const result = await signIn(email, password)
      
      if (result.success) {
        toast.success('Logged in successfully')
        navigate('/dashboard')
      } else {
        toast.error(result.error || 'Failed to login')
      }
    } catch (error) {
      console.error('Login error:', error)
      toast.error(error.message || 'An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="text-3xl font-bold mb-6 text-center">Login</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="your@email.com"
              required
              disabled={isSubmitting}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
              required
              disabled={isSubmitting}
            />
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isSubmitting || loading}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded font-medium text-white disabled:opacity-70"
          >
            {isSubmitting ? (
              <div className="flex justify-center items-center">
                <LoadingSpinner size={20} color="#ffffff" />
                <span className="ml-2">Logging in...</span>
              </div>
            ) : (
              'Login'
            )}
          </motion.button>
        </form>
        
        <div className="mt-6 text-center">
          <p>
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-400 hover:underline">
              Register
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default Login
