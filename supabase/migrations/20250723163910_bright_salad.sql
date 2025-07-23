/*
  # Add admin policies for client management

  1. New Policies
    - Allow admins to read all profiles (client accounts)
    - Allow admins to update all profiles (for account management)
    - Allow admins to delete profiles (for account removal)
    - Allow admins to insert profiles (for creating client accounts)
    - Allow admins to read all stores (for client store management)
    - Allow admins to update all stores (for store management)
    - Allow admins to delete stores (for store removal)
    - Allow admins to insert stores (for creating stores on behalf of clients)
    - Allow admins to update all content (for content management)
    - Allow admins to delete all content (for content removal)
    - Allow admins to insert content (for uploading on behalf of clients)

  2. Security
    - All policies check that the user has 'admin' role in profiles table
    - Maintains existing user policies while adding admin privileges
    - Uses EXISTS clause to verify admin status
*/

-- Admin policies for profiles table
CREATE POLICY "Admins can read all profiles"
  ON profiles
  FOR SELECT
                 TO authenticated
                 USING (
                 EXISTS (
                 SELECT 1 FROM profiles
                 WHERE profiles.id = auth.uid()
                 AND profiles.role = 'admin'
                 )
                 );

CREATE POLICY "Admins can update all profiles"
  ON profiles
  FOR UPDATE
                 TO authenticated
                 USING (
                 EXISTS (
                 SELECT 1 FROM profiles
                 WHERE profiles.id = auth.uid()
                 AND profiles.role = 'admin'
                 )
                 );

CREATE POLICY "Admins can delete all profiles"
  ON profiles
  FOR DELETE
TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can insert profiles"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Admin policies for stores table
CREATE POLICY "Admins can update all stores"
  ON stores
  FOR UPDATE
                        TO authenticated
                        USING (
                        EXISTS (
                        SELECT 1 FROM profiles
                        WHERE profiles.id = auth.uid()
                        AND profiles.role = 'admin'
                        )
                        );

CREATE POLICY "Admins can delete all stores"
  ON stores
  FOR DELETE
TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can insert stores"
  ON stores
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Admin policies for content table
CREATE POLICY "Admins can update all content"
  ON content
  FOR UPDATE
                        TO authenticated
                        USING (
                        EXISTS (
                        SELECT 1 FROM profiles
                        WHERE profiles.id = auth.uid()
                        AND profiles.role = 'admin'
                        )
                        );

CREATE POLICY "Admins can delete all content"
  ON content
  FOR DELETE
TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can insert content"
  ON content
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Admin policies for storage objects (content files)
CREATE POLICY "Admins can update all content files"
  ON storage.objects
  FOR UPDATE
                        TO authenticated
                        USING (
                        bucket_id = 'content' AND
                        EXISTS (
                        SELECT 1 FROM profiles
                        WHERE profiles.id = auth.uid()
                        AND profiles.role = 'admin'
                        )
                        );

CREATE POLICY "Admins can delete all content files"
  ON storage.objects
  FOR DELETE
TO authenticated
  USING (
    bucket_id = 'content' AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can insert content files"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'content' AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );