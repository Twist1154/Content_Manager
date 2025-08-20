// app/auth/client/signup/page.tsx

import { RegistrationForm } from '@/components/auth/RegistrationForm';
import { BackButton } from '@/components/ui/BackButton';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import Link from 'next/link'; // --- NEW: Import Link for the sign-in prompt ---

// Note: The ToastProvider should ideally be in your root layout (app/layout.tsx).
// This page can remain a Server Component.

export default function ClientSignUp() {
  return (
    // THEME: Use theme variables for the background.
    <div className="min-h-screen bg-background flex items-center justify-center py-8 px-4">
      <div className="w-full max-w-2xl mx-auto">
          <div className="mb-6">
            <BackButton href="/" label="Back to home" />
            <Breadcrumb 
              items={[
              { label: 'Home', href: '/' },
              { label: 'Client Sign Up', current: true }
              ]} 
              className="mt-2"
            />
          </div>
          <div className="text-center mb-8">
          {/* THEME: Use theme text colors */}
          <h1 className="text-3xl font-bold text-foreground">Create a Client Account</h1>
          <p className="text-muted-foreground mt-2">Join our content management platform</p>
          </div>

          <RegistrationForm userType="client" />

        {/* --- NEW: Added a link back to the sign-in page --- */}
        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link
              href="/auth/client/signin"
              className="font-medium text-primary hover:underline"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}