'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Tooltip } from '@/components/ui/Tooltip';
import { Folder, Image, Video, Music, Calendar, Repeat, MapPin } from 'lucide-react';
import { format } from 'date-fns';

interface ContentItem {
  id: string;
  title: string;
  type: 'image' | 'video' | 'music';
  file_url: string;
  file_size: number;
  start_date: string;
  end_date: string;
  recurrence_type: string;
  recurrence_days: string[] | null;
  created_at: string;
  stores: {
    name: string;
    brand_company: string;
    address: string;
    latitude: number | null;
    longitude: number | null;
  };
}

interface GroupedContent {
  [key: string]: {
    [key: string]: {
      [key: string]: ContentItem[];
    };
  };
}

export function ContentViewer() {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [groupedContent, setGroupedContent] = useState<GroupedContent>({});
  const [viewMode, setViewMode] = useState<'location' | 'company'>('location');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    fetchContent();
  }, []);

  useEffect(() => {
    groupContent();
  }, [content, viewMode, sortOrder]);

  const fetchContent = async () => {
    try {
      const { data, error } = await supabase
        .from('content')
        .select(`
          *,
          stores (
            name,
            brand_company,
            address,
            latitude,
            longitude
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContent(data || []);
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  const groupContent = () => {
    const sorted = [...content].sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    const grouped: GroupedContent = {};

    sorted.forEach(item => {
      if (viewMode === 'location') {
        const location = item.stores.address.split(',')[0] || 'Unknown Location';
        const company = item.stores.brand_company;
        const type = item.type;

        if (!grouped[location]) grouped[location] = {};
        if (!grouped[location][company]) grouped[location][company] = {};
        if (!grouped[location][company][type]) grouped[location][company][type] = [];
        
        grouped[location][company][type].push(item);
      } else {
        const company = item.stores.brand_company;
        const location = item.stores.address.split(',')[0] || 'Unknown Location';
        const type = item.type;

        if (!grouped[company]) grouped[company] = {};
        if (!grouped[company][location]) grouped[company][location] = {};
        if (!grouped[company][location][type]) grouped[company][location][type] = [];
        
        grouped[company][location][type].push(item);
      }
    });

    setGroupedContent(grouped);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'image': return <Image className="w-4 h-4" />;
      case 'video': return <Video className="w-4 h-4" />;
      case 'music': return <Music className="w-4 h-4" />;
      default: return <Folder className="w-4 h-4" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading content...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-2">
          <Tooltip content="Group content by store location" variant="dark">
            <Button
              variant={viewMode === 'location' ? 'default' : 'outline'}
              className={viewMode === 'location' ? 'bg-blue-600 hover:bg-blue-700' : 'border-gray-300 hover:border-blue-300 hover:text-blue-600'}
              onClick={() => setViewMode('location')}
            >
              <MapPin className="w-4 h-4 mr-2" />
              By Location
            </Button>
          </Tooltip>
          <Tooltip content="Group content by company/brand" variant="dark">
            <Button
              variant={viewMode === 'company' ? 'default' : 'outline'}
              className={viewMode === 'company' ? 'bg-blue-600 hover:bg-blue-700' : 'border-gray-300 hover:border-blue-300 hover:text-blue-600'}
              onClick={() => setViewMode('company')}
            >
              <Folder className="w-4 h-4 mr-2" />
              By Company
            </Button>
          </Tooltip>
        </div>
        <div className="flex gap-2">
          <Tooltip content="Show newest content first" variant="dark">
            <Button
              variant={sortOrder === 'newest' ? 'default' : 'outline'}
              className={sortOrder === 'newest' ? 'bg-green-600 hover:bg-green-700' : 'border-gray-300 hover:border-green-300 hover:text-green-600'}
              onClick={() => setSortOrder('newest')}
              size="sm"
            >
              Newest First
            </Button>
          </Tooltip>
          <Tooltip content="Show oldest content first" variant="dark">
            <Button
              variant={sortOrder === 'oldest' ? 'default' : 'outline'}
              className={sortOrder === 'oldest' ? 'bg-green-600 hover:bg-green-700' : 'border-gray-300 hover:border-green-300 hover:text-green-600'}
              onClick={() => setSortOrder('oldest')}
              size="sm"
            >
              Oldest First
            </Button>
          </Tooltip>
        </div>
      </div>

      <div className="grid gap-6">
        {Object.entries(groupedContent).map(([primaryKey, secondaryGroups]) => (
          <Card key={primaryKey}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Folder className="w-5 h-5" />
                {primaryKey}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(secondaryGroups).map(([secondaryKey, typeGroups]) => (
                  <div key={secondaryKey} className="border-l-2 border-gray-200 pl-4">
                    <h4 className="font-medium text-gray-700 mb-2">{secondaryKey}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {Object.entries(typeGroups).map(([type, items]) => (
                        <div key={type} className="space-y-2">
                          <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                            {getTypeIcon(type)}
                            {type} ({items.length})
                          </div>
                          <div className="space-y-1">
                            {items.map(item => (
                              <Tooltip
                                key={item.id}
                                content={`Click to view details for ${item.title}`}
                                variant="dark"
                                position="top"
                              >
                                <div
                                  className="p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100 transition-colors"
                                  onClick={() => setSelectedContent(item)}
                                >
                                  <div className="text-sm font-medium truncate">{item.title}</div>
                                  <div className="text-xs text-gray-500">
                                    {format(new Date(item.created_at), 'MMM dd, yyyy')}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {formatFileSize(item.file_size)}
                                  </div>
                                </div>
                              </Tooltip>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedContent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="flex items-center gap-2">
                  {getTypeIcon(selectedContent.type)}
                  {selectedContent.title}
                </CardTitle>
                <Tooltip content="Close details">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400"
                    onClick={() => setSelectedContent(null)}
                  >
                    ×
                  </Button>
                </Tooltip>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Store:</strong> {selectedContent.stores.name}
                </div>
                <div>
                  <strong>Company:</strong> {selectedContent.stores.brand_company}
                </div>
                <div>
                  <strong>Type:</strong> {selectedContent.type}
                </div>
                <div>
                  <strong>Size:</strong> {formatFileSize(selectedContent.file_size)}
                </div>
                <div>
                  <strong>Start Date:</strong> {format(new Date(selectedContent.start_date), 'MMM dd, yyyy')}
                </div>
                <div>
                  <strong>End Date:</strong> {format(new Date(selectedContent.end_date), 'MMM dd, yyyy')}
                </div>
                <div>
                  <strong>Recurrence:</strong> {selectedContent.recurrence_type}
                </div>
                <div>
                  <strong>Uploaded:</strong> {format(new Date(selectedContent.created_at), 'MMM dd, yyyy HH:mm')}
                </div>
              </div>
              
              {selectedContent.recurrence_days && selectedContent.recurrence_days.length > 0 && (
                <div>
                  <strong>Recurrence Days:</strong> {selectedContent.recurrence_days.join(', ')}
                </div>
              )}

              <div>
                <strong>Address:</strong> {selectedContent.stores.address}
              </div>

              {selectedContent.type === 'image' && (
                <div className="mt-4">
                  <img
                    src={selectedContent.file_url}
                    alt={selectedContent.title}
                    className="max-w-full h-auto rounded"
                  />
                </div>
              )}

              {selectedContent.type === 'video' && (
                <div className="mt-4">
                  <video
                    src={selectedContent.file_url}
                    controls
                    className="max-w-full h-auto rounded"
                  />
                </div>
              )}

              {selectedContent.type === 'music' && (
                <div className="mt-4">
                  <audio
                    src={selectedContent.file_url}
                    controls
                    className="w-full"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}