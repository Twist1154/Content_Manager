/*
  # Create content table

  1. New Tables
    - `content`
      - `id` (uuid, primary key, default gen_random_uuid())
      - `store_id` (uuid, not null, references stores.id)
      - `user_id` (uuid, not null, references profiles.id)
      - `title` (text, not null)
      - `type` (text, not null, check constraint for 'image', 'video', 'music')
      - `file_url` (text, not null)
      - `file_size` (bigint, not null, default 0)
      - `start_date` (date, not null)
      - `end_date` (date, not null)
      - `recurrence_type` (text, not null, default 'none')
      - `recurrence_days` (text array, nullable)
      - `created_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `content` table
    - Add policy for users to read their own content
    - Add policy for users to insert their own content
    - Add policy for users to update their own content
    - Add policy for admins to read all content

  3. Indexes
    - Index on user_id for faster queries
    - Index on store_id for faster queries
    - Index on created_at for sorting
    - Index on type for filtering
*/

CREATE TABLE IF NOT EXISTS content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id uuid NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  type text NOT NULL CHECK (type IN ('image', 'video', 'music')),
  file_url text NOT NULL,
  file_size bigint NOT NULL DEFAULT 0,
  start_date date NOT NULL,
  end_date date NOT NULL,
  recurrence_type text NOT NULL DEFAULT 'none' CHECK (recurrence_type IN ('none', 'daily', 'weekly', 'monthly', 'custom')),
  recurrence_days text[],
  created_at timestamptz DEFAULT now()
);

ALTER TABLE content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own content"
  ON content
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own content"
  ON content
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own content"
  ON content
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can read all content"
  ON content
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_content_user_id ON content(user_id);
CREATE INDEX IF NOT EXISTS idx_content_store_id ON content(store_id);
CREATE INDEX IF NOT EXISTS idx_content_created_at ON content(created_at);
CREATE INDEX IF NOT EXISTS idx_content_type ON content(type);
CREATE INDEX IF NOT EXISTS idx_content_start_date ON content(start_date);
CREATE INDEX IF NOT EXISTS idx_content_end_date ON content(end_date);