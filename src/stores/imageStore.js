import { create } from 'zustand'
import { supabase } from '../supabase'

export const useImageStore = create((set, get) => ({
  images: [],
  selectedImageId: null,
  isLoading: false,
  error: null,
  
  // Add a new image
  addImage: (file, preview) => {
    const id = Date.now().toString()
    const newImage = {
      id,
      file,
      preview,
      isProcessing: false,
      processed: null
    }
    
    set(state => ({
      images: [...state.images, newImage],
      selectedImageId: id
    }))
    
    return id
  },
  
  // Select an image
  selectImage: (id) => {
    set({ selectedImageId: id })
  },
  
  // Process an image
  processImage: async (id) => {
    const { images } = get()
    const image = images.find(img => img.id === id)
    
    if (!image) return
    
    set(state => ({
      images: state.images.map(img => 
        img.id === id ? { ...img, isProcessing: true } : img
      )
    }))
    
    try {
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Create a new image element to get dimensions
      const img = new Image()
      img.src = image.preview
      
      await new Promise((resolve) => {
        img.onload = resolve
      })
      
      // Calculate new dimensions
      const aspectRatio = img.width / img.height
      const newWidth = 800
      const newHeight = Math.round(newWidth / aspectRatio)
      
      // Create canvas for resizing
      const canvas = document.createElement('canvas')
      canvas.width = newWidth
      canvas.height = newHeight
      
      // Draw and resize image on canvas
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, newWidth, newHeight)
      
      // Convert to blob
      const blob = await new Promise(resolve => {
        canvas.toBlob(resolve, image.file.type)
      })
      
      // Create URL for preview
      const resizedImageUrl = URL.createObjectURL(blob)
      
      set(state => ({
        images: state.images.map(img => 
          img.id === id ? { 
            ...img, 
            isProcessing: false,
            processed: {
              url: resizedImageUrl,
              blob,
              width: newWidth,
              height: newHeight
            }
          } : img
        )
      }))
    } catch (error) {
      console.error('Error processing image:', error)
      
      set(state => ({
        images: state.images.map(img => 
          img.id === id ? { ...img, isProcessing: false } : img
        ),
        error: error.message
      }))
    }
  },
  
  // Remove an image
  removeImage: (id) => {
    const { images, selectedImageId } = get()
    
    // If removing the selected image, select another one if available
    let newSelectedId = selectedImageId
    if (selectedImageId === id) {
      const remainingImages = images.filter(img => img.id !== id)
      newSelectedId = remainingImages.length > 0 ? remainingImages[0].id : null
    }
    
    set(state => ({
      images: state.images.filter(img => img.id !== id),
      selectedImageId: newSelectedId
    }))
  }
}))
