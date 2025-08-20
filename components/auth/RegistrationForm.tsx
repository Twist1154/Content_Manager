'use client';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { FormField } from '@/components/ui/FormField'; // Use the new component
import { User, Mail, Lock, Phone, AtSign, Chrome } from 'lucide-react';
import { useAuthForm } from '@/hooks/useAuthForm'; // Use the same hook
import { cn } from '@/lib/utils';

interface RegistrationFormProps {
  userType?: 'client' | 'admin';
}

export function RegistrationForm({ userType = 'client' }: RegistrationFormProps) {
  // The same hook powers this more complex form
  const {
    formData,
    errors,
    loading,
    googleLoading,
    handleInputChange,
    handleBlur,
    handleSubmit,
    signInWithGoogle,
  } = useAuthForm('signup', userType);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center flex items-center justify-center gap-2">
          <User className="w-6 h-6" />
          Create Your Account
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <Button
            type="button"
            variant="outline"
            className="w-full"
              onClick={signInWithGoogle}
              disabled={googleLoading || loading} size="lg"
          >
            <Chrome className="w-5 h-5 mr-2" />
            {googleLoading ? 'Connecting...' : 'Sign up with Google'}
          </Button>

          <div className="relative mt-6">
            <div className="absolute inset-0 flex items-center">
              {/* THEME: Use theme border color */}
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              {/* THEME: Use theme background and text colors */}
              <span className="bg-card px-2 text-muted-foreground">
                Or continue with email
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Full Name *" icon={User} error={errors.fullName}>
                <Input
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.fullName || ''}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  onBlur={() => handleBlur('fullName')}
                  required
                  className={cn('pl-10', errors.fullName && 'border-destructive')}
              />
            </FormField>
            <FormField label="Username *" icon={AtSign} error={errors.username}>
                <Input
                  type="text"
                  placeholder="Choose a username"
                  value={formData.username || ''}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  onBlur={() => handleBlur('username')}
                  required className={cn('pl-10',
                  errors.username && 'border-destructive')}
                />
            </FormField>
              </div>
          <FormField label="Email Address *" icon={Mail} error={errors.email}>
                <Input
                type="email"
                placeholder="Enter your email address"
                value={formData.email || ''}
                onChange={(e) => handleInputChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
                  required
                className={cn('pl-10', errors.email && 'border-destructive')}
                />
          </FormField>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Password *" icon={Lock} error={errors.password}>
              <Input
                  type="password"
                  placeholder="Create a password"
                  value={formData.password || ''}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  onBlur={() => handleBlur('password')}
                  required
                  className={cn('pl-10', errors.password && 'border-destructive')} />
            </FormField>
            <FormField label="Confirm Password *" icon={Lock} error={errors.confirmPassword}>
              <Input type="password" placeholder="Confirm your password" value={formData.confirmPassword || ''} onChange={(e) => handleInputChange('confirmPassword', e.target.value)} onBlur={() => handleBlur('confirmPassword')} required className={cn('pl-10', errors.confirmPassword && 'border-destructive')} />
            </FormField>
          </div>
          <FormField label="Phone Number *" icon={Phone} error={errors.phoneNumber}>
            <Input
                type="tel"
                placeholder="Enter your phone number"
                value={formData.phoneNumber || ''}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                onBlur={() => handleBlur('phoneNumber')}
                required
                className={cn('pl-10', errors.phoneNumber && 'border-destructive')} />
          </FormField>
          <div className="text-sm text-muted-foreground">
            <p>* Required fields</p>
            <p className="mt-1">By creating an account, you agree to our Terms of Service.</p>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading || googleLoading}
              size="lg">
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
