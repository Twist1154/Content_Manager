// components/admin/AdminClientManagement.tsx

'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Tooltip } from '@/components/ui/Tooltip';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import {
    Users, Search, Eye, Download, Calendar, Store, Upload,
    ExternalLink,
    Mail, Key, Shield, UserPlus, Settings, Trash2, AlertTriangle
} from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';
import {
    changeUserEmail,
    sendPasswordReset,
    requestReauthentication,
    inviteUser,
    sendMagicLink,
    deleteUser
} from '@/app/actions/user-management-actions';
import {getAllClients} from "@/app/actions/get-clients-action";
import type { Client } from '@/app/actions/get-clients-action';
import { getClientDataAsCsv } from '@/app/actions/download-data-action';


interface NotificationState {
    show: boolean;
    type: 'success' | 'error' | 'info';
    message: string;
}

export function AdminClientManagement() {
    const [clients, setClients] = useState<Client[]>([]);
    const [filteredClients, setFilteredClients] = useState<Client[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);

    // User management states
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [notification, setNotification] = useState<NotificationState>({
        show: false,
        type: 'info',
        message: ''
    });

    // Form states
    const [newEmail, setNewEmail] = useState('');
    const [inviteEmail, setInviteEmail] = useState('');
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [activeAction, setActiveAction] = useState<string | null>(null);

    // Memoize the supabase client to prevent it from being recreated on every render
    const supabase = useMemo(() => createClient(), []);

    const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
        setNotification({ show: true, type, message });
        setTimeout(() => {
            setNotification(prev => ({ ...prev, show: false }));
        }, 5000);
    };

    const fetchClients = useCallback(async () => {
        setLoading(true);
        console.log('AdminClientManagement: Fetching clients...');
        try {
            const result = await getAllClients(); // Call the server action
            console.log('AdminClientManagement: Fetch result:', result);

            if (result.success) {
                console.log('AdminClientManagement: Setting clients:', result.clients);
                setClients(result.clients);
            } else {
                console.error('AdminClientManagement: Error fetching clients:', result.error);
                showNotification('error', result.error || 'Failed to fetch clients');
            }
        } catch (error) {
            console.error('AdminClientManagement: Exception during fetch:', error);
            showNotification('error', 'An unexpected error occurred while fetching clients');
        }
        setLoading(false);
    }, []);

    const filterClients = useCallback(() => {
        if (!searchTerm) {
            setFilteredClients(clients);
            return;
        }

        const filtered = clients.filter(client =>
            client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            client.stores?.some(store =>
                store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                store.brand_company.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
        setFilteredClients(filtered);
    }, [clients, searchTerm]);

    useEffect(() => {
        fetchClients();
    }, [fetchClients]);

    useEffect(() => {
        filterClients();
    }, [filterClients]);

    const downloadClientData = async (clientId: string, clientEmail: string) => {
        try {
            const result = await getClientDataAsCsv(clientId, clientEmail);

            if (result.success && result.csvString) {
                // Download CSV
                const blob = new Blob([result.csvString], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = result.fileName || 'client-data.csv';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            console.error('Error downloading client data:', error);
            showNotification('error', 'Failed to download client data');
        }
    };

    // User management actions
    const handleChangeEmail = async () => {
        if (!selectedClient || !newEmail) return;

        setIsSubmitting(true);
        setActiveAction('changeEmail');

        try {
            const result = await changeUserEmail(selectedClient.id, newEmail);

            if (result.success) {
                showNotification('success', result.message);
                setNewEmail('');
                // Refresh client data
                await fetchClients();
                // Update selected client email
                setSelectedClient(prev => prev ? { ...prev, email: newEmail } : null);
            } else {
                showNotification('error', result.message);
            }
        } catch (error) {
            showNotification('error', 'Failed to change email');
        } finally {
            setIsSubmitting(false);
            setActiveAction(null);
        }
    };

    const handlePasswordReset = async () => {
        if (!selectedClient) return;

        setIsSubmitting(true);
        setActiveAction('passwordReset');

        try {
            const result = await sendPasswordReset(selectedClient.email);

            if (result.success) {
                showNotification('success', result.message);
            } else {
                showNotification('error', result.message);
            }
        } catch (error) {
            showNotification('error', 'Failed to send password reset');
        } finally {
            setIsSubmitting(false);
            setActiveAction(null);
        }
    };

    const handleReauthentication = async () => {
        if (!selectedClient) return;

        setIsSubmitting(true);
        setActiveAction('reauthentication');

        try {
            const result = await requestReauthentication(selectedClient.email);

            if (result.success) {
                showNotification('success', result.message);
            } else {
                showNotification('error', result.message);
            }
        } catch (error) {
            showNotification('error', 'Failed to send reauthentication request');
        } finally {
            setIsSubmitting(false);
            setActiveAction(null);
        }
    };

    const handleSendMagicLink = async () => {
        if (!selectedClient) return;

        setIsSubmitting(true);
        setActiveAction('magicLink');

        try {
            const result = await sendMagicLink(selectedClient.email);

            if (result.success) {
                showNotification('success', result.message);
            } else {
                showNotification('error', result.message);
            }
        } catch (error) {
            showNotification('error', 'Failed to send magic link');
        } finally {
            setIsSubmitting(false);
            setActiveAction(null);
        }
    };

    const handleInviteUser = async () => {
        if (!inviteEmail) return;

        setIsSubmitting(true);

        try {
            const result = await inviteUser(inviteEmail, 'client');

            if (result.success) {
                showNotification('success', result.message);
                setInviteEmail('');
                setShowInviteModal(false);
                // Refresh client list
                await fetchClients();
            } else {
                showNotification('error', result.message);
            }
        } catch (error) {
            showNotification('error', 'Failed to send invitation');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteUser = async () => {
        if (!selectedClient) return;

        setIsSubmitting(true);

        try {
            const result = await deleteUser(selectedClient.id);

            if (result.success) {
                showNotification('success', result.message);
                setSelectedClient(null);
                setShowDeleteConfirm(false);
                // Refresh client list
                await fetchClients();
            } else {
                showNotification('error', result.message);
            }
        } catch (error) {
            showNotification('error', 'Failed to delete user');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center p-8">
                <LoadingSpinner text="Loading clients..." />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Notification */}
            {notification.show && (
                <div className={`p-4 rounded-lg border ${
                    notification.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
                    notification.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
                    'bg-blue-50 border-blue-200 text-blue-800'
                }`}>
                    {notification.message}
                </div>
            )}

            {/* Header with Search and Invite */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        placeholder="Search clients by email or store..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>

                <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    {filteredClients.length} client{filteredClients.length !== 1 ? 's' : ''}
                </div>

                    <Tooltip content="Invite a new client to the platform" variant="dark">
                        <Button
                            onClick={() => setShowInviteModal(true)}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            <UserPlus className="w-4 h-4 mr-2" />
                            Invite Client
                        </Button>
                    </Tooltip>
                </div>
            </div>

            {/* Client List */}
            <div className="grid gap-4">
                {filteredClients.map(client => (
                    <Card key={client.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-lg font-semibold text-gray-900">{client.email}</h3>
                                        <Badge variant="secondary">Client</Badge>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            <span>Joined {format(new Date(client.created_at), 'MMM dd, yyyy')}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Store className="w-4 h-4" />
                                            <span>{client.stores?.length || 0} store{client.stores?.length !== 1 ? 's' : ''}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Upload className="w-4 h-4" />
                                            <span>{client.content_count || 0} upload{client.content_count !== 1 ? 's' : ''}</span>
                                        </div>
                                    </div>

                                    {client.stores && client.stores.length > 0 && (
                                        <div className="mt-3">
                                            <p className="text-sm font-medium text-gray-700 mb-1">Stores:</p>
                                            <div className="flex flex-wrap gap-2">
                                                {client.stores.map(store => (
                                                    <Badge key={store.id} variant="outline" className="text-xs">
                                                        {store.name} ({store.brand_company})
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {client.latest_upload && (
                                        <p className="text-xs text-gray-500 mt-2">
                                            Last upload: {format(new Date(client.latest_upload), 'MMM dd, yyyy HH:mm')}
                                        </p>
                                    )}
                                </div>

                                <div className="flex flex-col sm:flex-row gap-2">
                                    <Tooltip content="View client dashboard" variant="dark">
                                        <Link href={`/dashboard?admin_view=${client.id}`}>
                                            <Button variant="outline" size="sm">
                                                <Eye className="w-4 h-4 mr-2" />
                                                View Dashboard
                                            </Button>
                                        </Link>
                                    </Tooltip>

                                    <Tooltip content="Download client data as CSV" variant="dark">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => downloadClientData(client.id, client.email)}
                                        >
                                            <Download className="w-4 h-4 mr-2" />
                                            Download Data
                                        </Button>
                                    </Tooltip>

                                    <Tooltip content="Manage client account" variant="dark">
                                        <Button
                                            variant="default"
                                            size="sm"
                                            onClick={() => setSelectedClient(client)}
                                        >
                                            <Settings className="w-4 h-4 mr-2" />
                                            Manage
                                        </Button>
                                    </Tooltip>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {filteredClients.length === 0 && (
                <div className="text-center py-12">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No clients found</h3>
                    <p className="text-gray-600">
                        {searchTerm ? 'Try adjusting your search terms.' : 'No clients have registered yet.'}
                    </p>
                </div>
            )}

            {/* Client Management Modal */}
            {selectedClient && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <CardTitle className="flex items-center gap-2">
                                    <Settings className="w-5 h-5" />
                                    Manage Client: {selectedClient.email}
                                </CardTitle>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSelectedClient(null)}
                                >
                                    ×
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Client Information */}
                            <div className="grid grid-cols-2 gap-4 text-sm p-4 bg-gray-50 rounded-lg">
                                <div><strong>Email:</strong> {selectedClient.email}</div>
                                <div><strong>Role:</strong> {selectedClient.role}</div>
                                <div><strong>Joined:</strong> {format(new Date(selectedClient.created_at), 'MMM dd, yyyy HH:mm')}</div>
                                <div><strong>Total Uploads:</strong> {selectedClient.content_count || 0}</div>
                                </div>

                            {/* Admin Actions */}
                            <div className="border-t pt-6">
                                <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <Shield className="w-5 h-5 text-blue-600" />
                                    Admin Actions
                                </h4>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Change Email */}
                                    <div className="space-y-3">
                                        <h5 className="font-medium flex items-center gap-2">
                                            <Mail className="w-4 h-4" />
                                            Change Email Address
                                        </h5>
                                        <div className="flex gap-2">
                                            <Input
                                                type="email"
                                                placeholder="New email address"
                                                value={newEmail}
                                                onChange={(e) => setNewEmail(e.target.value)}
                                                className="flex-1"
                                            />
                                            <Button
                                                onClick={handleChangeEmail}
                                                disabled={!newEmail || isSubmitting}
                                                size="sm"
                                            >
                                                {isSubmitting && activeAction === 'changeEmail' ? (
                                                    <LoadingSpinner size="sm" />
                                                ) : (
                                                    'Change'
                                                )}
                                            </Button>
                                </div>
                                </div>

                                    {/* Password Reset */}
                                    <div className="space-y-3">
                                        <h5 className="font-medium flex items-center gap-2">
                                            <Key className="w-4 h-4" />
                                            Password Reset
                                        </h5>
                                        <Button
                                            onClick={handlePasswordReset}
                                            disabled={isSubmitting}
                                            variant="outline"
                                            className="w-full"
                                        >
                                            {isSubmitting && activeAction === 'passwordReset' ? (
                                                <LoadingSpinner size="sm" />
                                            ) : (
                                                'Send Reset Link'
                                            )}
                                        </Button>
                                    </div>

                                    {/* Reauthentication */}
                                    <div className="space-y-3">
                                        <h5 className="font-medium flex items-center gap-2">
                                            <Shield className="w-4 h-4" />
                                            Request Reauthentication
                                        </h5>
                                        <Button
                                            onClick={handleReauthentication}
                                            disabled={isSubmitting}
                                            variant="outline"
                                            className="w-full"
                                        >
                                            {isSubmitting && activeAction === 'reauthentication' ? (
                                                <LoadingSpinner size="sm" />
                                            ) : (
                                                'Send Reauth Link'
                                            )}
                                        </Button>
                                    </div>

                                    {/* Magic Link */}
                                    <div className="space-y-3">
                                        <h5 className="font-medium flex items-center gap-2">
                                            <Mail className="w-4 h-4" />
                                            Send Magic Link
                                        </h5>
                                        <Button
                                            onClick={handleSendMagicLink}
                                            disabled={isSubmitting}
                                            variant="outline"
                                            className="w-full"
                                        >
                                            {isSubmitting && activeAction === 'magicLink' ? (
                                                <LoadingSpinner size="sm" />
                                            ) : (
                                                'Send Magic Link'
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* Store Information */}
                            {selectedClient.stores && selectedClient.stores.length > 0 && (
                                <div className="border-t pt-6">
                                    <h4 className="font-medium mb-2">Stores ({selectedClient.stores.length})</h4>
                                    <div className="space-y-2">
                                        {selectedClient.stores.map(store => (
                                            <div key={store.id} className="p-3 bg-gray-50 rounded">
                                                <div className="font-medium">{store.name}</div>
                                                <div className="text-sm text-gray-600">{store.brand_company}</div>
                                                <div className="text-xs text-gray-500">{store.address}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-2 pt-4 border-t">
                                <Link href={`/dashboard?admin_view=${selectedClient.id}`} className="flex-1">
                                    <Button variant="default" className="w-full">
                                        <Eye className="w-4 h-4 mr-2" />
                                        View Dashboard
                                    </Button>
                                </Link>
                                <Button
                                    variant="outline"
                                    onClick={() => downloadClientData(selectedClient.id, selectedClient.email)}
                                >
                                    <Download className="w-4 h-4 mr-2" />
                                    Download Data
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={() => setShowDeleteConfirm(true)}
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete Account
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Invite User Modal */}
            {showInviteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <Card className="max-w-md w-full">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <UserPlus className="w-5 h-5" />
                                Invite New Client
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Email Address</label>
                                <Input
                                    type="email"
                                    placeholder="Enter email address"
                                    value={inviteEmail}
                                    onChange={(e) => setInviteEmail(e.target.value)}
                                />
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setShowInviteModal(false);
                                        setInviteEmail('');
                                    }}
                                    className="flex-1"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleInviteUser}
                                    disabled={!inviteEmail || isSubmitting}
                                    className="flex-1"
                                >
                                    {isSubmitting ? <LoadingSpinner size="sm" /> : 'Send Invitation'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && selectedClient && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <Card className="max-w-md w-full">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-red-600">
                                <AlertTriangle className="w-5 h-5" />
                                Delete User Account
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <p className="text-red-800 text-sm">
                                    <strong>Warning:</strong> This action cannot be undone. This will permanently delete the user account for <strong>{selectedClient.email}</strong> and remove all associated data including stores and content.
                                </p>
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="flex-1"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={handleDeleteUser}
                                    disabled={isSubmitting}
                                    className="flex-1"
                                >
                                    {isSubmitting ? <LoadingSpinner size="sm" /> : 'Delete Account'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}