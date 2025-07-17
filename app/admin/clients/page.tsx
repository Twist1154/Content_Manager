import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { AdminClientManagement } from '@/components/admin/AdminClientManagement';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Tooltip } from '@/components/ui/Tooltip';
import { Users, Shield } from 'lucide-react';

export default async function AdminClientsPage() {
    const user = await getCurrentUser();

    if (!user || user.profile?.role !== 'admin') {
        redirect('/auth/admin/signin');
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <AdminHeader
                user={user}
                title="Client Management"
                breadcrumbItems={[
                                        { label: 'Admin Dashboard', href: '/admin' },
                                        { label: 'Client Management', current: true }
                                    ]}
                                />

            <main className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-2">
                        <Users className="w-6 h-6 text-blue-600" />
                        <h2 className="text-xl font-semibold text-gray-900">All Clients</h2>
                        <Tooltip content="Manage all client accounts and access their dashboards" variant="dark">
                            <Shield className="w-5 h-5 text-gray-400" />
                        </Tooltip>
                    </div>
                    <p className="text-gray-600">
                        View, manage, and access all client accounts and their content.
                    </p>
                </div>

                <AdminClientManagement />
            </main>
        </div>
    );
}