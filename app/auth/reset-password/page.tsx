'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { BackButton } from '@/components/ui/BackButton';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ToastProvider, useToast } from '@/components/ui/Toast';
import { Key, AlertCircle, CheckCircle, Shield, Eye, EyeOff } from 'lucide-react';

function ResetPasswordContent() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [validating, setValidating] = useState(true);
    const [isNewUser, setIsNewUser] = useState(false);
    const [userEmail, setUserEmail] = useState('');

    const router = useRouter();
    const { addToast } = useToast();
    const supabase = createClient();

    useEffect(() => {
        const checkSession = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession();

                if (error) {
                    console.error('Session error:', error);
                    addToast({
                        type: 'error',
                        title: 'Session Error',
                        message: 'Invalid or expired reset link. Please request a new password reset.'
                    });
                    setValidating(false);
                    return;
                }

                if (!session) {
                    addToast({
                        type: 'error',
                        title: 'Invalid Link',
                        message: 'Invalid or expired reset link. Please request a new password reset.'
                    });
                    setValidating(false);
                    return;
                }

                // Check if this is a new user (invited user) or existing user (password reset)
                const { data: profile, error: profileError } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();

                if (profileError && profileError.code === 'PGRST116') {
                    // Profile doesn't exist - this is a new invited user
                    setIsNewUser(true);
                    setUserEmail(session.user.email || '');

                    // Create profile for new user
                    const { error: insertError } = await supabase
                        .from('profiles')
                        .insert({
                            id: session.user.id,
                            email: session.user.email!,
                            role: 'client' // Default role for invited users
                        });

                    if (insertError) {
                        console.error('Error creating profile:', insertError);
                    }
                } else if (profile) {
                    // Existing user doing password reset
                    setIsNewUser(false);
                    setUserEmail(profile.email);
                }

                setValidating(false);
            } catch (err) {
                console.error('Validation error:', err);
                addToast({
                    type: 'error',
                    title: 'Validation Error',
                    message: 'Failed to validate reset link.'
                });
                setValidating(false);
            }
        };

        checkSession();
    }, [supabase, addToast]);

    const validatePassword = (password: string): string | null => {
        if (password.length < 8) {
            return 'Password must be at least 8 characters long';
        }
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
            return 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
        }
        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate passwords
        const passwordError = validatePassword(password);
        if (passwordError) {
            addToast({
                type: 'error',
                title: 'Invalid Password',
                message: passwordError
            });
            return;
        }

        if (password !== confirmPassword) {
            addToast({
                type: 'error',
                title: 'Password Mismatch',
                message: 'Passwords do not match'
            });
            return;
        }

        setLoading(true);

        try {
            const { error } = await supabase.auth.updateUser({
                password: password
            });

            if (error) {
                throw error;
            }

            addToast({
                type: 'success',
                title: 'Password Updated!',
                message: isNewUser
                    ? 'Welcome! Your password has been set successfully.'
                    : 'Your password has been updated successfully.'
            });

            // Check if user has stores
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data: stores } = await supabase
                    .from('stores')
                    .select('id')
                    .eq('user_id', user.id);

                if (!stores || stores.length === 0) {
                    // No stores - redirect to store setup
                    setTimeout(() => {
                        router.push('/auth/setup-store');
                    }, 2000);
                } else {
                    // Has stores - redirect to dashboard
                    setTimeout(() => {
                        router.push('/dashboard');
                    }, 2000);
                }
            }

        } catch (err: any) {
            console.error('Password update error:', err);
            addToast({
                type: 'error',
                title: 'Update Failed',
                message: err.message || 'Failed to update password. Please try again.'
            });
        } finally {
            setLoading(false);
        }
    };

    if (validating) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <Card className="w-full max-w-md">
                    <CardContent className="p-8 text-center">
                        <LoadingSpinner size="lg" text="Validating reset link..." />
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="mb-4">
                    <BackButton href="/auth/client/signin" label="Back to sign in" />
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-center flex items-center justify-center gap-2">
                            <Key className="w-6 h-6" />
                            {isNewUser ? 'Set Your Password' : 'Reset Your Password'}
                        </CardTitle>
                        {isNewUser && (
                            <p className="text-center text-sm text-gray-600 mt-2">
                                Welcome! Please set a password for your account: <strong>{userEmail}</strong>
                            </p>
                        )}
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {isNewUser ? 'Create Password' : 'New Password'}
                                </label>
                                <div className="relative">
                                    <Input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    Must be at least 8 characters with uppercase, lowercase, and number
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <Input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        placeholder="Confirm your password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        className="pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={loading || !password || !confirmPassword}
                            >
                                {loading ? (
                                    <LoadingSpinner size="sm" text={isNewUser ? "Setting Password..." : "Updating Password..."} />
                                ) : (
                                    isNewUser ? 'Set Password & Continue' : 'Update Password'
                                )}
                            </Button>
                        </form>

                        {isNewUser && (
                            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <div className="flex items-start gap-2">
                                    <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <h4 className="text-sm font-medium text-blue-900">Next Steps</h4>
                                        <p className="text-sm text-blue-700 mt-1">
                                            After setting your password, you&apos;ll be guided to set up your store information
                                            to complete your account setup.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <ToastProvider>
      <Suspense fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardContent className="p-8 text-center">
              <LoadingSpinner size="lg" text="Loading..." />
            </CardContent>
          </Card>
        </div>
      }>
            <ResetPasswordContent />
      </Suspense>
        </ToastProvider>
    );
}
