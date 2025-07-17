'use client';

import { useState, useEffect } from 'react';
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
import { getClientOverview } from '@/app/actions/client-overview-action';
import type { ClientOverview, OverviewStats } from '@/app/actions/client-overview-action';

export function AdminClientOverview() {
    const [clients, setClients] = useState<ClientOverview[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<OverviewStats>({
        totalClients: 0,
        activeClients: 0,
        totalUploads: 0,
        recentActivity: 0
    });

    const fetchClientOverview = async () => {
        console.log('AdminClientOverview: Fetching client overview...');
        setLoading(true);
        
        try {
            // Call the server action to get client overview data
            const result = await getClientOverview();
            console.log('AdminClientOverview: Server action result:', result);
            
            if (result.success) {
                setClients(result.clients);
                setStats(result.stats);
            } else {
                console.error('AdminClientOverview: Error fetching client overview:', result.error);
            }
        } catch (error) {
            console.error('AdminClientOverview: Exception during fetch:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClientOverview();
    }, []);

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