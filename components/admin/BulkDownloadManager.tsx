// components/admin/BulkDownloadManager.tsx
'use client';

import {useCallback, useEffect, useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/Card';
import {Button} from '@/components/ui/Button';
import {Input} from '@/components/ui/Input';
import {Tooltip} from '@/components/ui/Tooltip';
import {Badge} from '@/components/ui/Badge';
import {LoadingSpinner} from '@/components/ui/LoadingSpinner'; // Import LoadingSpinner
import {Archive, Download, Filter} from 'lucide-react';
import {format} from 'date-fns';
import {fetchAllContent} from '@/app/actions/data-actions';
import {ContentCard} from '@/components/content/ContentCard';
import {ContentItem} from '@/types/content';
import {ContentDetailModal} from "@/components/content/ContentDetailModal";
import {formatFileSize} from "@/utils/contentUtils";
import {cn} from '@/lib/utils'; // Import cn


interface FilterOptions {
    startDate: string;
    endDate: string;
    contentType: string;
    client: string;
    company: string;
}

export function BulkDownloadManager() {
    const [content, setContent] = useState<ContentItem[]>([]);
    const [filteredContent, setFilteredContent] = useState<ContentItem[]>([]);
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);
    const [filters, setFilters] = useState<FilterOptions>({
        startDate: '',
        endDate: '',
        contentType: '',
        client: '',
        company: '',
    });

    // We can add a state for the detail view modal later if needed
    const [viewingItem, setViewingItem] = useState<ContentItem | null>(null);

    const fetchContent = useCallback(async () => {
        setLoading(true);
        try {
            const result = await fetchAllContent();
            if (result.success && result.content) {
                // Ensure all items have the properties needed by ContentCard
                const sanitizedContent = result.content.map(item => ({
                    ...item,
                    start_date: item.start_date || new Date().toISOString(), // Add fallbacks
                    end_date: item.end_date || new Date().toISOString(),
                }));
                setContent(sanitizedContent);
            } else {
                throw new Error(result.error || 'Failed to fetch content');
            }
        } catch (error) {
            console.error('Error fetching content:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    const applyFilters = useCallback(() => {
        let filtered = [...content];

        if (filters.startDate) {
            filtered = filtered.filter(item =>
                new Date(item.created_at) >= new Date(filters.startDate)
            );
        }

        if (filters.endDate) {
            filtered = filtered.filter(item =>
                new Date(item.created_at) <= new Date(filters.endDate)
            );
        }

        if (filters.contentType) {
            filtered = filtered.filter(item => item.type === filters.contentType);
        }

        if (filters.client) {
            filtered = filtered.filter(item =>
                item.profiles?.email?.toLowerCase().includes(filters.client.toLowerCase())
            );
        }

        if (filters.company) {
            filtered = filtered.filter(item =>
                item.stores?.brand_company?.toLowerCase().includes(filters.company.toLowerCase())
            );
        }

        setFilteredContent(filtered);
        setSelectedItems(new Set()); // Clear selection when filters change
    }, [content, filters]);

    useEffect(() => {
        fetchContent();
    }, [fetchContent]);

    useEffect(() => {
        applyFilters();
    }, [applyFilters]);

    const toggleSelectAll = () => {
        if (selectedItems.size === filteredContent.length) {
            setSelectedItems(new Set());
        } else {
            setSelectedItems(new Set(filteredContent.map(item => item.id)));
        }
    };

    const toggleSelectItem = (itemId: string) => {
        const newSelected = new Set(selectedItems);
        if (newSelected.has(itemId)) {
            newSelected.delete(itemId);
        } else {
            newSelected.add(itemId);
        }
        setSelectedItems(newSelected);
    };

    const downloadSelected = async () => {
        if (selectedItems.size === 0) return;
        setDownloading(true);
        try {
            const selectedContent = filteredContent.filter(item => selectedItems.has(item.id));

            // Create CSV data
            const csvData = [
                ['Title',
                    'Type',
                    'Client Email',
                    'Store',
                    'Company',
                    'Address',
                    'File URL',
                    'File Size (MB)',
                    'Upload Date'],
                ...selectedContent.map(item => [
                    item.title,
                    item.type,
                    item.profiles?.email || 'Unknown',
                    item.stores?.name || 'Unknown',
                    item.stores?.brand_company || 'Unknown',
                    item.stores?.address || 'Unknown',
                    item.file_url,
                    (item.file_size / (1024 * 1024)).toFixed(2),
                    format(new Date(item.created_at), 'yyyy-MM-dd HH:mm:ss')
                ])
            ];

            // Convert to CSV string
            const csvString = csvData.map(row =>
                row.map(field => `"${field}"`).join(',')
            ).join('\n');

            // Download CSV
            const blob = new Blob([csvString], {type: 'text/csv'});
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `bulk-content-export-${format(new Date(), 'yyyy-MM-dd-HHmm')}.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);

            // Also create a text file with direct download links
            const linksText = selectedContent.map(item =>
                `${item.title} (${item.type}): ${item.file_url}`
            ).join('\n');

            const linksBlob = new Blob([linksText], {type: 'text/plain'});
            const linksUrl = window.URL.createObjectURL(linksBlob);
            const linksA = document.createElement('a');
            linksA.href = linksUrl;
            linksA.download = `content-links-${format(new Date(), 'yyyy-MM-dd-HHmm')}.txt`;
            document.body.appendChild(linksA);
            linksA.click();
            document.body.removeChild(linksA);
            window.URL.revokeObjectURL(linksUrl);

        } catch (error) {
            console.error('Error downloading content:', error);
        } finally {
            setDownloading(false);
        }
    };


    const getTotalSize = () => {
        const selectedContent = filteredContent.filter(item => selectedItems.has(item.id));
        const totalBytes = selectedContent.reduce((sum, item) => sum + item.file_size, 0);
        return formatFileSize(totalBytes);
    };

    if (loading) {
        return (
            <div className="flex justify-center p-8">
                <LoadingSpinner size="lg" text="Loading all content..."/>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Filter className="w-5 h-5"/>
                        Filters
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 text-muted-foreground">Start Date</label>
                            <Input
                                type="date"
                                value={filters.startDate}
                                onChange={(e) =>
                                    setFilters(prev => ({...prev, startDate: e.target.value}))}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-muted-foreground">End Date</label>
                            <Input
                                type="date"
                                value={filters.endDate}
                                onChange={(e) =>
                                    setFilters(prev => ({...prev, endDate: e.target.value}))}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-muted-foreground">Content Type</label>
                            {/* THEME: Styled the select element to match the Input component. */}
                            <select
                                className={cn('flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm...')}
                                value={filters.contentType} onChange={(e) =>
                                setFilters(prev => ({...prev, contentType: e.target.value}))}
                            >
                                <option value="">All Types</option>
                                <option value="image">Images</option>
                                <option value="video">Videos</option>
                                <option value="music">Audio</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-muted-foreground">
                                Client Email
                            </label>
                            <Input
                                placeholder="Search by email..."
                                value={filters.client} onChange={(e) =>
                                setFilters(prev => ({...prev, client: e.target.value}))}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-muted-foreground">Company</label>
                            <Input
                                placeholder="Search by company..."
                                value={filters.company}
                                onChange={(e) =>
                                    setFilters(prev => ({...prev, company: e.target.value}))}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Selection and Download Controls */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                        <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={selectedItems.size === filteredContent.length && filteredContent.length > 0}
                                    onChange={toggleSelectAll}
                                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                                />
                                <span className="text-sm font-medium text-foreground">
                  Select All ({filteredContent.length} items)
                </span>
                            </label>
                            {selectedItems.size > 0 && (
                                <Badge variant="secondary">
                                    {selectedItems.size} selected • {getTotalSize()}
                                </Badge>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <Tooltip content="Clear all filters">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setFilters({
                                        startDate: '',
                                        endDate: '',
                                        contentType: '',
                                        client: '',
                                        company: ''
                                    })}>
                                    Clear Filters
                                </Button>
                            </Tooltip>
                            <Tooltip content="Download selected content metadata and links">
                                <Button
                                    variant="default"
                                    size="sm"
                                    onClick={downloadSelected}
                                    disabled={selectedItems.size === 0 || downloading}
                                >
                                    <Download className="w-4 h-4 mr-2"/>
                                    {downloading ?
                                        <LoadingSpinner size="sm"/> : `Download Selected (${selectedItems.size})`}
                                </Button>
                            </Tooltip>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {filteredContent.map(item => (
                    <ContentCard
                        key={item.id}
                        item={item}
                        isSelected={selectedItems.has(item.id)}
                        onSelectItem={toggleSelectItem}
                        onViewDetails={() => setViewingItem(item)}
                    />
                ))}
            </div>

            {filteredContent.length === 0 && !loading && (
                <Card>
                    <CardContent className="text-center py-12">
                        <Archive className="w-12 h-12 text-muted-foreground mx-auto mb-4"/>
                        <h3 className="text-lg font-medium text-foreground mb-2">No content found</h3>
                        <p className="text-muted-foreground">
                            Try adjusting your filters to see more content.
                        </p>
                    </CardContent>
                </Card>
            )}

            <ContentDetailModal item={viewingItem} onClose={() => setViewingItem(null)}/>
        </div>
    );
}