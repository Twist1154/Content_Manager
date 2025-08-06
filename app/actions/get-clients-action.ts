// app/actions/get-clients-action.ts

'use server';

import { createClient } from '@/utils/supabase/server';
// No need to import cookies here anymore, the utility handles it.

// This Client interface should be kept in sync with your component's needs
export interface Client {
    id: string;
    email: string;
    role: string;
    created_at: string;
    stores: {
        id: string;
        name: string;
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
        // CORRECTED: We now await the createClient call.
        const supabase = await createClient({ useServiceRole: true });
        console.log('get-clients-action: Supabase client created');

        // IMPROVEMENT: Fetch all required data in a single, efficient query.
        console.log('get-clients-action: Fetching profiles with related data...');
        const { data, error } = await supabase
            .from('profiles')
            .select(`
                id,
                email,
                role,
                created_at,
                stores ( id, name, brand_company, address ),
                content ( created_at )
            `)
            .eq('role', 'client')
            .order('created_at', { ascending: false });
            console.log('get-clients-action: Profiles with related data fetched', data);
        if (error) {
            console.error('get-clients-action: Error fetching profiles with related data:', error);
            throw error;
        }

        if (!data) {
            return { success: true, clients: [] };
            }

        console.log(`get-clients-action: Assembling final client objects for ${data.length} profiles...`);
        // The data is already joined. We just need to reshape it slightly.
        const clients: Client[] = data.map(profile => {
            let latestUpload = null;
            if (profile.content && profile.content.length > 0) {
                // Find the most recent date from the content array
                latestUpload = profile.content.reduce((latest, current) => {
                    return new Date(current.created_at) > new Date(latest.created_at) ? current : latest;
                }).created_at;
            }

            return {
                id: profile.id,
                email: profile.email,
                role: profile.role,
                created_at: profile.created_at,
                stores: profile.stores, // This is already an array of stores
                content_count: profile.content.length, // The count is just the length of the array
                latest_upload: latestUpload,
            };
        });

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