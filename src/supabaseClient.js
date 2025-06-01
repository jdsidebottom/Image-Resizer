import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://hfsnqhcysdcoffbzualk.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhmc25xaGN5c2Rjb2ZmYnp1YWxrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2MDU3MzgsImV4cCI6MjA2MzE4MTczOH0.gpXnVO1SsLToNk7amlY-zum9ny-J3vsOanjrjFuzSSo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
