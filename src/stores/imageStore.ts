import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface ImageFile {
  id: string
  name: string
  type: string
  size: number
  url: string
  originalWidth: number
  originalHeight: number
  lastModified: number
}

interface ImageState {
  images: ImageFile[]
  selectedImageIds: string[]
  isLoading: boolean
  addImages: (files: File[]) => Promise<void>
  removeImage: (id: string) => void
  removeSelectedImages: () => void
  selectImage: (id: string) => void
  deselectImage: (id: string) => void
  toggleSelectImage: (id: string) => void
  selectAllImages: () => void
  deselectAllImages: () => void
  clearImages: () => void
}

export const useImageStore = create<ImageState>()(
  persist(
    (set, get) => ({
      images: [],
      selectedImageIds: [],
      isLoading: false,
      
      addImages: async (files: File[]) => {
        set({ isLoading: true })
        
        try {
          const newImages = await Promise.all(
            files.map(async (file) => {
              const url = URL.createObjectURL(file)
              
              // Get image dimensions
              const dimensions = await new Promise<{ width: number; height: number }>(
                (resolve) => {
                  const img = new Image()
                  img.onload = () => {
                    resolve({
                      width: img.width,
                      height: img.height,
                    })
                  }
                  img.src = url
                }
              )
              
              return {
                id: crypto.randomUUID(),
                name: file.name,
                type: file.type,
                size: file.size,
                url,
                originalWidth: dimensions.width,
                originalHeight: dimensions.height,
                lastModified: file.lastModified,
              }
            })
          )
          
          set((state) => ({
            images: [...state.images, ...newImages],
          }))
        } finally {
          set({ isLoading: false })
        }
      },
      
      removeImage: (id: string) => {
        set((state) => {
          const imageToRemove = state.images.find((img) => img.id === id)
          
          if (imageToRemove) {
            // Revoke object URL to prevent memory leaks
            URL.revokeObjectURL(imageToRemove.url)
          }
          
          return {
            images: state.images.filter((img) => img.id !== id),
            selectedImageIds: state.selectedImageIds.filter((selectedId) => selectedId !== id),
          }
        })
      },
      
      removeSelectedImages: () => {
        set((state) => {
          // Revoke object URLs for selected images
          state.images
            .filter((img) => state.selectedImageIds.includes(img.id))
            .forEach((img) => URL.revokeObjectURL(img.url))
          
          return {
            images: state.images.filter((img) => !state.selectedImageIds.includes(img.id)),
            selectedImageIds: [],
          }
        })
      },
      
      selectImage: (id: string) => {
        set((state) => {
          if (state.selectedImageIds.includes(id)) return state
          
          return {
            selectedImageIds: [...state.selectedImageIds, id],
          }
        })
      },
      
      deselectImage: (id: string) => {
        set((state) => ({
          selectedImageIds: state.selectedImageIds.filter((selectedId) => selectedId !== id),
        }))
      },
      
      toggleSelectImage: (id: string) => {
        set((state) => {
          if (state.selectedImageIds.includes(id)) {
            return {
              selectedImageIds: state.selectedImageIds.filter(
                (selectedId) => selectedId !== id
              ),
            }
          } else {
            return {
              selectedImageIds: [...state.selectedImageIds, id],
            }
          }
        })
      },
      
      selectAllImages: () => {
        set((state) => ({
          selectedImageIds: state.images.map((img) => img.id),
        }))
      },
      
      deselectAllImages: () => {
        set({ selectedImageIds: [] })
      },
      
      clearImages: () => {
        set((state) => {
          // Revoke all object URLs
          state.images.forEach((img) => URL.revokeObjectURL(img.url))
          
          return {
            images: [],
            selectedImageIds: [],
          }
        })
      },
    }),
    {
      name: 'image-resizer-images',
    }
  )
)
