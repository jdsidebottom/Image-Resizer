/*
  # Create image history table

  1. New Tables
    - `image_history`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles.id)
      - `original_filename` (text)
      - `original_size` (integer)
      - `processed_size` (integer)
      - `width` (integer)
      - `height` (integer)
      - `format` (text)
      - `created_at` (timestamptz, default now())
  2. Security
    - Enable RLS on `image_history` table
    - Add policy for authenticated users to read their own image history
    - Add policy for authenticated users to insert their own image history
*/

CREATE TABLE IF NOT EXISTS image_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  original_filename TEXT,
  original_size INTEGER,
  processed_size INTEGER,
  width INTEGER,
  height INTEGER,
  format TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE image_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own image history"
  ON image_history
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own image history"
  ON image_history
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
