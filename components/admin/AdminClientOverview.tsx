'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Tooltip } from '@/components/ui/Tooltip';
import { Badge } from '@/components/ui/Badge';
import {
    Users,
    Eye,
    Calendar,
    Store,
    Upload,
    TrendingUp,
    Activity
} from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';

interface Client {
    id: string;
    email: string;
    role: string;
    created_at: string;
    stores?: {
        id: string;
        name: string;
        brand_company: string;
    }[];
    content_count?: number;
    latest_upload?: string;
    active_campaigns?: number;
}

export function AdminClientOverview() {
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalClients: 0,
        activeClients: 0,
        totalUploads: 0,
        recentActivity: 0
    });

    // Memoize the supabase client to prevent it from being recreated on every render
    const supabase = useMemo(() => createClient(), []);

    const fetchClientOverview = useCallback(async () => {
        try {
            // Fetch client profiles
            const { data: profiles, error: profilesError } = await supabase
                .from('profiles')
                .select('*')
                .eq('role', 'client')
                .order('created_at', { ascending: false })
                .limit(6); // Show only recent 6 clients for overview

            if (profilesError) throw profilesError;

            // Get additional data for each client
            const clientsWithData = await Promise.all(
                (profiles || []).map(async (profile) => {
                    // Get stores
                    const { data: stores } = await supabase
                        .from('stores')
                        .select('id, name, brand_company')
                        .eq('user_id', profile.id);

                    // Get content data
                    const { data: content } = await supabase
                        .from('content')
                        .select('created_at, start_date, end_date')
                        .eq('user_id', profile.id)
                        .order('created_at', { ascending: false });

                    // Calculate active campaigns
                    const now = new Date();
                    const activeCampaigns = content?.filter(item =>
                        new Date(item.start_date) <= now && new Date(item.end_date) >= now
                    ).length || 0;

                    return {
                        ...profile,
                        stores: stores || [],
                        content_count: content?.length || 0,
                        latest_upload: content?.[0]?.created_at || null,
                        active_campaigns: activeCampaigns,
                    };
                })
            );

            setClients(clientsWithData);

            // Calculate overview stats
            const { data: allProfiles } = await supabase
                .from('profiles')
                .select('id, created_at')
                .eq('role', 'client');

            const { data: allContent } = await supabase
                .from('content')
                .select('created_at, user_id');

            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

            const recentActivity = allContent?.filter(item =>
                new Date(item.created_at) >= oneWeekAgo
            ).length || 0;

            const activeClients = new Set(
                allContent?.filter(item =>
                    new Date(item.created_at) >= oneWeekAgo
                ).map(item => item.user_id)
            ).size;

            setStats({
                totalClients: allProfiles?.length || 0,
                activeClients,
                totalUploads: allContent?.length || 0,
                recentActivity
            });

        } catch (error) {
            console.error('Error fetching client overview:', error);
        } finally {
            setLoading(false);
        }
    }, [supabase]);

    useEffect(() => {
        fetchClientOverview();
    }, [fetchClientOverview]);

    if (loading) {
        return (
            <div className="flex justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Loading client overview...</span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <Users className="w-8 h-8 text-blue-600" />
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{stats.totalClients}</p>
                                <p className="text-sm text-gray-600">Total Clients</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <Activity className="w-8 h-8 text-green-600" />
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{stats.activeClients}</p>
                                <p className="text-sm text-gray-600">Active This Week</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <Upload className="w-8 h-8 text-purple-600" />
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{stats.totalUploads}</p>
                                <p className="text-sm text-gray-600">Total Uploads</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <TrendingUp className="w-8 h-8 text-orange-600" />
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{stats.recentActivity}</p>
                                <p className="text-sm text-gray-600">Recent Activity</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Clients */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <Users className="w-5 h-5" />
                            Recent Clients
                        </CardTitle>
                        <Link href="/admin/clients">
                            <Button variant="outline" size="sm">
                                View All Clients
                            </Button>
                        </Link>
                    </div>
                </CardHeader>
                <CardContent>
                    {clients.length === 0 ? (
                        <div className="text-center py-8">
                            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No clients yet</h3>
                            <p className="text-gray-600">
                                No clients have registered yet. They will appear here once they sign up.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {clients.map(client => (
                                <div key={client.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h4 className="font-medium text-gray-900">{client.email}</h4>
                                            <Badge variant="secondary" className="text-xs">Client</Badge>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                <span>Joined {format(new Date(client.created_at), 'MMM dd')}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Store className="w-3 h-3" />
                                                <span>{client.stores?.length || 0} store{client.stores?.length !== 1 ? 's' : ''}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Upload className="w-3 h-3" />
                                                <span>{client.content_count || 0} upload{client.content_count !== 1 ? 's' : ''}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <TrendingUp className="w-3 h-3" />
                                                <span>{client.active_campaigns || 0} active</span>
                                            </div>
                                        </div>

                                        {client.stores && client.stores.length > 0 && (
                                            <div className="mt-2">
                                                <div className="flex flex-wrap gap-1">
                                                    {client.stores.slice(0, 2).map(store => (
                                                        <Badge key={store.id} variant="outline" className="text-xs">
                                                            {store.name}
                                                        </Badge>
                                                    ))}
                                                    {client.stores.length > 2 && (
                                                        <Badge variant="outline" className="text-xs">
                                                            +{client.stores.length - 2} more
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {client.latest_upload && (
                                            <p className="text-xs text-gray-500 mt-1">
                                                Last upload: {format(new Date(client.latest_upload), 'MMM dd, yyyy HH:mm')}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex gap-2 ml-4">
                                        <Tooltip content="View client dashboard" variant="dark">
                                            <Link href={`/dashboard?admin_view=${client.id}`}>
                                                <Button variant="outline" size="sm">
                                                    <Eye className="w-4 h-4 mr-1" />
                                                    View
                                                </Button>
                                            </Link>
                                        </Tooltip>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}