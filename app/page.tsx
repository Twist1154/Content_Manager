import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import {
  Upload,
  Calendar,
  MapPin,
  Shield,
  Zap,
  Users,
  Play,
  CheckCircle,
  Chrome,
  ArrowRight
} from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image
                src="/Hapo Media - Primary.svg"
                alt="Hapo Media"
                width={48}
                height={48}
                className="w-12 h-12"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Hapo Media</h1>
                <p className="text-sm text-gray-600">Content Hub</p>
              </div>
        </div>
            <div className="flex items-center gap-3">
                <Link href="/auth/client/signin">
                <Button variant="outline" size="sm">
                  <Chrome className="w-4 h-4 mr-2" />
                  Client Login
                </Button>
                </Link>
              <Link href="/auth/admin/signin">
                <Button size="sm">
                  <Shield className="w-4 h-4 mr-2" />
                  Admin Login
                </Button>
                </Link>
              </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              The Central Hub for Your
              <span className="text-blue-600 block">Digital Signage Content</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Clients can easily upload media, and our team can deploy it faster than ever.
              Streamline your advertising campaigns with our comprehensive content management system
              designed for modern marketing teams.
              </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/client/signin">
                <Button size="lg" className="w-full sm:w-auto px-8 py-4 text-lg">
                  <Chrome className="w-5 h-5 mr-2" />
                  Get Started - Client Portal
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
                <Link href="/auth/admin/signin">
                <Button variant="outline" size="lg" className="w-full sm:w-auto px-8 py-4 text-lg">
                  <Shield className="w-5 h-5 mr-2" />
                  Admin Dashboard
                </Button>
                </Link>
            </div>
          </div>
              </div>
      </section>

      {/* Key Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for Content Management
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to make content upload and deployment seamless for both clients and marketing teams.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="text-center hover:shadow-lg transition-all duration-300 border-2 hover:border-blue-200">
              <CardContent className="pt-8 pb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Upload className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Easy Drag-and-Drop Uploads</h3>
                <p className="text-gray-600 leading-relaxed">
                  Upload images, videos, and audio files with a simple drag-and-drop interface.
                  No technical knowledge required.
                </p>
            </CardContent>
          </Card>

            <Card className="text-center hover:shadow-lg transition-all duration-300 border-2 hover:border-green-200">
              <CardContent className="pt-8 pb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Calendar className="w-8 h-8 text-green-600" />
        </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Schedule Your Content</h3>
                <p className="text-gray-600 leading-relaxed">
                  Set start and end dates, create recurring campaigns, and manage your content timeline
                  with precision.
              </p>
            </CardContent>
          </Card>

            <Card className="text-center hover:shadow-lg transition-all duration-300 border-2 hover:border-purple-200">
              <CardContent className="pt-8 pb-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MapPin className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Manage All Your Locations</h3>
                <p className="text-gray-600 leading-relaxed">
                  Organize content by store locations and brands. Perfect for multi-location
                  businesses and franchises.
              </p>
            </CardContent>
          </Card>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              See It In Action
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Watch how easy it is to upload and manage your digital signage content.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Client Dashboard Preview */}
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <Users className="w-6 h-6 text-blue-600 mr-2" />
                Client Dashboard
              </h3>
              <div className="bg-white rounded-lg shadow-lg overflow-hidden border">
                <div className="aspect-video bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                  <div className="text-center">
                    <Play className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                    <p className="text-blue-800 font-medium">Client Dashboard Demo</p>
                    <p className="text-blue-600 text-sm">Upload & Schedule Content</p>
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Key Features:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      Intuitive file upload interface
                    </li>
                    <li className="flex items-center text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      Campaign scheduling tools
                    </li>
                    <li className="flex items-center text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      Store location management
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Admin Dashboard Preview */}
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <Shield className="w-6 h-6 text-green-600 mr-2" />
                Admin Dashboard
              </h3>
              <div className="bg-white rounded-lg shadow-lg overflow-hidden border">
                <div className="aspect-video bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                  <div className="text-center">
                    <Play className="w-16 h-16 text-green-600 mx-auto mb-4" />
                    <p className="text-green-800 font-medium">Admin Dashboard Demo</p>
                    <p className="text-green-600 text-sm">Organize & Deploy Content</p>
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Admin Tools:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      Centralized content library
                    </li>
                    <li className="flex items-center text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      Client management tools
                    </li>
                    <li className="flex items-center text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      Bulk download capabilities
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Why Choose Hapo Media Content Hub?
              </h2>
              <p className="text-xl text-gray-600">
                Built for modern marketing teams who need speed, security, and simplicity.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Zap className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Lightning Fast Deployment</h3>
                  <p className="text-gray-600">
                    From upload to deployment in minutes, not hours. Our streamlined workflow
                    gets your content live faster than ever.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Enterprise Security</h3>
                  <p className="text-gray-600">
                    Role-based access control, secure file storage, and database-level security
                    keep your content safe and organized.
                  </p>
        </div>
      </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Client-Friendly Interface</h3>
                  <p className="text-gray-600">
                    No training required. Clients can upload and schedule content with an
                    intuitive interface designed for non-technical users.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Multi-Location Support</h3>
                  <p className="text-gray-600">
                    Perfect for franchises and multi-location businesses. Organize content
                    by location, brand, and campaign type.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Streamline Your Content Management?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join marketing teams who trust Hapo Media Content Hub for their digital signage needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/client/signin">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto px-8 py-4 text-lg bg-white text-blue-600 hover:bg-gray-50">
                  <Chrome className="w-5 h-5 mr-2" />
                  Start as Client
                </Button>
            </Link>
              <Link href="/auth/admin/signin">
                <Button size="lg" variant="outline" className="w-full sm:w-auto px-8 py-4 text-lg border-white text-white hover:bg-white hover:text-blue-600">
                  <Shield className="w-5 h-5 mr-2" />
                  Admin Access
                </Button>
            </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <Image
                  src="/Hapo Media - Secondary.svg"
                  alt="Hapo Media"
                  width={40}
                  height={40}
                  className="w-10 h-10"
                />
                <div>
                  <h3 className="text-xl font-bold">Hapo Media</h3>
                  <p className="text-gray-400 text-sm">Content Hub</p>
                </div>
              </div>
              <p className="text-gray-400 max-w-md">
                The central hub for your digital signage content. Streamline your advertising
                campaigns with our comprehensive content management system.
              </p>
          </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/auth/client/signin" className="hover:text-white transition-colors">Client Portal</Link></li>
                <li><Link href="/auth/admin/signin" className="hover:text-white transition-colors">Admin Dashboard</Link></li>
                {/* TODO: Create a dedicated features page and link here when available.*/}
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><a href="mailto:support@hapogroup.co.za" className="hover:text-white transition-colors">Contact Support</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 Hapo Media. All rights reserved. |
              <span className="ml-2">Secure • Reliable • Professional</span>
          </p>
        </div>
        </div>
      </footer>
    </main>
  );
}