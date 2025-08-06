import { createClient } from '@/utils/supabase/server';
import { registerUser, signInUser } from '@/app/actions/auth-actions';

export async function signUp(email: string, password: string, role: 'client' | 'admin' = 'client') {
  // Use the server action to register the user with proper role handling
  const result = await registerUser(email, password, role);

  if (!result.success) {
    throw new Error(result.error || result.message);
  }

  // Get the user data to return in the same format as the original function
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error) throw error;

  return data;
}

export async function signIn(email: string, password: string) {
  const result = await signInUser(email, password);
  
  if (!result.success) {
    throw new Error(result.error || 'Sign in failed');
  }

  return { user: result.user };
}

export async function signOut() {
  const supabase = await createClient();
  
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;

  // Use service role for admin users to ensure they can access all data
  const isAdmin = user.app_metadata?.role === 'admin' || user.user_metadata?.role === 'admin';
  const supabaseClient = isAdmin ? await createClient({ useServiceRole: true }) : supabase;

  const { data: profile, error } = await supabaseClient
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    
    // If profile doesn't exist, create it with proper error handling
    const { data: newProfile, error: insertError } = await supabaseClient
      .from('profiles')
      .insert({
        id: user.id,
        email: user.email!,
        role: isAdmin ? 'admin' : 'client'
      })
      .select()
      .single();
    
    if (insertError) {
      console.error('Error creating profile:', insertError);
      // Return user with a default profile if creation fails
      return { 
        ...user, 
        profile: { 
          id: user.id, 
          email: user.email!, 
          role: isAdmin ? ('admin' as const) : ('client' as const),
          created_at: new Date().toISOString()
        } 
      };
    }
    
    return { ...user, profile: newProfile };
  }
  
  return { ...user, profile };
}