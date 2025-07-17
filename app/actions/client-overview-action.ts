// app/actions/client-overview-action.ts

'use server';

import { createClient } from '@/utils/supabase/server';

// Client interface for overview data
export interface ClientOverview {
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

// Stats interface for overview statistics
export interface OverviewStats {
    totalClients: number;
    activeClients: number;
    totalUploads: number;
    recentActivity: number;
}

// Result interface for the server action
export interface ClientOverviewResult {
    success: boolean;
    clients: ClientOverview[];
    stats: OverviewStats;
    error?: string;
}

export async function getClientOverview(): Promise<ClientOverviewResult> {
    console.log('client-overview-action: getClientOverview called');
    try {
        console.log('client-overview-action: Creating Supabase client with service role...');
        const supabase = await createClient(true); // Request service role key for admin operations
        console.log('client-overview-action: Supabase client created');

        // Step 1: Fetch recent client profiles with the 'client' role
        console.log('client-overview-action: Fetching recent profiles...');
        const { data: profiles, error: profilesError } = await supabase
            .from('profiles')
            .select('*')
            .eq('role', 'client')
            .order('created_at', { ascending: false })
            .limit(6); // Show only recent 6 clients for overview

        console.log('client-overview-action: Recent profiles result:', { 
            profilesCount: profiles?.length, 
            profilesError 
        });

        if (profilesError) {
            console.error('client-overview-action: Error fetching profiles:', profilesError);
            throw profilesError;
        }
        
        // Step 2: Fetch all client profiles for stats
        console.log('client-overview-action: Fetching all profiles for stats...');
        const { data: allProfiles, error: allProfilesError } = await supabase
            .from('profiles')
            .select('id, created_at')
            .eq('role', 'client');
        
        console.log('client-overview-action: All profiles result:', { 
            allProfilesCount: allProfiles?.length, 
            allProfilesError 
        });

        if (allProfilesError) {
            console.error('client-overview-action: Error fetching all profiles:', allProfilesError);
            throw allProfilesError;
        }

        // Step 3: Fetch all content for stats and recent activity
        console.log('client-overview-action: Fetching all content...');
        const { data: allContent, error: allContentError } = await supabase
            .from('content')
            .select('created_at, user_id, start_date, end_date');
        
        console.log('client-overview-action: All content result:', { 
            allContentCount: allContent?.length, 
            allContentError 
        });

        if (allContentError) {
            console.error('client-overview-action: Error fetching all content:', allContentError);
            throw allContentError;
        }

        // Step 4: If we have recent profiles, fetch their stores and content
        let clientsWithData: ClientOverview[] = [];
        
        if (profiles && profiles.length > 0) {
            const clientIds = profiles.map(p => p.id);
            console.log(`client-overview-action: Found ${clientIds.length} recent client IDs`);

            // Fetch stores for recent clients
            console.log('client-overview-action: Fetching stores for recent clients...');
            const { data: stores, error: storesError } = await supabase
                .from('stores')
                .select('id, user_id, name, brand_company')
                .in('user_id', clientIds);

            console.log('client-overview-action: Stores result:', { 
                storesCount: stores?.length, 
                storesError 
            });

            if (storesError) {
                console.error('client-overview-action: Error fetching stores:', storesError);
                throw storesError;
            }

            // Group stores by client ID
            const storesByClientId = new Map<string, any[]>();
            stores?.forEach(store => {
                if (!storesByClientId.has(store.user_id)) {
                    storesByClientId.set(store.user_id, []);
                }
                storesByClientId.get(store.user_id)!.push(store);
            });

            // Filter content for recent clients
            const clientContent = allContent?.filter(content => 
                clientIds.includes(content.user_id)
            ) || [];

            // Group content by client ID
            const contentByClientId = new Map<string, any[]>();
            clientContent.forEach(content => {
                if (!contentByClientId.has(content.user_id)) {
                    contentByClientId.set(content.user_id, []);
                }
                contentByClientId.get(content.user_id)!.push(content);
            });

            // Assemble client data
            clientsWithData = profiles.map(profile => {
                const clientStores = storesByClientId.get(profile.id) || [];
                const clientContentItems = contentByClientId.get(profile.id) || [];
                
                // Calculate active campaigns
                const now = new Date();
                const activeCampaigns = clientContentItems.filter(item =>
                    new Date(item.start_date) <= now && new Date(item.end_date) >= now
                ).length;

                // Find latest upload
                let latestUpload = null;
                if (clientContentItems.length > 0) {
                    latestUpload = clientContentItems.reduce((latest, current) => {
                        return new Date(current.created_at) > new Date(latest.created_at) ? current : latest;
                    }).created_at;
                }

                return {
                    ...profile,
                    stores: clientStores,
                    content_count: clientContentItems.length,
                    latest_upload: latestUpload,
                    active_campaigns: activeCampaigns,
                };
            });
        }

        // Step 5: Calculate overview stats
        console.log('client-overview-action: Calculating overview stats...');
        
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

        const stats: OverviewStats = {
            totalClients: allProfiles?.length || 0,
            activeClients,
            totalUploads: allContent?.length || 0,
            recentActivity
        };
        
        console.log('client-overview-action: Stats calculated:', stats);

        console.log('client-overview-action: Returning success result with clients and stats');
        return {
            success: true,
            clients: clientsWithData,
            stats,
        };
    } catch (error: any) {
        console.error('client-overview-action: Error fetching client overview:', error);
        return {
            success: false,
            clients: [],
            stats: {
                totalClients: 0,
                activeClients: 0,
                totalUploads: 0,
                recentActivity: 0
            },
            error: error.message || 'An unexpected error occurred.'
        };
    }
}