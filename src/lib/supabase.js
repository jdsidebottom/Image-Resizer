import { createClient } from '@supabase/supabase-js';

// Get environment variables with fallbacks to prevent errors
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://hfsnqhcysdcoffbzualk.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhmc25xaGN5c2Rjb2ZmYnp1YWxrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2MDU3MzgsImV4cCI6MjA2MzE4MTczOH0.gpXnVO1SsLToNk7amlY-zum9ny-J3vsOanjrjFuzSSo';

// Create Supabase client with error handling
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Function to check if Supabase connection is working
export const checkSupabaseConnection = async () => {
  try {
    // Simple query to check connection
    const { error } = await supabase.from('profiles').select('id').limit(1);
    
    // If there's an error with the query but it's not a connection error
    if (error && !error.message.includes('connection')) {
      console.warn('Supabase query error, but connection seems ok:', error.message);
      return true;
    }
    
    return !error;
  } catch (err) {
    console.error('Supabase connection check failed:', err.message);
    return false;
  }
};
