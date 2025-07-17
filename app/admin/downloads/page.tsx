import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { BulkDownloadManager } from '@/components/admin/BulkDownloadManager';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Tooltip } from '@/components/ui/Tooltip';
import { Download, Shield } from 'lucide-react';

export default async function AdminDownloadsPage() {
    const user = await getCurrentUser();

    if (!user || user.profile?.role !== 'admin') {
        redirect('/auth/admin/signin');
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <AdminHeader
                user={user}
                title="Bulk Downloads"
                breadcrumbItems={[
                                        { label: 'Admin Dashboard', href: '/admin' },
                                        { label: 'Bulk Downloads', current: true }
                                    ]}
                                />

            <main className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-2">
                        <Download className="w-6 h-6 text-purple-600" />
                        <h2 className="text-xl font-semibold text-gray-900">Download Manager</h2>
                        <Tooltip content="Download content in bulk by client, location, or date range" variant="dark">
                            <Shield className="w-5 h-5 text-gray-400" />
                        </Tooltip>
                    </div>
                    <p className="text-gray-600">
                        Download client content in bulk with advanced filtering options.
                    </p>
                </div>

                <BulkDownloadManager />
            </main>
        </div>
    );
}