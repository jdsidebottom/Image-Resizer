/*
  # Create subscriptions table

  1. New Tables
    - `subscriptions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles.id)
      - `tier` (text, default 'free')
      - `monthly_limit` (integer, default 25)
      - `features` (text array, default '{"basic_resize"}')
      - `start_date` (timestamptz, default now())
      - `end_date` (timestamptz, nullable)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())
  2. Security
    - Enable RLS on `subscriptions` table
    - Add policy for authenticated users to read their own subscription
*/

CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  tier TEXT DEFAULT 'free',
  monthly_limit INTEGER DEFAULT 25,
  features TEXT[] DEFAULT '{"basic_resize"}',
  start_date TIMESTAMPTZ DEFAULT now(),
  end_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own subscription"
  ON subscriptions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);
