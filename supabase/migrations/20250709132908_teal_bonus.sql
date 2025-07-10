/*
  # Create storage bucket for content files

  1. Storage Setup
    - Create 'content' storage bucket for file uploads
    - Set bucket to public for easy access to uploaded files

  2. Security
    - Add RLS policies for bucket access
    - Users can upload to their own folders
    - Users can read their own files
    - Admins can read all files
*/

-- Create storage bucket for content files
INSERT INTO storage.buckets (id, name, public)
VALUES ('content', 'content', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload files
CREATE POLICY "Users can upload content files"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'content');

-- Allow users to read their own files and admins to read all files
CREATE POLICY "Users can read content files"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'content' AND (
      -- Users can read their own files (files in folders named with their user ID)
      (storage.foldername(name))[1] = auth.uid()::text
      OR
      -- Admins can read all files
      EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
      )
    )
  );

-- Allow users to update their own files
CREATE POLICY "Users can update own content files"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'content' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow users to delete their own files
CREATE POLICY "Users can delete own content files"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'content' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );