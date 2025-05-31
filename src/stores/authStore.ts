import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface UserData {
  id: string
  email: string
  subscription_tier: 'free' | 'pro'
  monthly_usage: number
  monthly_limit: number
  created_at: string
}

interface AuthState {
  user: { id: string; email: string } | null
  userData: UserData | null
  isLoading: boolean
  error: string | null
  setUser: (user: { id: string; email: string } | null) => void
  setUserData: (userData: UserData | null) => void
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  fetchUserData: () => Promise<void>
  incrementUsage: (count?: number) => Promise<void>
}

// Mock user database for local development
const MOCK_USERS: Record<string, { password: string; userData: UserData }> = {}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      userData: null,
      isLoading: false,
      error: null,
      
      setUser: (user) => set({ user }),
      
      setUserData: (userData) => set({ userData }),
      
      signIn: async (email, password) => {
        try {
          set({ isLoading: true, error: null })
          
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 500))
          
          const userRecord = Object.values(MOCK_USERS).find(
            record => record.userData.email === email
          )
          
          if (!userRecord || userRecord.password !== password) {
            throw new Error('Invalid email or password')
          }
          
          const user = { 
            id: userRecord.userData.id, 
            email: userRecord.userData.email 
          }
          
          set({ user, userData: userRecord.userData })
          
        } catch (error) {
          set({ error: (error as Error).message })
        } finally {
          set({ isLoading: false })
        }
      },
      
      signUp: async (email, password) => {
        try {
          set({ isLoading: true, error: null })
          
          // Check if user already exists
          const userExists = Object.values(MOCK_USERS).some(
            record => record.userData.email === email
          )
          
          if (userExists) {
            throw new Error('User already exists')
          }
          
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 500))
          
          const userId = crypto.randomUUID()
          const now = new Date().toISOString()
          
          const userData: UserData = {
            id: userId,
            email,
            subscription_tier: 'free',
            monthly_usage: 0,
            monthly_limit: 25,
            created_at: now,
          }
          
          // Store in mock database
          MOCK_USERS[userId] = {
            password,
            userData,
          }
          
          const user = { id: userId, email }
          
          set({ user, userData })
          
        } catch (error) {
          set({ error: (error as Error).message })
        } finally {
          set({ isLoading: false })
        }
      },
      
      signOut: async () => {
        try {
          set({ isLoading: true, error: null })
          
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 300))
          
          set({ user: null, userData: null })
        } catch (error) {
          set({ error: (error as Error).message })
        } finally {
          set({ isLoading: false })
        }
      },
      
      fetchUserData: async () => {
        const { user } = get()
        
        if (!user) return
        
        try {
          set({ isLoading: true, error: null })
          
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 300))
          
          const userRecord = MOCK_USERS[user.id]
          
          if (!userRecord) {
            throw new Error('User data not found')
          }
          
          set({ userData: userRecord.userData })
        } catch (error) {
          set({ error: (error as Error).message })
        } finally {
          set({ isLoading: false })
        }
      },
      
      incrementUsage: async (count = 1) => {
        const { user, userData } = get()
        
        if (!user || !userData) return
        
        try {
          const newUsage = userData.monthly_usage + count
          
          // Update in-memory mock database
          if (MOCK_USERS[user.id]) {
            MOCK_USERS[user.id].userData.monthly_usage = newUsage
          }
          
          set({
            userData: {
              ...userData,
              monthly_usage: newUsage,
            },
          })
        } catch (error) {
          console.error('Failed to increment usage:', error)
        }
      },
    }),
    {
      name: 'image-resizer-auth',
    }
  )
)
