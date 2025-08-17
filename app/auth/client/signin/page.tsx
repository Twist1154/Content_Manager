import { AuthForm } from '@/components/auth/AuthForm';
import { BackButton } from '@/components/ui/BackButton';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { ToastProvider } from '@/components/ui/Toast';
import Link from 'next/link';

export default function ClientSignIn() {
  return (
    <ToastProvider>
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-4">
          <BackButton href="/" label="Back to home" />
          <Breadcrumb 
            items={[
              { label: 'Authentication', href: '/auth' },
              { label: 'Client', href: '/auth/client' },
              { label: 'Sign In', current: true }
            ]} 
            className="mt-2"
          />
        </div>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Client Sign In</h1>
          <p className="text-gray-600 mt-2">Access your content management dashboard</p>
        </div>
        <AuthForm mode="signin" userType="client" />

        {/* Sign up link */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Don&#39;t have an account?{' '}
            <Link
              href="/auth/client/signup"
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
            >
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
    </ToastProvider>
  );
}