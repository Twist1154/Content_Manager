import { BackButton } from '@/components/ui/BackButton';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Shield, Mail, Database, Users, Lock, FileText } from 'lucide-react';

const PolicySection = ({ icon: Icon, title, children, iconColorClass = 'text-primary' }) => (
    <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${iconColorClass}`} />
                {title}
            </CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground prose-p:my-2 prose-ul:my-2 prose-strong:text-foreground">
            {children}
        </CardContent>
    </Card>
);

const InfoBox = ({ children, variant = 'default' }) => {
    const variants = {
        default: 'bg-primary/10 border-primary/20 text-primary',
        success: 'bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-400',
        destructive: 'bg-destructive/10 border-destructive/20 text-destructive',
    };
    return (
        <div className={`rounded-lg border p-4 not-prose ${variants[variant]}`}>
            {children}
        </div>
    );
};

const DataListItem = ({
                      title,
                      description,
                      items,
                      borderColorClass = 'border-primary' }) => (
    <div className={`border-l-4 ${borderColorClass} pl-4`}>
        <h4 className="font-semibold text-foreground mb-2">{title}</h4>
        <p className="text-muted-foreground mb-2">{description}</p>
        <ul className="list-disc list-inside space-y-1">
            {items.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
    </div>
);

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto max-w-4xl py-8 px-4">
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
                    <h1 className="text-4xl font-bold text-foreground mb-2">Privacy Policy</h1>
                    <p className="text-muted-foreground">Hapo Media Content Hub</p>
                    <p className="text-sm text-muted-foreground mt-2">Last Updated: 16 July 2025</p>
                </div>

                <div className="space-y-6">
                    <PolicySection
                        icon={Shield}
                        title="Introduction"
                    >
                            <p>
                                At Hapo Media, we are committed to protecting your privacy and ensuring the security of your personal information.
                                This Privacy Policy explains how we collect, use, store, and protect your data when you use the Hapo Media Content Hub
                                (the &quot;Service&quot;). By using our Service, you agree to the collection and use of information in accordance with this policy.
                            </p>
                    </PolicySection>

                    <PolicySection
                        icon={Users}
                        title="Data Controller"
                        iconColorClass="text-green-500"
                    >
                        <p><strong>Hapo Media</strong> is the data controller responsible for your personal data collected through the Hapo Media Content Hub.</p>
                        <InfoBox>
                            <p className="text-primary">
                                    <strong>Contact Information:</strong><br />
                                    For privacy-related inquiries, please contact us at: <strong>support@hapogroup.co.za</strong>
                                </p>
                        </InfoBox>
                    </PolicySection>

                    <PolicySection
                        icon={Database}
                        title="Data We Collect"
                        iconColorClass="text-purple-500"
                    >
                            <p className="mb-4">We collect the following types of information:</p>
                        <div className="space-y-4 not-prose">
                            <DataListItem
                                title="1. Google OAuth Authentication Data"
                                description="When you sign in using Google OAuth, we receive:"
                                items={[
                                    'Name (as provided by your Google account)',
                                    'Email address (primary email from your Google account)',
                                    'Profile picture (if available and shared by Google)',
                                    'Google account ID (for authentication purposes)'
                                ]}
                            />
                            <DataListItem
                                title="2. Business Information"
                                description="Information you provide about your business:"
                                items={[
                                    'Company name and brand information',
                                    'Store/location details including names and addresses',
                                    'Geographic coordinates (latitude/longitude) if provided',
                                    'Contact information related to your business locations'
                                ]}
                                borderColorClass="border-green-500"
                            />
                            <DataListItem
                                title="3. Content and Metadata"
                                description="Content you upload to our platform:"
                                items={['Images, videos, and audio files',
                                    'Content titles and descriptions',
                                    'Campaign scheduling information (start dates, end dates, recurrence patterns)',
                                    'File metadata (size, type, upload timestamps)',
                                    'Content categorization and organizational data'
                                ]}
                                borderColorClass="border-orange-500"
                            />
                            <DataListItem
                                title="4. Technical Information"
                                description="Automatically collected technical data:"
                                items={[
                                    'User session information and authentication tokens',
                                    'User role assignments (client or admin)',
                                    'Account creation and last activity timestamps',
                                    'System logs for security and performance monitoring'
                                ]}
                                borderColorClass="border-red-500"
                            />
                                </div>
                    </PolicySection>

                    <PolicySection
                        icon={FileText}
                        title="How We Use Your Data"
                        iconColorClass="text-indigo-500"
                    >
                        <p>We use your personal data for the following specific purposes:</p>
                        <div className="space-y-4 my-4 not-prose">
                            <div className="bg-muted/50 rounded-lg p-4">
                                <h4 className="font-semibold text-foreground mb-2">Authentication and Account Management</h4>
                                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                                        <li>To authenticate users via Google OAuth and manage secure sessions</li>
                                        <li>To assign and manage user roles (client or admin) within the system</li>
                                        <li>To provide personalized access to your content and dashboard</li>
                                    </ul>
                                </div>
                            <div className="bg-muted/50 rounded-lg p-4">
                                <h4 className="font-semibold text-foreground mb-2">Content Management and Organization</h4>
                                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                                        <li>To associate uploaded content with the correct client and store locations</li>
                                        <li>To enable our marketing administrators to organize and manage campaigns effectively</li>
                                        <li>To provide content scheduling and campaign management functionality</li>
                                        <li>To generate reports and analytics for marketing campaign performance</li>
                                    </ul>
                                </div>
                            <div className="bg-muted/50 rounded-lg p-4">
                                <h4 className="font-semibold text-foreground mb-2">Service Delivery and Support</h4>
                                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                                        <li>To provide technical support and troubleshoot issues</li>
                                        <li>To maintain and improve the security and performance of our platform</li>
                                        <li>To communicate important service updates and changes</li>
                                    </ul>
                                </div>
                            </div>
                        <InfoBox variant="success">
                             <h4 className="font-semibold mb-2">Important Commitment:</h4>
                            <p><strong>We do not sell your personal data to third parties or use it for targeted advertising.</strong> Your data is used exclusively to provide and improve our content management services.</p>
                        </InfoBox>
                    </PolicySection>


                        <PolicySection
                            icon={Users}
                            title="Your Rights & Data Deletion"
                            iconColorClass="text-red-500"
                        >
                         <p>You have the following rights regarding your personal data:</p>
                        <div className="space-y-4 my-4 not-prose">
                            <DataListItem
                                title="Right to Access"
                                    description="You can access your data at any time."
                                items={['You can access and review your personal data through your account dashboard at any time.']}
                            />
                            <DataListItem
                                title="Right to Rectification"
                                    description="You can correct your data."
                                items={[
                                    'You can update and correct your business information and profile details through your account settings.'
                                ]}
                                borderColorClass="border-green-500"
                            />
                            <DataListItem
                                title="Right to Data Portability"
                                    description="You can download your data."
                                items={[
                                    'You can download your content and data through the export features available in your dashboard.'
                                ]}
                                borderColorClass="border-orange-500"
                            />
                                <div className="border-l-4 border-red-500 pl-4">
                                <h4 className="font-semibold text-foreground mb-2">Right to Deletion</h4>
                                <p className="text-muted-foreground mb-2">You have the right to request deletion of your account and all associated data.</p>
                                <InfoBox variant="destructive">
                                    <h5 className="font-semibold mb-2">How to Request Data Deletion:</h5>
                                    <ol className="list-decimal list-inside space-y-1">
                                            <li>Send an email to <strong>support@hapogroup.co.za</strong></li>
                                            <li>Include your registered email address and account details</li>
                                            <li>Specify &quot;Data Deletion Request&quot; in the subject line</li>
                                            <li>We will process your request within 30 days and confirm completion</li>
                                        </ol>
                                    <p className="text-sm mt-2"><strong>Note:</strong> Data deletion is permanent and cannot be undone. All your uploaded content,
                                        business information, and account data will be permanently removed from our systems.</p>
                                </InfoBox>
                                </div>
                        </div>
                    </PolicySection>

                    {/* CORRECTED: This section is now separate and correctly themed  Termination by Us */}
                    <PolicySection
                        icon={Lock}
                        title="Security Measures"
                        iconColorClass="text-yellow-500">
                        <p>We implement comprehensive security measures to protect your data:</p>
                        <div className="grid md:grid-cols-2 gap-4 not-prose mt-4">
                            <div className="bg-muted/50 rounded-lg p-4">
                                <h4 className="font-semibold text-foreground mb-2">Access Control</h4>
                                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                                        <li>Role-based access control (RBAC)</li>
                                        <li>Multi-factor authentication via Google OAuth</li>
                                        <li>Session management and automatic timeouts</li>
                                    </ul>
                                </div>
                            <div className="bg-muted/50 rounded-lg p-4">
                                <h4 className="font-semibold text-foreground mb-2">Database Security</h4>
                                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                                        <li>Row Level Security (RLS) policies</li>
                                        <li>Encrypted data transmission (HTTPS/TLS)</li>
                                        <li>Regular security audits and monitoring</li>
                                    </ul>
                                </div>
                            <div className="bg-muted/50 rounded-lg p-4">
                                <h4 className="font-semibold text-foreground mb-2">File Storage Security</h4>
                                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                                        <li>Secure file upload and storage</li>
                                        <li>User-specific access permissions</li>
                                        <li>Automated backup and recovery systems</li>
                                    </ul>
                                </div>
                            <div className="bg-muted/50 rounded-lg p-4">
                                <h4 className="font-semibold text-foreground mb-2">Monitoring & Compliance</h4>
                                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                                        <li>Continuous security monitoring</li>
                                        <li>Regular vulnerability assessments</li>
                                        <li>Compliance with industry standards</li>
                                    </ul>
                                </div>
                            </div>
                    </PolicySection>

                    {/* Repeat the fix for the remaining sections */}
                    <PolicySection
                        icon={FileText}
                        title="Data Retention"
                        iconColorClass="text-muted-foreground">
                        <p>We retain your personal data only as long as necessary:</p>
                            <ul className="list-disc list-inside ">
                                <li><strong>Account Data:</strong> Retained while your account is active and for 90 days after account deletion for backup purposes.</li>
                                <li><strong>Content Files:</strong> Retained according to your campaign schedules and for 30 days after campaign completion.</li>
                                <li><strong>System Logs:</strong> Retained for 12 months for security and performance monitoring purposes.</li>
                            <li><strong>Business Information:</strong> Retained while your account is active to maintain service functionality.</li>
                            </ul>
                    </PolicySection>

                    <PolicySection
                        icon={Shield}
                        title="Changes to This Privacy Policy"
                        iconColorClass="text-purple-500"
                    >
                        <p>
                                We may update this Privacy Policy from time to time to reflect changes in our practices or for legal,
                                operational, or regulatory reasons. We will notify you of any material changes by posting the new Privacy Policy
                                on this page and updating the &quot;Last Updated&quot; date. We encourage you to review this Privacy Policy periodically
                                to stay informed about how we protect your information.
                            </p>
                    </PolicySection>

                    <PolicySection
                        icon={Mail}
                        title="Contact Us"
                    >
                        <InfoBox>
                            <h4 className="font-semibold text-primary mb-2">Privacy-Related Inquiries</h4>
                            <p className="text-primary/90 mb-2">
                                    If you have any questions about this Privacy Policy, your data rights, or our data practices, please contact us:
                                </p>
                            <div className="space-y-1 text-primary/80">
                                <p><strong>Email:</strong><a href="mailto:support@hapogroup.co.za" className="underline"> support@hapogroup.co.za</a></p>
                                    <p><strong>Subject Line:</strong> Privacy Policy Inquiry - Hapo Media Content Hub</p>
                                    <p><strong>Response Time:</strong> We aim to respond to all privacy inquiries within 5 business days.</p>
                                </div>
                        </InfoBox>
                    </PolicySection>
                </div>

                {/* Footer */}
                <div className="text-center mt-12 pt-8 border-t border-border">
                    <p className="text-muted-foreground text-sm">
                        © 2024 Hapo Media. All rights reserved. |
                        <span className="ml-2">Last Updated: {new Date().toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </p>
                </div>
            </div>
        </div>
    );
}