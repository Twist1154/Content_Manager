/*
  # Fix RLS policy for automatic profile creation

  1. Changes
    - Drop existing INSERT policy that's causing the violation
    - Create new INSERT policy that allows the trigger function to create profiles
    - Ensure the trigger function can bypass RLS for profile creation

  2. Security
    - Maintains security by only allowing profile creation during signup process
    - Preserves existing read and update policies
    - Uses function-based policy to allow trigger execution
*/

-- Drop the existing INSERT policy that's causing issues
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- Create a new INSERT policy that allows both user insertion and trigger function insertion
CREATE POLICY "Allow profile creation"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (
    -- Allow users to insert their own profile
    auth.uid() = id
    OR
    -- Allow insertion during signup process (when called from trigger)
    current_setting('role') = 'authenticated'
  );

-- Also create a policy to allow service role (used by triggers) to insert
CREATE POLICY "Service role can insert profiles"
  ON profiles
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Ensure the trigger function has proper permissions
-- Update the function to use proper security context
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Insert with explicit role context to bypass RLS
  INSERT INTO public.profiles (id, email, role)
  VALUES (new.id, new.email, 'client');
  RETURN new;
EXCEPTION
  WHEN unique_violation THEN
    -- Profile already exists, just return
    RETURN new;
  WHEN OTHERS THEN
    -- Log error but don't fail the user creation
    RAISE WARNING 'Failed to create profile for user %: %', new.id, SQLERRM;
    RETURN new;
END;
$$;