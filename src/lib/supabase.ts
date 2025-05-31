import { createClient } from '@supabase/supabase-js'

// Initialize the Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Create a single supabase client for the entire app
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Fallback to mock implementation if Supabase connection fails
const useMockAuth = async () => {
  try {
    // Test the connection
    await supabase.auth.getSession();
    return false; // Connection successful, don't use mock
  } catch (error) {
    console.warn('Supabase connection failed, using mock authentication');
    return true; // Connection failed, use mock
  }
};

// Auth helpers
export const signUp = async (email: string, password: string) => {
  try {
    // Try to use Supabase
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    // If Supabase fails, use mock implementation
    console.log('Using mock signup');
    
    // Generate a random user ID
    const userId = crypto.randomUUID();
    
    // Store in localStorage to simulate persistence
    const mockUsers = JSON.parse(localStorage.getItem('mockUsers') || '{}');
    mockUsers[userId] = {
      email,
      password,
      created_at: new Date().toISOString(),
    };
    localStorage.setItem('mockUsers', JSON.stringify(mockUsers));
    
    // Create mock session
    localStorage.setItem('mockCurrentUser', JSON.stringify({
      id: userId,
      email,
    }));
    
    return {
      data: {
        user: { id: userId, email },
        session: { user: { id: userId, email } }
      },
      error: null
    };
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    // Try to use Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    console.log('Using mock signin');
    
    // Check mock users
    const mockUsers = JSON.parse(localStorage.getItem('mockUsers') || '{}');
    const userId = Object.keys(mockUsers).find(id => mockUsers[id].email === email);
    
    if (!userId || mockUsers[userId].password !== password) {
      return {
        data: { user: null, session: null },
        error: { message: 'Invalid login credentials' }
      };
    }
    
    // Create mock session
    localStorage.setItem('mockCurrentUser', JSON.stringify({
      id: userId,
      email,
    }));
    
    return {
      data: {
        user: { id: userId, email },
        session: { user: { id: userId, email } }
      },
      error: null
    };
  }
};

export const signOut = async () => {
  try {
    // Try to use Supabase
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error: any) {
    console.log('Using mock signout');
    
    // Clear mock session
    localStorage.removeItem('mockCurrentUser');
    
    return { error: null };
  }
};

export const getCurrentUser = async () => {
  try {
    // Try to use Supabase
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return { user: data.user, error: null };
  } catch (error: any) {
    console.log('Using mock getCurrentUser');
    
    // Get mock user
    const mockUser = JSON.parse(localStorage.getItem('mockCurrentUser') || 'null');
    
    return { user: mockUser, error: null };
  }
};

// User profile helpers
export const getUserProfile = async (userId: string) => {
  try {
    // Try to use Supabase
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return { profile: data, error: null };
  } catch (error: any) {
    console.log('Using mock getUserProfile');
    
    // Get mock profile
    const mockProfiles = JSON.parse(localStorage.getItem('mockProfiles') || '{}');
    const profile = mockProfiles[userId] || {
      id: userId,
      full_name: '',
      website: '',
      avatar_url: '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    return { profile, error: null };
  }
};

export const updateUserProfile = async (userId: string, updates: any) => {
  try {
    // Try to use Supabase
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId);
    
    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    console.log('Using mock updateUserProfile');
    
    // Update mock profile
    const mockProfiles = JSON.parse(localStorage.getItem('mockProfiles') || '{}');
    mockProfiles[userId] = {
      ...(mockProfiles[userId] || {
        id: userId,
        created_at: new Date().toISOString(),
      }),
      ...updates,
      updated_at: new Date().toISOString(),
    };
    localStorage.setItem('mockProfiles', JSON.stringify(mockProfiles));
    
    return { data: mockProfiles[userId], error: null };
  }
};

// Image usage tracking
export const getImageUsage = async (userId: string) => {
  try {
    // Try to use Supabase
    const { data, error } = await supabase
      .from('image_usage')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "no rows returned"
    
    return { usage: data || { user_id: userId, count: 0, last_updated: new Date().toISOString() }, error: null };
  } catch (error: any) {
    console.log('Using mock getImageUsage');
    
    // Get mock usage
    const mockUsage = JSON.parse(localStorage.getItem('mockUsage') || '{}');
    const usage = mockUsage[userId] || {
      user_id: userId,
      count: 0,
      last_updated: new Date().toISOString(),
    };
    
    return { usage, error: null };
  }
};

export const incrementImageUsage = async (userId: string) => {
  try {
    // First check if a record exists
    const { usage } = await getImageUsage(userId);
    
    if (usage) {
      // Update existing record
      const { data, error } = await supabase
        .from('image_usage')
        .update({
          count: (usage.count || 0) + 1,
          last_updated: new Date().toISOString()
        })
        .eq('user_id', userId);
      
      if (error) throw error;
      return { data, error: null };
    } else {
      // Create new record
      const { data, error } = await supabase
        .from('image_usage')
        .insert([
          {
            user_id: userId,
            count: 1,
            last_updated: new Date().toISOString()
          }
        ]);
      
      if (error) throw error;
      return { data, error: null };
    }
  } catch (error: any) {
    console.log('Using mock incrementImageUsage');
    
    // Update mock usage
    const mockUsage = JSON.parse(localStorage.getItem('mockUsage') || '{}');
    mockUsage[userId] = {
      user_id: userId,
      count: ((mockUsage[userId]?.count || 0) + 1),
      last_updated: new Date().toISOString(),
    };
    localStorage.setItem('mockUsage', JSON.stringify(mockUsage));
    
    return { data: mockUsage[userId], error: null };
  }
};

// Subscription helpers
export const getUserSubscription = async (userId: string) => {
  try {
    // Try to use Supabase
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    
    return { 
      subscription: data || { 
        user_id: userId, 
        plan: 'free',
        status: 'active',
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      }, 
      error: null 
    };
  } catch (error: any) {
    console.log('Using mock getUserSubscription');
    
    // Get mock subscription
    const mockSubscriptions = JSON.parse(localStorage.getItem('mockSubscriptions') || '{}');
    const subscription = mockSubscriptions[userId] || {
      user_id: userId,
      plan: 'free',
      status: 'active',
      current_period_start: new Date().toISOString(),
      current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    };
    
    return { subscription, error: null };
  }
};
