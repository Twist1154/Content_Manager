'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ToastProvider, useToast } from '@/components/ui/Toast';
import { Store, MapPin, Building, User, CheckCircle } from 'lucide-react';
import { addStore } from '@/app/actions/data-actions';
import type { StoreData } from '@/app/actions/data-actions';

function SetupStoreContent() {
    const [formData, setFormData] = useState({
        name: '',
        brand_company: '',
        address: '',
        latitude: '',
        longitude: '',
    });
    const [loading, setLoading] = useState(false);
    const [validating, setValidating] = useState(true);
    const [user, setUser] = useState<any>(null);

    const router = useRouter();
    const { addToast } = useToast();
    const supabase = createClient();

    useEffect(() => {
        const checkUser = async () => {
            try {
                const { data: { user }, error } = await supabase.auth.getUser();

                if (error || !user) {
                    addToast({
                        type: 'error',
                        title: 'Authentication Required',
                        message: 'Please sign in to continue.'
                    });
                    router.push('/auth/client/signin');
                    return;
                }

                setUser(user);

                // Check if user already has stores
                const { data: stores } = await supabase
                    .from('stores')
                    .select('id')
                    .eq('user_id', user.id);

                if (stores && stores.length > 0) {
                    // User already has stores, redirect to dashboard
                    router.push('/dashboard');
                    return;
                }

                setValidating(false);
            } catch (err) {
                console.error('User validation error:', err);
                addToast({
                    type: 'error',
                    title: 'Validation Error',
                    message: 'Failed to validate user session.'
                });
                router.push('/auth/client/signin');
            }
        };

        checkUser();
    }, [supabase, addToast, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            addToast({
                type: 'error',
                title: 'Authentication Error',
                message: 'User session not found. Please sign in again.'
            });
            return;
        }

        setLoading(true);

        try {
            const storeData: StoreData = {
                name: formData.name,
                brand_company: formData.brand_company,
                address: formData.address,
                latitude: formData.latitude ? parseFloat(formData.latitude) : null,
                longitude: formData.longitude ? parseFloat(formData.longitude) : null,
            };

            const result = await addStore(storeData, user.id);

            if (!result.success) {
                throw new Error(result.error);
            }

            addToast({
                type: 'success',
                title: 'Store Setup Complete!',
                message: 'Your store information has been saved successfully.'
            });

            // Redirect to dashboard after a short delay
            setTimeout(() => {
                router.push('/dashboard');
            }, 2000);

        } catch (err: any) {
            console.error('Store setup error:', err);
            addToast({
                type: 'error',
                title: 'Setup Failed',
                message: err.message || 'Failed to save store information. Please try again.'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    if (validating) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <Card className="w-full max-w-md">
                    <CardContent className="p-8 text-center">
                        <LoadingSpinner size="lg" text="Validating session..." />
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="w-full max-w-2xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <Store className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Hapo Media!</h1>
                    <p className="text-gray-600 max-w-md mx-auto">
                        Let&apos;s set up your store information to complete your account setup and start managing your content.
                    </p>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center justify-center mb-8">
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-5 h-5 text-white" />
                            </div>
                            <span className="ml-2 text-sm font-medium text-green-600">Password Set</span>
                        </div>
                        <div className="w-8 h-0.5 bg-gray-300"></div>
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                <Store className="w-5 h-5 text-white" />
                            </div>
                            <span className="ml-2 text-sm font-medium text-blue-600">Store Setup</span>
                        </div>
                        <div className="w-8 h-0.5 bg-gray-300"></div>
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                                <User className="w-5 h-5 text-gray-500" />
                            </div>
                            <span className="ml-2 text-sm font-medium text-gray-500">Dashboard</span>
                        </div>
                    </div>
                </div>

                {/* Store Setup Form */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Building className="w-5 h-5" />
                            Store Information
                        </CardTitle>
                        <p className="text-sm text-gray-600">
                            Provide your store details to help us organize your content effectively.
                        </p>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Store Name *
                                    </label>
                                    <Input
                                        placeholder="e.g., Downtown Branch"
                                        value={formData.name}
                                        onChange={(e) => handleChange('name', e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Brand/Company *
                                    </label>
                                    <Input
                                        placeholder="e.g., Your Company Name"
                                        value={formData.brand_company}
                                        onChange={(e) => handleChange('brand_company', e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Store Address *
                                </label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <Input
                                        placeholder="Full store address"
                                        value={formData.address}
                                        onChange={(e) => handleChange('address', e.target.value)}
                                        className="pl-10"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Latitude (Optional)
                                    </label>
                                    <Input
                                        type="number"
                                        step="any"
                                        placeholder="e.g., -26.2041"
                                        value={formData.latitude}
                                        onChange={(e) => handleChange('latitude', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Longitude (Optional)
                                    </label>
                                    <Input
                                        type="number"
                                        step="any"
                                        placeholder="e.g., 28.0473"
                                        value={formData.longitude}
                                        onChange={(e) => handleChange('longitude', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="flex items-start gap-2">
                                    <Store className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <h4 className="text-sm font-medium text-blue-900">Why do we need this?</h4>
                                        <p className="text-sm text-blue-700 mt-1">
                                            Store information helps us organize your content by location and makes it easier
                                            for our team to deploy your marketing materials to the right places.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.push('/auth/client/signin')}
                                    className="flex-1"
                                    disabled={loading}
                                >
                                    Back to Sign In
                                </Button>
                                <Button
                                    type="submit"
                                    className="flex-1"
                                    disabled={loading || !formData.name || !formData.brand_company || !formData.address}
                                >
                                    {loading ? (
                                        <LoadingSpinner size="sm" text="Setting up..." />
                                    ) : (
                                        'Complete Setup'
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Help Text */}
                <div className="text-center mt-6">
                    <p className="text-sm text-gray-500">
                        Need help? Contact our support team at{' '}
                        <a href="mailto:support@hapogroup.co.za" className="text-blue-600 hover:underline">
                            support@hapogroup.co.za
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function SetupStorePage() {
    return (
        <ToastProvider>
            <SetupStoreContent />
        </ToastProvider>
    );
}