'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Tooltip } from '@/components/ui/Tooltip';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import {
    LogOut,
    User,
    Settings,
    ChevronDown,
    Shield,
    Eye
} from 'lucide-react';
import Image from 'next/image';

interface ClientHeaderProps {
    user: any;
    isAdminView?: boolean;
    viewingClient?: any;
}

export function ClientHeader({ user, isAdminView, viewingClient }: ClientHeaderProps) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const router = useRouter();

    const handleLogout = async () => {
        try {
            const response = await fetch('/api/auth/signout', { method: 'POST' });
            if (response.ok) {
                router.push('/');
            }
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const confirmLogout = () => {
        setShowLogoutConfirm(true);
        setDropdownOpen(false);
    };

    return (
        <>
            <header className="bg-white shadow-sm border-b sticky top-0 z-40">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex justify-between items-center">
                        {/* Left side - Logo and Title */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-3">
                                <Image
                                    src="/Hapo Media - Primary.svg"
                                    alt="Hapo Media"
                                    width={40}
                                    height={40}
                                    className="w-10 h-10"
                                />
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h1 className="text-2xl font-bold text-gray-900">
                                            {isAdminView ? 'Admin View: Client Dashboard' : 'Client Dashboard'}
                                        </h1>
                                        {isAdminView && (
                                            <Tooltip content="You are viewing this client's dashboard as an admin" variant="dark">
                                                <Shield className="w-5 h-5 text-orange-600" />
                                            </Tooltip>
                                        )}
                                    </div>
                                    <Breadcrumb
                                        items={[
                                            ...(isAdminView ? [{ label: 'Admin Dashboard', href: '/admin' }] : []),
                                            {
                                                label: isAdminView ? `Client: ${viewingClient?.profile?.email}` : 'Dashboard',
                                                current: true
                                            }
                                        ]}
                                        className="mt-1"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Right side - User Menu */}
                        <div className="flex items-center gap-4">
                            {isAdminView && (
                                <div className="text-sm text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
                                    <Eye className="w-4 h-4 inline mr-1" />
                                    Admin View
                                </div>
                            )}

                            {/* User Dropdown */}
                            <div className="relative">
                                <Tooltip content="User menu" variant="dark">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setDropdownOpen(!dropdownOpen)}
                                        className="flex items-center gap-2 border-gray-300 text-gray-700 hover:bg-gray-50"
                                    >
                                        <User className="w-4 h-4" />
                                        <span className="hidden sm:inline">
                      {isAdminView ? viewingClient?.profile?.email : user.email}
                    </span>
                                        <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                                    </Button>
                                </Tooltip>

                                {dropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                                        <div className="px-4 py-2 border-b border-gray-100">
                                            <p className="text-sm font-medium text-gray-900">
                                                {isAdminView ? 'Viewing as Admin' : 'Signed in as'}
                                            </p>
                                            <p className="text-sm text-gray-600 truncate">
                                                {isAdminView ? viewingClient?.profile?.email : user.email}
                                            </p>
                                            {isAdminView && (
                                                <p className="text-xs text-orange-600 mt-1">
                                                    Admin: {user.email}
                                                </p>
                                            )}
                                        </div>

                                        <div className="py-1">
                                            <button
                                                onClick={() => {
                                                    setDropdownOpen(false);
                                                    router.push('/profile');
                                                }}
                                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                            >
                                                <User className="w-4 h-4" />
                                                User Profile
                                            </button>

                                            <button
                                                onClick={() => {
                                                    setDropdownOpen(false);
                                                    router.push('/settings');
                                                }}
                                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                            >
                                                <Settings className="w-4 h-4" />
                                                Settings
                                            </button>

                                            <div className="border-t border-gray-100 my-1"></div>

                                            <button
                                                onClick={confirmLogout}
                                                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                Sign Out
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Logout Confirmation Modal */}
            {showLogoutConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirm Sign Out</h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to sign out? You'll need to sign in again to access your dashboard.
                        </p>
                        <div className="flex gap-3 justify-end">
                            <Button
                                variant="outline"
                                onClick={() => setShowLogoutConfirm(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleLogout}
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                Sign Out
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Backdrop for dropdown */}
            {dropdownOpen && (
                <div
                    className="fixed inset-0 z-30"
                    onClick={() => setDropdownOpen(false)}
                />
            )}
        </>
    );
}