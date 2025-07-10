import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { ClientHeader } from '@/components/client/ClientHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { User, Mail, Calendar, Shield } from 'lucide-react';
import { format } from 'date-fns';

export default async function ProfilePage() {
    const user = await getCurrentUser();

    if (!user) {
        redirect('/auth/client/signin');
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <ClientHeader user={user} />

            <main className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto space-y-6">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">User Profile</h1>
                        <p className="text-gray-600">Manage your account information and preferences</p>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="w-5 h-5" />
                                Account Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <Input
                                        type="email"
                                        value={user.email || ''}
                                        disabled
                                        className="pl-10 bg-gray-50"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Account Role
                                </label>
                                <div className="relative">
                                    <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <Input
                                        value={user.profile?.role || 'client'}
                                        disabled
                                        className="pl-10 bg-gray-50 capitalize"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Member Since
                                </label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <Input
                                        value={user.profile?.created_at ? format(new Date(user.profile.created_at), 'MMMM dd, yyyy') : 'Unknown'}
                                        disabled
                                        className="pl-10 bg-gray-50"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Account Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button variant="outline" className="flex-1">
                                    Change Password
                                </Button>
                                <Button variant="outline" className="flex-1">
                                    Update Email
                                </Button>
                            </div>

                            <div className="pt-4 border-t">
                                <Button variant="destructive" className="w-full">
                                    Delete Account
                                </Button>
                                <p className="text-xs text-gray-500 mt-2 text-center">
                                    This action cannot be undone. All your data will be permanently deleted.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}