// app/actions/get-clients-action.ts

'use server';

import { createClient } from '@/utils/supabase/server';

// This Client interface should be kept in sync with your component's needs
export interface Client {
    id: string;
    email: string;
    role: string;
    created_at: string;
    stores: {
        id: string;
        name:string;
        brand_company: string;
        address: string;
    }[];
    content_count: number;
    latest_upload: string | null;
}

interface FetchResult {
    success: boolean;
    clients: Client[];
    error?: string;
}

export async function getAllClients(): Promise<FetchResult> {
    console.log('get-clients-action: getAllClients called');
    try {
        console.log('get-clients-action: Creating Supabase client with service role...');
        const supabase = await createClient(true); // Request service role key for admin operations
        console.log('get-clients-action: Supabase client created');

        // Step 1: Fetch all profiles with the 'client' role. This is our source of truth.
        console.log('get-clients-action: Fetching profiles...');
        const { data: profiles, error: profilesError } = await supabase
            .from('profiles')
            .select('*')
            .eq('role', 'client')
            .order('created_at', { ascending: false });

        console.log('get-clients-action: Profiles result:', { 
            profilesCount: profiles?.length, 
            profilesError 
        });

        if (profilesError) {
            console.error('get-clients-action: Error fetching profiles:', profilesError);
            throw profilesError;
        }
        
        if (!profiles || profiles.length === 0) {
            console.log('get-clients-action: No clients found');
            return { success: true, clients: [] }; // No clients found
        }

        const clientIds = profiles.map(p => p.id);
        console.log(`get-clients-action: Found ${clientIds.length} client IDs`);

        // Step 2: Fetch all stores for ALL clients in a single query.
        console.log('get-clients-action: Fetching stores...');
        const { data: allStores, error: storesError } = await supabase
                    .from('stores')
            .select('id, user_id, name, brand_company, address')
            .in('user_id', clientIds);

        console.log('get-clients-action: Stores result:', { 
            storesCount: allStores?.length, 
            storesError 
        });

        if (storesError) {
            console.error('get-clients-action: Error fetching stores:', storesError);
            throw storesError;
        }

        // Step 3: Fetch all content metadata for ALL clients in a single query.
        console.log('get-clients-action: Fetching content...');
        const { data: allContent, error: contentError } = await supabase
                    .from('content')
            .select('user_id, created_at')
            .in('user_id', clientIds);

        console.log('get-clients-action: Content result:', { 
            contentCount: allContent?.length, 
            contentError 
        });

        if (contentError) {
            console.error('get-clients-action: Error fetching content:', contentError);
            throw contentError;
        }

        // Step 4: Process and aggregate the data efficiently in memory.
        console.log('get-clients-action: Processing and aggregating data...');

        // Group stores by their owner's ID for quick lookup
        const storesByClientId = new Map<string, any[]>();
        allStores?.forEach(store => {
            if (!storesByClientId.has(store.user_id)) {
                storesByClientId.set(store.user_id, []);
            }
            storesByClientId.get(store.user_id)!.push(store);
        });
        console.log(`get-clients-action: Grouped stores by client ID, ${storesByClientId.size} clients have stores`);

        // Calculate content count and find the latest upload date for each client
        const contentStatsByClientId = new Map<string, { count: number; latest: string }>();
        allContent?.forEach(content => {
            const stats = contentStatsByClientId.get(content.user_id) || { count: 0, latest: '' };
            stats.count++;
            // Find the most recent upload date
            if (!stats.latest || new Date(content.created_at) > new Date(stats.latest)) {
                stats.latest = content.created_at;
            }
            contentStatsByClientId.set(content.user_id, stats);
        });
        console.log(`get-clients-action: Calculated content stats, ${contentStatsByClientId.size} clients have content`);

        // Step 5: Assemble the final Client objects
        console.log('get-clients-action: Assembling final client objects...');
        const clients: Client[] = profiles.map(profile => {
            const contentStats = contentStatsByClientId.get(profile.id);
            const clientStores = storesByClientId.get(profile.id) || [];

            return {
                id: profile.id,
                email: profile.email,
                role: profile.role,
                created_at: profile.created_at,
                stores: clientStores,
                content_count: contentStats?.count || 0,
                latest_upload: contentStats?.latest || null,
            };
        });
        console.log(`get-clients-action: Assembled ${clients.length} client objects`);

        console.log('get-clients-action: Returning success result with clients');
        return {
            success: true,
            clients,
        };
    } catch (error: any) {
        console.error('get-clients-action: Error fetching all clients:', error);
        return {
            success: false,
            clients: [],
            error: error.message || 'An unexpected error occurred.'
        };
    }
}