import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { ContentViewer } from '@/components/admin/ContentViewer';
import { AdminClientManagement } from '@/components/admin/AdminClientManagement';
import { Button } from '@/components/ui/Button';
import { BackButton } from '@/components/ui/BackButton';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Tooltip } from '@/components/ui/Tooltip';
import { LogOut, Shield, Users, Database, Download } from 'lucide-react';
import Link from 'next/link';

export default async function AdminDashboard() {
  const user = await getCurrentUser();
  
  if (!user || user.profile?.role !== 'admin') {
    redirect('/auth/admin/signin');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <BackButton href="/" label="Back to home" />
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-green-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Marketing Admin Dashboard</h1>
                <Breadcrumb 
                  items={[
                    { label: 'Admin Dashboard', current: true }
                  ]} 
                  className="mt-1"
                />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Admin: {user.email}</span>
            <Tooltip content="Sign out of admin account">
              <form action="/api/auth/signout" method="post">
                <Button variant="outline" size="sm" className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </form>
            </Tooltip>
          </div>
        </div>
      </header>

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
            Quick access to client accounts and their dashboard views.
          </p>

          <AdminClientManagement />
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