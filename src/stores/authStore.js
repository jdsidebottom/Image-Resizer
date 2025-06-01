import { create } from 'zustand'
import { supabase } from '../lib/supabase'

// Create a single subscription reference that can be cleaned up
let authSubscription = null

export const useAuthStore = create((set, get) => ({
  session: null,
  user: null,
  loading: true,
  error: null,
  
  initialize: async () => {
    try {
      set({ loading: true, error: null })
      
      // Get initial session
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session) {
        set({ 
          session, 
          user: session.user,
          loading: false 
        })
      } else {
        set({ session: null, user: null, loading: false })
      }
      
      // Clean up any existing subscription before creating a new one
      if (authSubscription) {
        authSubscription.unsubscribe()
      }
      
      // Set up auth listener
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event, session) => {
          set({ 
            session, 
            user: session?.user || null,
            loading: false 
          })
        }
      )
      
      // Store the subscription reference
      authSubscription = subscription
      
      // Return cleanup function
      return () => {
        if (authSubscription) {
          authSubscription.unsubscribe()
          authSubscription = null
        }
      }
    } catch (error) {
      console.error('Auth store initialization error:', error)
      set({ error: error.message, loading: false })
    }
  },
  
  signIn: async (email, password) => {
    try {
      set({ loading: true, error: null })
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) throw error
      
      if (data?.session) {
        set({ 
          session: data.session, 
          user: data.user,
          loading: false 
        })
        return { success: true }
      } else {
        throw new Error('No session returned after login')
      }
    } catch (error) {
      console.error('Sign in error:', error)
      set({ error: error.message, loading: false })
      return { success: false, error: error.message }
    }
  },
  
  signUp: async (email, password) => {
    try {
      set({ loading: true, error: null })
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin + '/login',
          data: {
            email: email
          }
        }
      })
      
      if (error) throw error
      
      set({ loading: false })
      
      if (data.user && !data.session) {
        return { 
          success: true, 
          message: 'Registration successful! Please check your email to confirm your account.' 
        }
      } else if (data.user && data.session) {
        set({ 
          session: data.session, 
          user: data.user 
        })
        return { 
          success: true, 
          message: 'Registration successful! You are now logged in.' 
        }
      } else {
        throw new Error('Failed to create user account')
      }
    } catch (error) {
      console.error('Sign up error:', error)
      set({ error: error.message, loading: false })
      return { success: false, error: error.message }
    }
  },
  
  signOut: async () => {
    try {
      set({ loading: true, error: null })
      const { error } = await supabase.auth.signOut()
      
      if (error) throw error
      
      set({ 
        session: null, 
        user: null,
        loading: false 
      })
      
      return { success: true }
    } catch (error) {
      console.error('Sign out error:', error)
      set({ error: error.message, loading: false })
      return { success: false, error: error.message }
    }
  },
  
  fetchUserData: async () => {
    const { user } = get()
    if (!user) return null
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
        
      if (error) throw error
      
      return data
    } catch (error) {
      console.error('Error fetching user data:', error)
      return null
    }
  }
}))
