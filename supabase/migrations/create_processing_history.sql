/*
  # Create processing history table

  1. New Tables
    - `processing_history`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references user_profiles)
      - `image_count` (integer, not null)
      - `created_at` (timestamptz, default now())
  2. Security
    - Enable RLS on `processing_history` table
    - Add policies for authenticated users to read/insert their own data
*/

CREATE TABLE IF NOT EXISTS processing_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  image_count INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE processing_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own processing history"
  ON processing_history
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own processing history"
  ON processing_history
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
