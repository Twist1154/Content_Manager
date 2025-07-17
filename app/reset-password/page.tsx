'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { BackButton } from '@/components/ui/BackButton';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Key, AlertCircle, CheckCircle } from 'lucide-react';

export default function ResetPasswordPage() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [validating, setValidating] = useState(true);

    const router = useRouter();
    const searchParams = useSearchParams();
    const supabase = createClient();

    useEffect(() => {
        // Check if we have the necessary tokens from the URL
        const checkSession = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession();

                if (error || !session) {
                    setError('Invalid or expired reset link. Please request a new password reset.');
                }
            } catch (err) {
                setError('Failed to validate reset link.');
            } finally {
                setValidating(false);
            }
        };

        checkSession();
    }, [supabase.auth]);

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
        setError('');

        // Validate passwords
        const passwordError = validatePassword(password);
        if (passwordError) {
            setError(passwordError);
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
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

            setSuccess(true);

            // Redirect to sign in page after a short delay
            setTimeout(() => {
                router.push('/auth/client/signin?message=Password updated successfully');
            }, 2000);

        } catch (err: any) {
            console.error('Password reset error:', err);
            setError(err.message || 'Failed to update password. Please try again.');
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

    if (success) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <Card className="w-full max-w-md">
                    <CardContent className="p-8 text-center">
                        <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Password Updated!</h2>
                        <p className="text-gray-600 mb-4">
                            Your password has been successfully updated. You will be redirected to the sign-in page.
                        </p>
                        <LoadingSpinner size="sm" text="Redirecting..." />
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
                            Reset Your Password
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {error && (
                            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                                <span className="text-red-800 text-sm">{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    New Password
                                </label>
                                <Input
                                    type="password"
                                    placeholder="Enter your new password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Must be at least 8 characters with uppercase, lowercase, and number
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Confirm New Password
                                </label>
                                <Input
                                    type="password"
                                    placeholder="Confirm your new password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={loading || !password || !confirmPassword}
                            >
                                {loading ? (
                                    <LoadingSpinner size="sm" text="Updating..." />
                                ) : (
                                    'Update Password'
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}