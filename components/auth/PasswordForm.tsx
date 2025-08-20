'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Eye, EyeOff, Shield } from 'lucide-react';

interface PasswordFormProps {
    isNewUser: boolean;
    onSubmit: (e: React.FormEvent) => void;
    password: { value: string; set: (value: string) => void };
    confirmPassword: { value: string; set: (value: string) => void };
    isLoading: boolean;
}

export function PasswordForm({ isNewUser, onSubmit, password, confirmPassword, isLoading }: PasswordFormProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                    {isNewUser ? 'Create Password' : 'New Password'}
                </label>
                <div className="relative">
                    <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={password.value}
                        onChange={(e) => password.set(e.target.value)}
                        required
                        className="pr-10"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                    At least 8 characters with uppercase, lowercase, & a number.
                </p>
            </div>
            <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Confirm Password
                </label>
                <div className="relative">
                    <Input
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={confirmPassword.value}
                        onChange={(e) => confirmPassword.set(e.target.value)}
                        required
                        className="pr-10"
                    />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                </div>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading || !password.value || !confirmPassword.value}>
                {isLoading ? (
                    <LoadingSpinner size="sm" text={isNewUser ? "Setting Password..." : "Updating..."} />
                ) : (
                    isNewUser ? 'Set Password & Continue' : 'Update Password'
                )}
            </Button>
            {isNewUser && (
                <div className="mt-6 p-4 bg-accent/50 border border-accent rounded-lg flex items-start gap-3">
                    <Shield className="w-5 h-5 text-accent-foreground mt-0.5 flex-shrink-0" />
                    <div>
                        <h4 className="text-sm font-medium text-accent-foreground">Next Steps</h4>
                        <p className="text-sm text-accent-foreground/90 mt-1">
                            You&apos;ll be guided to set up your store information to complete your account.
                        </p>
                    </div>
                </div>
            )}
        </form>
    );
}