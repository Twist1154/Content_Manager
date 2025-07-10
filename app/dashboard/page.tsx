import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { StoreForm } from '@/components/client/StoreForm';
import { ContentUpload } from '@/components/client/ContentUpload';
import { Button } from '@/components/ui/Button';
import { BackButton } from '@/components/ui/BackButton';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Tooltip } from '@/components/ui/Tooltip';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Store, Upload, LogOut } from 'lucide-react';
import Link from 'next/link';

async function getStores(userId: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  
  const { data, error } = await supabase
    .from('stores')
    .select('*')
    .eq('user_id', userId);
  
  if (error) throw error;
  return data || [];
}

async function getContent(userId: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  
  const { data, error } = await supabase
    .from('content')
    .select(`
      *,
      stores (name, brand_company)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
}

export default async function Dashboard() {
  const user = await getCurrentUser();
  
  if (!user || user.profile?.role !== 'client') {
    redirect('/auth/client/signin');
  }

  const stores = await getStores(user.id);
  const content = await getContent(user.id);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <BackButton href="/" label="Back to home" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Client Dashboard</h1>
              <Breadcrumb 
                items={[
                  { label: 'Dashboard', current: true }
                ]} 
                className="mt-1"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Welcome, {user.email}</span>
            <Tooltip content="Sign out of your account">
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

      <main className="container mx-auto px-4 py-8 space-y-8">
        {stores.length === 0 ? (
          <div className="text-center">
            <Store className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Set Up Your Store</h2>
            <p className="text-gray-600 mb-6">
              First, let's add your store details to get started with content uploads.
            </p>
            <StoreForm userId={user.id} />
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-xl font-semibold">Upload New Content</h2>
                <Tooltip content="Upload images, videos, or audio files for your marketing campaigns" variant="dark">
                  <Upload className="w-5 h-5 text-gray-400" />
                </Tooltip>
              </div>
              <ContentUpload userId={user.id} storeId={stores[0].id} />
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-xl font-semibold">Your Stores</h2>
                <Tooltip content="Manage your store locations and details" variant="dark">
                  <Store className="w-5 h-5 text-gray-400" />
                </Tooltip>
              </div>
              <div className="space-y-4">
                {stores.map(store => (
                  <Card key={store.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Store className="w-5 h-5" />
                        {store.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">{store.brand_company}</p>
                      <p className="text-sm text-gray-500">{store.address}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        {content.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-xl font-semibold">Your Uploaded Content</h2>
              <Tooltip content="View and manage all your uploaded marketing content" variant="dark">
                <Upload className="w-5 h-5 text-gray-400" />
              </Tooltip>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {content.map(item => (
                <Card key={item.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Upload className="w-4 h-4" />
                      <span className="font-medium">{item.title}</span>
                    </div>
                    <p className="text-sm text-gray-600">{item.stores.name}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(item.created_at).toLocaleDateString()}
                    </p>
                    <div className="mt-2">
                      <span className={`inline-block px-2 py-1 text-xs rounded ${
                        item.type === 'image' ? 'bg-blue-100 text-blue-800' :
                        item.type === 'video' ? 'bg-green-100 text-green-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {item.type}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}