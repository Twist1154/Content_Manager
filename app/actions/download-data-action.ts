// app/actions/download-data-action.ts

'use server';

import { createClient } from '@/utils/supabase/server';
import { format } from 'date-fns';

interface DownloadResult {
    success: boolean;
    csvString?: string;
    fileName?: string;
    error?: string;
}

export async function getClientDataAsCsv(clientId: string, clientEmail: string): Promise<DownloadResult> {
    try {
        const supabase = await  createClient({ useServiceRole: true }); // Server client with admin rights

        const { data: content, error } = await supabase
            .from('content')
            .select(`
                *,
                stores (name, brand_company, address)
            `)
            .eq('user_id', clientId);

        if (error) throw error;

        // Create CSV data
        const csvData = [
            ['Title', 'Type', 'Store', 'Company', 'Address', 'Start Date', 'End Date', 'Recurrence', 'File URL', 'Upload Date'],
            ...(content || []).map(item => [
                item.title,
                item.type,
                (item.stores as any)?.name || '',
                (item.stores as any)?.brand_company || '',
                (item.stores as any)?.address || '',
                item.start_date,
                item.end_date,
                item.recurrence_type,
                item.file_url,
                format(new Date(item.created_at), 'yyyy-MM-dd HH:mm:ss')
            ])
        ];

        const csvString = csvData.map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(',')).join('\n');

        return {
            success: true,
            csvString: csvString,
            fileName: `client-data-${clientEmail}-${format(new Date(), 'yyyy-MM-dd')}.csv`
        };

    } catch (error: any) {
        return { success: false, error: 'Failed to generate CSV data.' };
    }
}