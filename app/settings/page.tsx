import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { ClientHeader } from '@/components/client/ClientHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Settings, Bell, Eye, Download, Trash2 } from 'lucide-react';

export default async function SettingsPage() {
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
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
                        <p className="text-gray-600">Customize your dashboard experience and preferences</p>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Bell className="w-5 h-5" />
                                Notifications
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-medium text-gray-900">Email Notifications</h4>
                                    <p className="text-sm text-gray-600">Receive updates about your content and campaigns</p>
                                </div>
                                <input type="checkbox" className="rounded" defaultChecked />
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-medium text-gray-900">Campaign Reminders</h4>
                                    <p className="text-sm text-gray-600">Get notified when campaigns are about to start or end</p>
                                </div>
                                <input type="checkbox" className="rounded" defaultChecked />
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-medium text-gray-900">Weekly Reports</h4>
                                    <p className="text-sm text-gray-600">Receive weekly summaries of your content performance</p>
                                </div>
                                <input type="checkbox" className="rounded" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Eye className="w-5 h-5" />
                                Display Preferences
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Default View Mode
                                </label>
                                <select className="w-full p-2 border border-gray-300 rounded-md">
                                    <option value="grid">Grid View</option>
                                    <option value="list">List View</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Items Per Page
                                </label>
                                <select className="w-full p-2 border border-gray-300 rounded-md">
                                    <option value="12">12 items</option>
                                    <option value="24">24 items</option>
                                    <option value="48">48 items</option>
                                </select>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-medium text-gray-900">Show File Sizes</h4>
                                    <p className="text-sm text-gray-600">Display file sizes in content listings</p>
                                </div>
                                <input type="checkbox" className="rounded" defaultChecked />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Download className="w-5 h-5" />
                                Data Management
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button variant="outline" className="flex-1">
                                    <Download className="w-4 h-4 mr-2" />
                                    Export All Data
                                </Button>
                                <Button variant="outline" className="flex-1">
                                    <Download className="w-4 h-4 mr-2" />
                                    Download Content List
                                </Button>
                            </div>

                            <div className="pt-4 border-t">
                                <Button variant="destructive" className="w-full">
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Clear All Content
                                </Button>
                                <p className="text-xs text-gray-500 mt-2 text-center">
                                    This will permanently delete all your uploaded content. This action cannot be undone.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end">
                        <Button>
                            Save Settings
                        </Button>
                    </div>
                </div>
            </main>
        </div>
    );
}