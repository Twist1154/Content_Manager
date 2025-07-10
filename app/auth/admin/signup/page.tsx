import { RegistrationForm } from '@/components/auth/RegistrationForm';
import { BackButton } from '@/components/ui/BackButton';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { ToastProvider } from '@/components/ui/Toast';

export default function AdminSignUp() {
  return (
    <ToastProvider>
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="w-full max-w-4xl mx-auto">
          <div className="mb-6">
            <BackButton href="/" label="Back to home" />
            <Breadcrumb 
              items={[
                { label: 'Authentication', href: '/auth' },
                { label: 'Admin', href: '/auth/admin' },
                { label: 'Sign Up', current: true }
              ]} 
              className="mt-2"
            />
          </div>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Create Admin Account</h1>
            <p className="text-gray-600 mt-2">Set up marketing team access</p>
          </div>
          <RegistrationForm userType="admin" />
        </div>
      </div>
    </ToastProvider>
  );
}