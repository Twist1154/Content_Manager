/*
  # Fix Recursive RLS Policies Migration
  
  This migration replaces all policies that use the recursive `EXISTS (SELECT ...)` 
  pattern with the correct, high-performance `(auth.jwt() ->> 'role' = 'admin')` check.
  It leverages the role synchronization already in place.
  
  Changes:
  1. Fix RLS Policies for the 'stores' table
  2. Fix RLS Policies for the 'content' table
  3. Fix RLS Policies for the 'audit_logs' table
  4. One-Time Backfill for Existing Users
  
  After applying this migration, users must log out and log back in to test the changes.
  This process issues a fresh JWT (authentication token) that contains the `role` claim.
*/

-- 1. Fix RLS Policies for the 'stores' table
-- This policy was causing a recursion error for admins.
DROP POLICY IF EXISTS "Admins can read all stores" ON stores;
CREATE POLICY "Admins can read all stores"
  ON stores
  FOR SELECT
  TO authenticated
  USING (
    -- CORRECTED: Reads role from the JWT instead of the profiles table.
    (auth.jwt() ->> 'role' = 'admin') AND
    is_deleted = FALSE
  );

-- 2. Fix RLS Policies for the 'content' table
-- This policy was also causing a recursion error for admins.
DROP POLICY IF EXISTS "Admins can read all content" ON content;
CREATE POLICY "Admins can read all content"
  ON content
  FOR SELECT
  TO authenticated
  USING (
    -- CORRECTED: Reads role from the JWT.
    (auth.jwt() ->> 'role' = 'admin') AND
    is_deleted = FALSE
  );

-- 3. Fix RLS Policies for the 'audit_logs' table
-- All of these policies were using the recursive anti-pattern.
DROP POLICY IF EXISTS "Admins can read audit logs" ON audit_logs;
CREATE POLICY "Admins can read audit logs"
  ON audit_logs
  FOR SELECT
  TO authenticated
  USING (
    -- CORRECTED: Reads role from the JWT.
    (auth.jwt() ->> 'role' = 'admin')
  );

DROP POLICY IF EXISTS "Admins can insert audit logs" ON audit_logs;
CREATE POLICY "Admins can insert audit logs"
  ON audit_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (
    -- CORRECTED: Reads role from the JWT.
    (auth.jwt() ->> 'role' = 'admin')
  );

DROP POLICY IF EXISTS "Admins can update audit logs" ON audit_logs;
CREATE POLICY "Admins can update audit logs"
  ON audit_logs
  FOR UPDATE
  TO authenticated
  USING (
    -- CORRECTED: Reads role from the JWT.
    (auth.jwt() ->> 'role' = 'admin')
  );

DROP POLICY IF EXISTS "Admins can delete audit logs" ON audit_logs;
CREATE POLICY "Admins can delete audit logs"
  ON audit_logs
  FOR DELETE
  TO authenticated
  USING (
    -- CORRECTED: Reads role from the JWT.
    (auth.jwt() ->> 'role' = 'admin')
  );

-- 4. One-Time Backfill for Existing Users
-- This ensures all of your current users have their role from 'profiles'
-- synced to their authentication metadata. This is crucial for the JWT check to work.
UPDATE auth.users u
SET raw_app_meta_data = u.raw_app_meta_data || jsonb_build_object('role', p.role)
FROM public.profiles p
WHERE p.id = u.id AND p.role IS NOT NULL;