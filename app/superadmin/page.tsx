import { SuperadminPanel } from '@/components/admin/SuperadminPanel';
import { BackButton } from '@/components/ui/BackButton';

export default function SuperadminPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-6">
          <BackButton href="/" label="Back to home" />
        </div>
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Superadmin Access</h1>
          <p className="text-gray-600">Generate and manage superadmin credentials</p>
        </div>

        <SuperadminPanel />
      </div>
    </div>
  );
}