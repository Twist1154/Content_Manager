/*
  # Create automatic profile creation trigger

  1. New Functions
    - `handle_new_user()` - Function to automatically create profile when user signs up
    
  2. New Triggers  
    - Trigger on `auth.users` insert to create corresponding profile
    
  3. Security
    - Function runs with security definer privileges to bypass RLS
    - Ensures every new user gets a profile with default 'client' role
*/

-- Function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (new.id, new.email, 'client');
  RETURN new;
END;
$$;

-- Trigger to automatically create profile on user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();