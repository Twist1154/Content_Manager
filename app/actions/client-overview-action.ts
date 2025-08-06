// app/actions/client-overview-action.ts

'use server';

import { createClient } from '@/utils/supabase/server';

// Interfaces remain the same, they are well-defined.
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

export interface OverviewStats {
    totalClients: number;
    activeClients: number;
    totalUploads: number;
    recentActivity: number;
}

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
        // CORRECTED: Added 'await' to correctly resolve the client Promise.
        const supabase = await createClient({ useServiceRole: true });
        console.log('client-overview-action: Supabase client created');

        // IMPROVEMENT: Run our main data-fetching operations concurrently for speed.
        const [statsData, recentClientsData] = await Promise.all([
            supabase
                .from('profiles')
                .select('id, content(user_id, created_at, start_date, end_date)')
                .eq('role', 'client'),

            supabase
                .from('profiles')
                .select(`
                id, email, role, created_at,
                stores (id, name, brand_company)
                `)
                .eq('role', 'client')
                .order('created_at', { ascending: false }),
        ]);

        if (statsData.error) throw statsData.error;
        if (recentClientsData.error) throw recentClientsData.error;

        // --- Process Stats Data ---
        const allProfilesWithContent = statsData.data || [];
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        let totalUploads = 0;
        let recentActivity = 0;
        const activeClientIds = new Set<string>();
        
        allProfilesWithContent.forEach(profile => {
            if (Array.isArray(profile.content)) {
            totalUploads += profile.content.length;

            profile.content.forEach(c => {
                const createdAt = new Date(c.created_at);
                if (createdAt >= oneWeekAgo) {
                    recentActivity++;
                    activeClientIds.add(c.user_id);
        }
        });
            }
            });

        const stats: OverviewStats = {
            totalClients: allProfilesWithContent.length,
            activeClients: activeClientIds.size,
            totalUploads,
            recentActivity,
        };

        // --- Process Recent Clients List ---
        const recentProfiles = recentClientsData.data || [];
        const clients: ClientOverview[] = recentProfiles.map(profile => {
            // Find the content for this specific client from our stats data
            const profileContent =
                allProfilesWithContent.find(p => p.id === profile.id)?.content || [];

            let latestUploadDate: string | undefined = undefined;
            if (profileContent.length > 0) {
                latestUploadDate = profileContent.reduce((latest, current) =>
                    new Date(current.created_at) > new Date(latest.created_at)
                        ? current
                        : latest
                ).created_at;
                }

                const now = new Date();
            const activeCampaigns = profileContent.filter(item =>
                    new Date(item.start_date) <= now && new Date(item.end_date) >= now
                ).length;

                return {
                    ...profile,
                stores: profile.stores,
                content_count: profileContent.length,
                // Now this value is either `string` or `undefined`, matching the type
                latest_upload: latestUploadDate,
                    active_campaigns: activeCampaigns,
                };
            });

        return {
            success: true,
            clients,
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
            error: error.message || 'An unexpected error occurred.',
        };
    }
}
