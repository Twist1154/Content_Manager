import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { ClientHeader } from '@/components/client/ClientHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Bell, Eye, Download, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';


// A component for each settings section
const SettingsSection = ({ icon: Icon, title, children }) => (
                    <Card>
                        <CardHeader>
            <CardTitle className="flex items-center gap-3">
                <Icon className="w-5 h-5" />
                {title}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
            {children}
        </CardContent>
    </Card>
);

// A component for a setting with a toggle switch
const ToggleSetting = ({ title, description, defaultChecked = false }) => (
                            <div className="flex items-center justify-between">
                                <div>
            <h4 className="font-medium text-foreground">{title}</h4>
            <p className="text-sm text-muted-foreground">{description}</p>
                                </div>
        {/* You would replace this with a proper Switch component from your UI library */}
        <input
            type="checkbox"
            className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
            defaultChecked={defaultChecked}
        />
                            </div>
);

// A component for a setting with a dropdown select
const SelectSetting = ({ label, children }) => (
                                <div>
        <label className="block text-sm font-medium text-muted-foreground mb-2">{label}</label>
        <select className={cn('flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50')}>
            {children}
        </select>
                                </div>
);

export default async function SettingsPage() {
    const user = await getCurrentUser();

    if (!user) {
        redirect('/auth/client/signin');
    }

    return (
        <div className="min-h-screen bg-background">
            <ClientHeader user={user} />

            <main className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto space-y-6">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
                        <p className="text-muted-foreground">Customize your dashboard experience and preferences</p>
                            </div>

                    <SettingsSection icon={Bell} title="Notifications">
                        <ToggleSetting
                            title="Email Notifications"
                            description="Receive updates about your content and campaigns"
                            defaultChecked
                        />
                        <ToggleSetting
                            title="Campaign Reminders"
                            description="Get notified when campaigns are about to start or end"
                            defaultChecked
                        />
                        <ToggleSetting
                            title="Weekly Reports"
                            description="Receive weekly summaries of your content performance"
                        />
                    </SettingsSection>

                    <SettingsSection icon={Eye} title="Display Preferences">
                        <SelectSetting label="Default View Mode">
                                    <option value="grid">Grid View</option>
                                    <option value="list">List View</option>
                        </SelectSetting>
                        <SelectSetting label="Items Per Page">
                                    <option value="12">12 items</option>
                                    <option value="24">24 items</option>
                                    <option value="48">48 items</option>
                        </SelectSetting>
                        <ToggleSetting
                            title="Show File Sizes"
                            description="Display file sizes in content listings"
                            defaultChecked
                        />
                    </SettingsSection>

                    <SettingsSection icon={Download} title="Data Management">
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
                        <div className="pt-4 border-t border-border">
                                <Button variant="destructive" className="w-full">
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Clear All Content
                                </Button>
                            <p className="text-xs text-muted-foreground mt-2 text-center">
                                    This will permanently delete all your uploaded content. This action cannot be undone.
                                </p>
                            </div>
                    </SettingsSection>

                    <div className="flex justify-end pt-4 border-t border-border">
                        <Button>
                            Save Settings
                        </Button>
                    </div>
                </div>
            </main>
        </div>
    );
}