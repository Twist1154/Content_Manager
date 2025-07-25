'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Chrome } from 'lucide-react';

interface AuthFormProps {
  mode: 'signin' | 'signup';
  userType?: 'client' | 'admin';
}

export function AuthForm({ mode, userType = 'client' }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  // Memoize the supabase client to prevent it from being recreated on every render
  const supabase = useMemo(() => createClient(), []);

  const signInWithGoogle = async () => {
    setGoogleLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?userType=${userType}`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) throw error;
    } catch (err: any) {
      console.error('Google authentication error:', err);
      setError(err.message || 'Google authentication failed. Please try again.');
      setGoogleLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  };

  const getCurrentUserWithRetry = async (maxRetries = 3): Promise<any> => {
    for (let i = 0; i < maxRetries; i++) {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return null;

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error(`Profile fetch attempt ${i + 1}:`, error);

          if (i === maxRetries - 1) {
            console.log('Creating new profile for user:', user.id);
            // Create profile if it doesn't exist
            const { data: newProfile, error: insertError } = await supabase
              .from('profiles')
              .insert({
                id: user.id,
                email: user.email!,
                role: userType // Use the expected role based on sign-in type
              })
              .select()
              .single();

            if (insertError) {
              console.error('Error creating profile:', insertError);
              // Return user with default profile structure
              return {
                ...user, 
                profile: { 
                  id: user.id, 
                  email: user.email!, 
                  role: userType,
                  created_at: new Date().toISOString()
                } 
              };
            }

            return { ...user, profile: newProfile };
          }
          // Wait before retry
          await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1))); // Exponential backoff
          continue;
        }

        return { ...user, profile };
      } catch (err) {
        console.error(`getCurrentUserWithRetry attempt ${i + 1} failed:`, err);
        if (i === maxRetries - 1) throw err;
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1))); // Exponential backoff
      }
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'signup') {
        // Use the server action for registration
        const { registerUser } = await import('@/app/actions/auth-actions');
        const result = await registerUser(email, password, userType);

        if (result.success) {
          // Show success message and redirect
          console.log('Registration successful:', result.message);
          router.push(userType === 'admin' ? '/admin' : '/dashboard');
          return;
        } else {
          throw new Error(result.error || result.message);
        }
      } else {
        const result = await signIn(email, password);
        if (result.user) {
          // For signin, get user profile to determine redirect
          try {
            const currentUser = await getCurrentUserWithRetry();
            console.log('Current user after signin:', currentUser);

            if (currentUser?.profile?.role === 'admin') {
              router.push('/admin');
            } else {
              router.push('/dashboard');
            }
          } catch (err) {
            console.error('Error getting current user:', err);
            // Fallback: redirect based on the sign-in page type
            router.push(userType === 'admin' ? '/admin' : '/dashboard');
          }
        }
      }
    } catch (err: any) {
      console.error('Authentication error:', err);
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">
          {mode === 'signin' ? 'Sign In' : 'Sign Up'} 
          {userType === 'admin' && ' - Admin'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={signInWithGoogle}
            disabled={googleLoading || loading}
          >
            <Chrome className="w-4 h-4 mr-2" />
            {googleLoading ? 'Connecting...' : `${mode === 'signin' ? 'Sign in' : 'Sign up'} with Google`}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Or continue with email</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Loading...' : mode === 'signin' ? 'Sign In' : 'Sign Up'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
