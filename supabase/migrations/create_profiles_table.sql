/*
  # Create profiles table

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users.id)
      - `email` (text, not null)
      - `subscription_tier` (text, default 'free')
      - `monthly_limit` (integer, default 25)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())
  2. Security
    - Enable RLS on `profiles` table
    - Add policy for authenticated users to read their own profile
    - Add policy for authenticated users to update their own profile
*/

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL,
  subscription_tier TEXT DEFAULT 'free',
  monthly_limit INTEGER DEFAULT 25,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);
