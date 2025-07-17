import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { ContentViewer } from '@/components/admin/ContentViewer';
import { AdminClientOverview } from '@/components/admin/AdminClientOverview';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Tooltip } from '@/components/ui/Tooltip';
import { Users, Database, Download, Shield } from 'lucide-react';
import Link from 'next/link';

export default async function AdminDashboard() {
  const user = await getCurrentUser();
  
  if (!user || user.profile?.role !== 'admin') {
    redirect('/auth/admin/signin');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader
        user={user}
        title="Marketing Admin Dashboard"
                />

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-6 mb-8">
          <Link href="/admin/clients">
            <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-gray-900">Client Management</h3>
                  <p className="text-sm text-gray-600">Manage all client accounts</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/admin/content">
            <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center gap-3">
                <Database className="w-8 h-8 text-green-600" />
                <div>
                  <h3 className="font-semibold text-gray-900">Content Library</h3>
                  <p className="text-sm text-gray-600">View all uploaded content</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/admin/downloads">
            <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center gap-3">
                <Download className="w-8 h-8 text-purple-600" />
                <div>
                  <h3 className="font-semibold text-gray-900">Bulk Downloads</h3>
                  <p className="text-sm text-gray-600">Download content in bulk</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/dashboard">
            <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center gap-3">
                <Shield className="w-8 h-8 text-orange-600" />
                <div>
                  <h3 className="font-semibold text-gray-900">Client View</h3>
                  <p className="text-sm text-gray-600">Access client dashboard</p>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Quick Client Management Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-xl font-semibold text-gray-900">Client Overview</h2>
            <Tooltip content="Quick overview of all client accounts" variant="dark">
              <Users className="w-5 h-5 text-gray-400" />
            </Tooltip>
          </div>
          <p className="text-gray-600 mb-6">
            Quick access to client accounts, their dashboard views, and recent activity.
          </p>

          <AdminClientOverview />
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-xl font-semibold text-gray-900">Recent Content Activity</h2>
            <Tooltip content="View and organize all client-submitted content" variant="dark">
              <Shield className="w-5 h-5 text-gray-400" />
            </Tooltip>
          </div>
          <p className="text-gray-600">
            Quick overview of recent client uploads and activity.
          </p>
        </div>
        
        <ContentViewer />
      </main>
    </div>
  );
}