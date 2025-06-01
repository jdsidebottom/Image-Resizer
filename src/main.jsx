import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

// Error handling for rendering errors
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error)
})

// Create root once
const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Root element not found')
}

const root = ReactDOM.createRoot(rootElement)

// Render app with error boundary
try {
  root.render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  )
} catch (error) {
  console.error('Error rendering application:', error)
  
  // Fallback rendering in case of error
  root.render(
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Application Error</h1>
        <p className="text-gray-700 mb-4">
          Sorry, something went wrong while loading the application.
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
        >
          Reload Application
        </button>
      </div>
    </div>
  )
}
