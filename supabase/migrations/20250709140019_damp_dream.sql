/*
  # Create automatic profile and role synchronization trigger (Updated)
    
  2. New Triggers  
    - Trigger on `auth.users` insert to create corresponding profile
    
  3. Security
    - Function runs with security definer privileges to bypass RLS
    - Ensures every new user gets a profile with default 'client' role
*/

-- Function to handle new user profile creation AND role synchronization
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- 1. Create a new profile for the user with a default role of 'client'
  INSERT INTO public.profiles (id, email, role)
  VALUES (new.id, new.email, 'client');

  -- 2. The crucial step: Sync the role to the user's auth metadata.
  --    This makes the role available in the JWT for RLS checks.
  UPDATE auth.users
  SET raw_app_meta_data = raw_app_meta_data || jsonb_build_object('role', 'client')
  WHERE id = new.id;

  RETURN new;
END;
$$;

-- Trigger to automatically call the function on user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();