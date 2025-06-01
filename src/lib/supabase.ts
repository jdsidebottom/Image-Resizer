import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with fallbacks
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://hfsnqhcysdcoffbzualk.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhmc25xaGN5c2Rjb2ZmYnp1YWxrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2MDU3MzgsImV4cCI6MjA2MzE4MTczOH0.gpXnVO1SsLToNk7amlY-zum9ny-J3vsOanjrjFuzSSo';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Using fallback values.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Authentication functions
export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    return { user: data.user, session: data.session };
  } catch (error: any) {
    console.error('Sign in error:', error);
    throw error;
  }
};

export const signUp = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (error) throw error;
    return { user: data.user, session: data.session };
  } catch (error: any) {
    console.error('Sign up error:', error);
    throw error;
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error: any) {
    console.error('Sign out error:', error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const { data, error } = await supabase.auth.getUser();
    
    if (error) throw error;
    return { user: data.user };
  } catch (error: any) {
    console.error('Get current user error:', error);
    throw error;
  }
};

export const resetPassword = async (email: string) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  } catch (error: any) {
    console.error('Reset password error:', error);
    throw error;
  }
};

// User profile functions
export const updateUserProfile = async (userId: string, updates: any) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId);
    
    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error('Update user profile error:', error);
    throw error;
  }
};

export const getUserProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error('Get user profile error:', error);
    throw error;
  }
};

// Image processing history functions
export const saveImageProcessingHistory = async (userId: string, details: any) => {
  try {
    const { data, error } = await supabase
      .from('image_history')
      .insert([
        { user_id: userId, ...details }
      ]);
    
    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error('Save image processing history error:', error);
    throw error;
  }
};

export const getUserImageHistory = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('image_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error('Get user image history error:', error);
    throw error;
  }
};

// Subscription functions
export const getUserSubscription = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) {
      // If no subscription is found, return a default free tier
      if (error.code === 'PGRST116') {
        return { 
          tier: 'free',
          monthly_limit: 25,
          features: ['basic_resize']
        };
      }
      throw error;
    }
    
    return data;
  } catch (error: any) {
    console.error('Get user subscription error:', error);
    throw error;
  }
};

export const getProcessedImagesCount = async (userId: string, period: 'month' | 'year' = 'month') => {
  try {
    const now = new Date();
    let startDate;
    
    if (period === 'month') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    } else {
      startDate = new Date(now.getFullYear(), 0, 1);
    }
    
    const { count, error } = await supabase
      .from('image_history')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('created_at', startDate.toISOString());
    
    if (error) throw error;
    return count || 0;
  } catch (error: any) {
    console.error('Get processed images count error:', error);
    throw error;
  }
};
