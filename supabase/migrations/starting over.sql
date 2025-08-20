/*
  ================================================================
  == HAPO MEDIA CONTENT HUB - COMPLETE DATABASE SETUP SCRIPT (V2)
  ================================================================
  This script will:
  1. Create all necessary tables: `profiles`, `stores`, `content`.
  2. Set up Supabase Storage for content files.
  3. Create the essential trigger functions to sync user data.
  4. Apply the final, correct, non-recursive RLS policies.
*/

-- =====================================================
-- STEP 1: CREATE TABLES
-- =====================================================

-- Create the `profiles` table
CREATE TABLE IF NOT EXISTS public.profiles (
                                               id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
                                               email text UNIQUE NOT NULL,
                                               role text NOT NULL DEFAULT 'client' CHECK (role IN ('client', 'admin')),
                                               created_at timestamptz DEFAULT now()
);
COMMENT ON TABLE public.profiles IS 'Stores user-specific metadata and roles.';

-- Create the `stores` table
CREATE TABLE IF NOT EXISTS public.stores (
                                             id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                                             user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
                                             name text NOT NULL,
                                             brand_company text NOT NULL,
                                             address text NOT NULL,
                                             latitude numeric,
                                             longitude numeric,
                                             created_at timestamptz DEFAULT now()
);
COMMENT ON TABLE public.stores IS 'Stores information about client-specific store locations.';

-- Create the `content` table
CREATE TABLE IF NOT EXISTS public.content (
                                              id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                                              store_id uuid NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
                                              user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
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
COMMENT ON TABLE public.content IS 'Stores metadata for uploaded digital signage content.';

-- =====================================================
-- STEP 2: SET UP STORAGE
-- =====================================================

-- Create the storage bucket for content files.
-- It's public for easy URL access, but RLS policies secure the content.
INSERT INTO storage.buckets (id, name, public)
VALUES ('content', 'content', true)
ON CONFLICT (id) DO NOTHING;
-- REMOVED: The invalid COMMENT ON BUCKET line.

-- =====================================================
-- STEP 3: CREATE TRIGGER FUNCTIONS FOR DATA SYNC
-- =====================================================

-- This function creates a user profile and syncs the role to the JWT.
CREATE OR REPLACE FUNCTION public.handle_new_user()
    RETURNS TRIGGER
    LANGUAGE plpgsql
    SECURITY DEFINER SET search_path = public
AS $$
BEGIN
    -- Create a new profile for the new user
    INSERT INTO public.profiles (id, email, role)
    VALUES (new.id, new.email, 'client');

    -- Sync the default 'client' role to the user's auth metadata (for JWT claims)
    UPDATE auth.users
    SET raw_app_meta_data = raw_app_meta_data || jsonb_build_object('role', 'client')
    WHERE id = new.id;

    RETURN new;
END;
$$;

-- This trigger calls the function whenever a new user signs up in `auth.users`
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- This function keeps the JWT role in sync if an admin changes a user's role.
CREATE OR REPLACE FUNCTION public.sync_user_role()
    RETURNS TRIGGER
    LANGUAGE plpgsql
    SECURITY DEFINER SET search_path = public
AS $$
BEGIN
    -- Check if the role column was actually changed
    IF (TG_OP = 'UPDATE' AND OLD.role <> NEW.role) THEN
        -- Update the user's auth metadata to reflect the new role
        UPDATE auth.users
        SET raw_app_meta_data = raw_app_meta_data || jsonb_build_object('role', NEW.role)
        WHERE id = NEW.id;
    END IF;

    RETURN NEW;
END;
$$;

-- This trigger calls the function whenever a profile's role is updated.
CREATE OR REPLACE TRIGGER trg_sync_user_role
    AFTER UPDATE ON public.profiles
    FOR EACH ROW EXECUTE PROCEDURE public.sync_user_role();


-- =====================================================
-- STEP 4: APPLY ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- First, clear out any old policies that might exist.
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can manage their own stores" ON public.stores;
DROP POLICY IF EXISTS "Admins can manage all stores" ON public.stores;
DROP POLICY IF EXISTS "Users can manage their own content" ON public.content;
DROP POLICY IF EXISTS "Admins can manage all content" ON public.content;
DROP POLICY IF EXISTS "Users can manage their own files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can manage all files" ON storage.objects;

--- PROFILES TABLE RLS ---
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
-- Admins can update any profile (e.g., to change a user's role from 'client' to 'admin').
CREATE POLICY "Admins can update any profile" ON public.profiles FOR UPDATE USING ((auth.jwt() ->> 'role') = 'admin');

--- STORES TABLE RLS ---
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;
-- `FOR ALL` covers SELECT, INSERT, UPDATE, DELETE for users on their own data.
CREATE POLICY "Users can manage their own stores" ON public.stores FOR ALL USING (auth.uid() = user_id);
-- `FOR ALL` covers all operations for admins.
CREATE POLICY "Admins can manage all stores" ON public.stores FOR ALL USING ((auth.jwt() ->> 'role') = 'admin');

--- CONTENT TABLE RLS ---
ALTER TABLE public.content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own content" ON public.content FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all content" ON public.content FOR ALL USING ((auth.jwt() ->> 'role') = 'admin');

--- STORAGE RLS ---
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
-- Users can manage files only within their own user-id named folder.
CREATE POLICY "Users can manage their own files" ON storage.objects FOR ALL
    USING ( bucket_id = 'content' AND (storage.foldername(name))[1] = auth.uid()::text );
-- Admins can do anything in the 'content' bucket.
CREATE POLICY "Admins can manage all files" ON storage.objects FOR ALL
    USING ( bucket_id = 'content' AND (auth.jwt() ->> 'role') = 'admin' );

-- =====================================================
-- SCRIPT COMPLETE
-- =====================================================