import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Users, Shield, Upload, FolderOpen } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Hapo Media Content Management
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Streamline your advertising campaigns with our comprehensive content management system. 
            Clients can easily upload content while marketing teams organize and deploy materials efficiently.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Users className="w-6 h-6 text-blue-600" />
                Client Portal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                Upload your marketing content, set campaign schedules, and manage your store information.
              </p>
              <div className="space-y-2">
                <Link href="/auth/client/signin">
                  <Button className="w-full">Sign In</Button>
                </Link>
                <Link href="/auth/client/signup">
                  <Button variant="outline" className="w-full">Create Account</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Shield className="w-6 h-6 text-green-600" />
                Admin Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                Access all client content, organize campaigns, and manage marketing materials efficiently.
              </p>
              <div className="space-y-2">
                <Link href="/auth/admin/signin">
                  <Button className="w-full">Admin Sign In</Button>
                </Link>
                <Link href="/auth/admin/signup">
                  <Button variant="outline" className="w-full">Create Admin Account</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <Card className="text-center">
            <CardContent className="pt-6">
              <Upload className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Easy Upload</h3>
              <p className="text-gray-600 text-sm">
                Drag and drop images, videos, and audio files with scheduling options
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <FolderOpen className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Smart Organization</h3>
              <p className="text-gray-600 text-sm">
                Content automatically organized by location and company for easy access
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <Shield className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Secure & Reliable</h3>
              <p className="text-gray-600 text-sm">
                Enterprise-grade security with role-based access control
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}