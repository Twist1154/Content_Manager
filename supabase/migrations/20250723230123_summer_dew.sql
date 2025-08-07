/*
  # Fix handle_new_user function for email signup

  1. Issues Fixed
    - Remove direct UPDATE to auth.users table (causes permission issues)
    - Add proper exception handling for unique violations
    - Simplify the function to focus only on profile creation
    - Use the role from raw_app_meta_data if available, otherwise default to 'client'

  2. Security
    - Function runs with SECURITY DEFINER to bypass RLS
    - Proper error handling to prevent signup failures
    - Only creates profiles, doesn't modify auth metadata
*/

-- Drop and recreate the function with proper error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
    RETURNS trigger
    LANGUAGE plpgsql
    SECURITY DEFINER SET search_path = public
AS $$
DECLARE
    user_role text;
BEGIN
    -- Extract role from app metadata, default to 'client'
    user_role := COALESCE(
            (NEW.raw_app_meta_data->>'role')::text,
            'client'
                 );

    -- Ensure role is valid
    IF user_role NOT IN ('client', 'admin') THEN
        user_role := 'client';
    END IF;

    -- Insert profile with proper error handling
    BEGIN
        INSERT INTO public.profiles (id, email, role)
        VALUES (NEW.id, NEW.email, user_role);
    EXCEPTION
        WHEN unique_violation THEN
            -- Profile already exists, update it instead
            UPDATE public.profiles
            SET email = NEW.email, role = user_role
            WHERE id = NEW.id;
        WHEN OTHERS THEN
            -- Log the error but don't fail the user creation
            RAISE WARNING 'Failed to create/update profile for user %: %', NEW.id, SQLERRM;
    END;

    RETURN NEW;
END;
$$;

-- Ensure proper ownership and permissions
    ALTER FUNCTION public.handle_new_user() OWNER TO postgres;

-- Grant execute permissions to all necessary roles
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO anon;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;

-- Recreate the trigger to ensure it's properly set up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Add a policy to allow the trigger function to insert profiles
-- This ensures the function can bypass RLS when creating profiles
DROP POLICY IF EXISTS "Allow profile creation during signup" ON profiles;
CREATE POLICY "Allow profile creation during signup"
    ON profiles
    FOR INSERT
    TO authenticated, anon
    WITH CHECK (
    -- Allow users to insert their own profile
    auth.uid() = id
        OR
        -- Allow service role (used by triggers) to insert
    current_setting('role') = 'service_role'
    );