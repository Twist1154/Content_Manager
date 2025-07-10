import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import { StoreForm } from '@/components/client/StoreForm';
import { ContentUpload } from '@/components/client/ContentUpload';
import { ContentDashboard } from '@/components/client/ContentDashboard';
import { ClientHeader } from '@/components/client/ClientHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Store, Upload, TrendingUp, Calendar } from 'lucide-react';

async function getStores(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('stores')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

async function getContentStats(userId: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('content')
    .select('type, created_at, start_date, end_date')
    .eq('user_id', userId);

  if (error) throw error;

  const now = new Date();
  const stats = {
    total: data?.length || 0,
    active: data?.filter(item =>
      new Date(item.start_date) <= now && new Date(item.end_date) >= now
    ).length || 0,
    scheduled: data?.filter(item =>
      new Date(item.start_date) > now
    ).length || 0,
    thisMonth: data?.filter(item =>
      new Date(item.created_at).getMonth() === now.getMonth() &&
      new Date(item.created_at).getFullYear() === now.getFullYear()
    ).length || 0,
  };

  return stats;
}

async function getClientProfile(clientId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', clientId)
    .eq('role', 'client')
    .single();

  if (error) throw error;
  return data;
}

export default async function Dashboard({ searchParams }: { searchParams: { admin_view?: string } }) {
  const user = await getCurrentUser();
  
  if (!user || (user.profile?.role !== 'client' && user.profile?.role !== 'admin')) {
    redirect('/auth/client/signin');
  }

  // Check if admin is viewing a specific client
  const adminViewClientId = searchParams.admin_view;
  const isAdminView = user.profile?.role === 'admin' && adminViewClientId;

  let viewingClient = user;
  let stores, contentStats;

  if (isAdminView) {
    try {
      const clientProfile = await getClientProfile(adminViewClientId);
      viewingClient = { ...user, profile: clientProfile };
      stores = await getStores(adminViewClientId);
      contentStats = await getContentStats(adminViewClientId);
    } catch (error) {
      notFound();
    }
  } else {
    stores = await getStores(user.id);
    contentStats = await getContentStats(user.id);
  }

  const targetUserId = isAdminView ? adminViewClientId : user.id;

  return (
    <div className="min-h-screen bg-gray-50">
      <ClientHeader
        user={user}
        isAdminView={isAdminView}
        viewingClient={viewingClient}
      />

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Upload className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{contentStats.total}</p>
                  <p className="text-sm text-gray-600">Total Content</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{contentStats.active}</p>
                  <p className="text-sm text-gray-600">Active Campaigns</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Calendar className="w-8 h-8 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{contentStats.scheduled}</p>
                  <p className="text-sm text-gray-600">Scheduled</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Store className="w-8 h-8 text-orange-600" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stores.length}</p>
                  <p className="text-sm text-gray-600">Store Locations</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {stores.length === 0 ? (
          <div className="text-center">
            <Store className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">
              {isAdminView ? 'Client Needs to Set Up Store' : 'Set Up Your Store'}
            </h2>
            <p className="text-gray-600 mb-6">
              {isAdminView
                ? 'This client has not set up their store details yet.'
                : "First, let's add your store details to get started with content uploads."
              }
            </p>
            {!isAdminView && <StoreForm userId={user.id} />}
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Upload Section - Only show for non-admin view */}
            {!isAdminView && (
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Upload className="w-5 h-5" />
                      Upload New Content
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ContentUpload userId={user.id} storeId={stores[0].id} />
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Store Information */}
            <div className={!isAdminView ? 'lg:col-span-2' : 'lg:col-span-3'}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Store className="w-5 h-5" />
                    {isAdminView ? 'Client Stores' : 'Your Stores'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {stores.map(store => (
                      <div key={store.id} className="p-4 bg-gray-50 rounded-lg">
                        <h3 className="font-semibold text-gray-900">{store.name}</h3>
                        <p className="text-gray-600">{store.brand_company}</p>
                        <p className="text-sm text-gray-500">{store.address}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Content Dashboard */}
        {stores.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {isAdminView ? 'Client Content Library' : 'Your Content Library'}
              </h2>
            <ContentDashboard userId={targetUserId} isAdminView={isAdminView} />
          </div>
        )}

        {isAdminView && (
          <Card className="bg-orange-50 border-orange-200">
            <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-orange-600" />
              <h3 className="font-semibold text-orange-800">Admin View Notice</h3>
            </div>
            <p className="text-orange-700 text-sm">
              You are viewing this client&apos;s dashboard with full admin privileges. You can see all their content,
              stores, and download any files. Upload functionality is disabled in admin view mode.
            </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}