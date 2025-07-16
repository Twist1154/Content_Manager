import { BackButton } from '@/components/ui/BackButton';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Shield, Mail, Database, Users, Lock, FileText } from 'lucide-react';

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="container mx-auto max-w-4xl">
                <div className="mb-6">
                    <BackButton href="/" label="Back to home" />
                    <Breadcrumb
                        items={[
                            { label: 'Privacy Policy', current: true }
                        ]}
                        className="mt-2"
                    />
                </div>

                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
                    <p className="text-gray-600">Hapo Media Content Hub</p>
                    <p className="text-sm text-gray-500 mt-2">Last Updated: 16 July 2025</p>
                </div>

                <div className="space-y-6">
                    {/* Introduction */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="w-5 h-5 text-blue-600" />
                                Introduction
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="prose prose-gray max-w-none">
                            <p>
                                At Hapo Media, we are committed to protecting your privacy and ensuring the security of your personal information.
                                This Privacy Policy explains how we collect, use, store, and protect your data when you use the Hapo Media Content Hub
                                (the &quot;Service&quot;). By using our Service, you agree to the collection and use of information in accordance with this policy.
                            </p>
                        </CardContent>
                    </Card>

                    {/* Data Controller */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="w-5 h-5 text-green-600" />
                                Data Controller
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="mb-4">
                                <strong>Hapo Media</strong> is the data controller responsible for your personal data collected through the Hapo Media Content Hub.
                            </p>
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <p className="text-blue-800">
                                    <strong>Contact Information:</strong><br />
                                    For privacy-related inquiries, please contact us at: <strong>support@hapogroup.co.za</strong>
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Data We Collect */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Database className="w-5 h-5 text-purple-600" />
                                Data We Collect
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="mb-4">We collect the following types of information:</p>

                            <div className="space-y-4">
                                <div className="border-l-4 border-blue-500 pl-4">
                                    <h4 className="font-semibold text-gray-900 mb-2">1. Google OAuth Authentication Data</h4>
                                    <p className="text-gray-700 mb-2">When you sign in using Google OAuth, we receive:</p>
                                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                                        <li>Name (as provided by your Google account)</li>
                                        <li>Email address (primary email from your Google account)</li>
                                        <li>Profile picture (if available and shared by Google)</li>
                                        <li>Google account ID (for authentication purposes)</li>
                                    </ul>
                                </div>

                                <div className="border-l-4 border-green-500 pl-4">
                                    <h4 className="font-semibold text-gray-900 mb-2">2. Business Information</h4>
                                    <p className="text-gray-700 mb-2">Information you provide about your business:</p>
                                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                                        <li>Company name and brand information</li>
                                        <li>Store/location details including names and addresses</li>
                                        <li>Geographic coordinates (latitude/longitude) if provided</li>
                                        <li>Contact information related to your business locations</li>
                                    </ul>
                                </div>

                                <div className="border-l-4 border-orange-500 pl-4">
                                    <h4 className="font-semibold text-gray-900 mb-2">3. Content and Metadata</h4>
                                    <p className="text-gray-700 mb-2">Content you upload to our platform:</p>
                                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                                        <li>Images, videos, and audio files</li>
                                        <li>Content titles and descriptions</li>
                                        <li>Campaign scheduling information (start dates, end dates, recurrence patterns)</li>
                                        <li>File metadata (size, type, upload timestamps)</li>
                                        <li>Content categorization and organizational data</li>
                                    </ul>
                                </div>

                                <div className="border-l-4 border-red-500 pl-4">
                                    <h4 className="font-semibold text-gray-900 mb-2">4. Technical Information</h4>
                                    <p className="text-gray-700 mb-2">Automatically collected technical data:</p>
                                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                                        <li>User session information and authentication tokens</li>
                                        <li>User role assignments (client or admin)</li>
                                        <li>Account creation and last activity timestamps</li>
                                        <li>System logs for security and performance monitoring</li>
                                    </ul>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* How We Use Your Data */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="w-5 h-5 text-indigo-600" />
                                How We Use Your Data
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="mb-4">We use your personal data for the following specific purposes:</p>

                            <div className="space-y-4">
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h4 className="font-semibold text-gray-900 mb-2">Authentication and Account Management</h4>
                                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                                        <li>To authenticate users via Google OAuth and manage secure sessions</li>
                                        <li>To assign and manage user roles (client or admin) within the system</li>
                                        <li>To provide personalized access to your content and dashboard</li>
                                    </ul>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h4 className="font-semibold text-gray-900 mb-2">Content Management and Organization</h4>
                                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                                        <li>To associate uploaded content with the correct client and store locations</li>
                                        <li>To enable our marketing administrators to organize and manage campaigns effectively</li>
                                        <li>To provide content scheduling and campaign management functionality</li>
                                        <li>To generate reports and analytics for marketing campaign performance</li>
                                    </ul>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h4 className="font-semibold text-gray-900 mb-2">Service Delivery and Support</h4>
                                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                                        <li>To provide technical support and troubleshoot issues</li>
                                        <li>To maintain and improve the security and performance of our platform</li>
                                        <li>To communicate important service updates and changes</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-6">
                                <h4 className="font-semibold text-green-800 mb-2">Important Commitment:</h4>
                                <p className="text-green-700">
                                    <strong>We do not sell your personal data to third parties or use it for targeted advertising.</strong>
                                    Your data is used exclusively to provide and improve our content management services.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Data Storage and Third-Party Sub-processors */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Database className="w-5 h-5 text-cyan-600" />
                                Data Storage and Third-Party Sub-processors
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-2">Primary Data Storage</h4>
                                    <p className="text-gray-700 mb-2">
                                        All user data and files are securely stored using <strong>Supabase</strong>, our trusted backend service provider.
                                        Supabase acts as a sub-processor for data hosting and provides:
                                    </p>
                                    <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                                        <li><strong>Database Storage:</strong> User profiles, business information, and content metadata are stored in a PostgreSQL database</li>
                                        <li><strong>File Storage:</strong> Uploaded images, videos, and audio files are stored using Supabase Storage with secure access controls</li>
                                        <li><strong>Authentication Services:</strong> User authentication and session management through Supabase Auth</li>
                                    </ul>
                                </div>

                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-2">Sub-processor Information</h4>
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <p className="text-blue-800 mb-2"><strong>Supabase Inc.</strong></p>
                                        <ul className="list-disc list-inside text-blue-700 space-y-1">
                                            <li>Purpose: Backend infrastructure, database hosting, and file storage</li>
                                            <li>Data Location: Supabase operates with data centers in multiple regions with appropriate security measures</li>
                                            <li>Security: Supabase maintains SOC 2 Type II compliance and implements industry-standard security practices</li>
                                        </ul>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-2">Google Services</h4>
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                        <p className="text-red-800 mb-2"><strong>Google LLC</strong></p>
                                        <ul className="list-disc list-inside text-red-700 space-y-1">
                                            <li>Purpose: OAuth authentication services only</li>
                                            <li>Data Shared: Only authentication tokens and basic profile information during sign-in</li>
                                            <li>Privacy Policy: <a href="https://policies.google.com/privacy" className="underline" target="_blank" rel="noopener noreferrer">Google Privacy Policy</a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* User Rights & Data Deletion */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="w-5 h-5 text-red-600" />
                                Your Rights & Data Deletion
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="mb-4">You have the following rights regarding your personal data:</p>

                            <div className="space-y-4">
                                <div className="border-l-4 border-blue-500 pl-4">
                                    <h4 className="font-semibold text-gray-900 mb-2">Right to Access</h4>
                                    <p className="text-gray-700">You can access and review your personal data through your account dashboard at any time.</p>
                                </div>

                                <div className="border-l-4 border-green-500 pl-4">
                                    <h4 className="font-semibold text-gray-900 mb-2">Right to Rectification</h4>
                                    <p className="text-gray-700">You can update and correct your business information and profile details through your account settings.</p>
                                </div>

                                <div className="border-l-4 border-orange-500 pl-4">
                                    <h4 className="font-semibold text-gray-900 mb-2">Right to Data Portability</h4>
                                    <p className="text-gray-700">You can download your content and data through the export features available in your dashboard.</p>
                                </div>

                                <div className="border-l-4 border-red-500 pl-4">
                                    <h4 className="font-semibold text-gray-900 mb-2">Right to Deletion</h4>
                                    <p className="text-gray-700 mb-2">You have the right to request deletion of your account and all associated data.</p>

                                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-2">
                                        <h5 className="font-semibold text-red-800 mb-2">How to Request Data Deletion:</h5>
                                        <ol className="list-decimal list-inside text-red-700 space-y-1">
                                            <li>Send an email to <strong>support@hapogroup.co.za</strong></li>
                                            <li>Include your registered email address and account details</li>
                                            <li>Specify &quot;Data Deletion Request&quot; in the subject line</li>
                                            <li>We will process your request within 30 days and confirm completion</li>
                                        </ol>
                                        <p className="text-red-600 text-sm mt-2">
                                            <strong>Note:</strong> Data deletion is permanent and cannot be undone. All your uploaded content,
                                            business information, and account data will be permanently removed from our systems.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Security Measures */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Lock className="w-5 h-5 text-yellow-600" />
                                Security Measures
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="mb-4">We implement comprehensive security measures to protect your data:</p>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h4 className="font-semibold text-gray-900 mb-2">Access Control</h4>
                                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                                        <li>Role-based access control (RBAC)</li>
                                        <li>Multi-factor authentication via Google OAuth</li>
                                        <li>Session management and automatic timeouts</li>
                                    </ul>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h4 className="font-semibold text-gray-900 mb-2">Database Security</h4>
                                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                                        <li>Row Level Security (RLS) policies</li>
                                        <li>Encrypted data transmission (HTTPS/TLS)</li>
                                        <li>Regular security audits and monitoring</li>
                                    </ul>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h4 className="font-semibold text-gray-900 mb-2">File Storage Security</h4>
                                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                                        <li>Secure file upload and storage</li>
                                        <li>User-specific access permissions</li>
                                        <li>Automated backup and recovery systems</li>
                                    </ul>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h4 className="font-semibold text-gray-900 mb-2">Monitoring & Compliance</h4>
                                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                                        <li>Continuous security monitoring</li>
                                        <li>Regular vulnerability assessments</li>
                                        <li>Compliance with industry standards</li>
                                    </ul>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Data Retention */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="w-5 h-5 text-gray-600" />
                                Data Retention
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="mb-4">We retain your personal data only as long as necessary:</p>
                            <ul className="list-disc list-inside text-gray-600 space-y-2">
                                <li><strong>Account Data:</strong> Retained while your account is active and for 90 days after account deletion for backup purposes</li>
                                <li><strong>Content Files:</strong> Retained according to your campaign schedules and for 30 days after campaign completion</li>
                                <li><strong>System Logs:</strong> Retained for 12 months for security and performance monitoring purposes</li>
                                <li><strong>Business Information:</strong> Retained while your account is active to maintain service functionality</li>
                            </ul>
                        </CardContent>
                    </Card>

                    {/* Changes to Privacy Policy */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="w-5 h-5 text-purple-600" />
                                Changes to This Privacy Policy
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-700">
                                We may update this Privacy Policy from time to time to reflect changes in our practices or for legal,
                                operational, or regulatory reasons. We will notify you of any material changes by posting the new Privacy Policy
                                on this page and updating the &quot;Last Updated&quot; date. We encourage you to review this Privacy Policy periodically
                                to stay informed about how we protect your information.
                            </p>
                        </CardContent>
                    </Card>

                    {/* Contact Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Mail className="w-5 h-5 text-blue-600" />
                                Contact Us
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                                <h4 className="font-semibold text-blue-900 mb-4">Privacy-Related Inquiries</h4>
                                <p className="text-blue-800 mb-2">
                                    If you have any questions about this Privacy Policy, your data rights, or our data practices, please contact us:
                                </p>
                                <div className="space-y-2 text-blue-700">
                                    <p><strong>Email:</strong><a href="mailto:support@hapogroup.co.za"> support@hapogroup.co.za</a></p>
                                    <p><strong>Subject Line:</strong> Privacy Policy Inquiry - Hapo Media Content Hub</p>
                                    <p><strong>Response Time:</strong> We aim to respond to all privacy inquiries within 5 business days</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Footer */}
                <div className="text-center mt-12 pt-8 border-t border-gray-200">
                    <p className="text-gray-500 text-sm">
                        © 2024 Hapo Media. All rights reserved. |
                        <span className="ml-2">Last Updated: {new Date().toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </p>
                </div>
            </div>
        </div>
    );
}