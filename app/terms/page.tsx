import { BackButton } from '@/components/ui/BackButton';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { FileText, Users, Shield, AlertTriangle, Mail } from 'lucide-react';

export default function TermsOfServicePage() {
    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="container mx-auto max-w-4xl">
                <div className="mb-6">
                    <BackButton href="/" label="Back to home" />
                    <Breadcrumb
                        items={[
                            { label: 'Terms of Service', current: true }
                        ]}
                        className="mt-2"
                    />
                </div>

                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Terms of Service</h1>
                    <p className="text-gray-600">Hapo Media Content Hub</p>
                    <p className="text-sm text-gray-500 mt-2">Last Updated: 16 July 2025</p>
                </div>

                <div className="space-y-6">
                    {/* Introduction */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="w-5 h-5 text-blue-600" />
                                Agreement to Terms
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-700 mb-4">
                                Welcome to the Hapo Media Content Hub. These Terms of Service (&quot;Terms&quot;) govern your use of our
                                content management platform and services. By accessing or using our service, you agree to be bound
                                by these Terms.
                            </p>
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <p className="text-blue-800">
                                    <strong>Important:</strong> If you do not agree to these Terms, please do not use our service.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Service Description */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="w-5 h-5 text-green-600" />
                                Service Description
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-700 mb-4">
                                The Hapo Media Content Hub is a digital content management platform that allows:
                            </p>
                            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                                <li><strong>Clients</strong> to upload, organize, and schedule digital marketing content</li>
                                <li><strong>Administrators</strong> to manage, organize, and deploy client content across multiple locations</li>
                                <li>Secure storage and management of images, videos, and audio files</li>
                                <li>Campaign scheduling and content organization tools</li>
                            </ul>
                        </CardContent>
                    </Card>

                    {/* User Accounts and Responsibilities */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="w-5 h-5 text-purple-600" />
                                User Accounts and Responsibilities
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-2">Account Creation</h4>
                                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                                        <li>You must provide accurate and complete information when creating an account</li>
                                        <li>You are responsible for maintaining the security of your account credentials</li>
                                        <li>You must notify us immediately of any unauthorized use of your account</li>
                                    </ul>
                                </div>

                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-2">Acceptable Use</h4>
                                    <p className="text-gray-700 mb-2">You agree to use our service only for lawful purposes and in accordance with these Terms. You must not:</p>
                                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                                        <li>Upload content that infringes on intellectual property rights</li>
                                        <li>Share inappropriate, offensive, or illegal content</li>
                                        <li>Attempt to gain unauthorized access to our systems</li>
                                        <li>Use the service to distribute malware or harmful code</li>
                                        <li>Violate any applicable laws or regulations</li>
                                    </ul>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Content and Intellectual Property */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="w-5 h-5 text-orange-600" />
                                Content and Intellectual Property
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-2">Your Content</h4>
                                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                                        <li>You retain ownership of all content you upload to our platform</li>
                                        <li>You grant us a limited license to store, process, and display your content as necessary to provide our services</li>
                                        <li>You are responsible for ensuring you have the right to upload and use all content</li>
                                        <li>You warrant that your content does not infringe on third-party rights</li>
                                    </ul>
                                </div>

                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-2">Our Platform</h4>
                                    <p className="text-gray-700">
                                        The Hapo Media Content Hub platform, including its design, functionality, and underlying technology,
                                        is owned by Hapo Media and protected by intellectual property laws.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Service Availability and Modifications */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                                Service Availability and Modifications
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-2">Service Availability</h4>
                                    <p className="text-gray-700">
                                        While we strive to provide continuous service availability, we do not guarantee uninterrupted access.
                                        We may temporarily suspend service for maintenance, updates, or other operational reasons.
                                    </p>
                                </div>

                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-2">Service Modifications</h4>
                                    <p className="text-gray-700">
                                        We reserve the right to modify, update, or discontinue features of our service at any time.
                                        We will provide reasonable notice of significant changes that may affect your use of the service.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Limitation of Liability */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="w-5 h-5 text-red-600" />
                                Limitation of Liability
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                                <h4 className="font-semibold text-red-800 mb-2">Important Legal Notice</h4>
                                <p className="text-red-700 text-sm">
                                    The following limitations apply to the maximum extent permitted by law.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <p className="text-gray-700">
                                    <strong>Service &quot;As Is&quot;:</strong> Our service is provided &quot;as is&quot; without warranties of any kind,
                                    either express or implied.
                                </p>

                                <p className="text-gray-700">
                                    <strong>Limitation of Damages:</strong> In no event shall Hapo Media be liable for any indirect,
                                    incidental, special, consequential, or punitive damages, including but not limited to loss of profits,
                                    data, or business opportunities.
                                </p>

                                <p className="text-gray-700">
                                    <strong>Maximum Liability:</strong> Our total liability for any claims related to the service
                                    shall not exceed the amount paid by you for the service in the 12 months preceding the claim.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Termination */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-gray-600" />
                                Termination
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-2">Termination by You</h4>
                                    <p className="text-gray-700">
                                        You may terminate your account at any time by contacting us or using the account deletion
                                        features in your dashboard.
                                    </p>
                                </div>

                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-2">Termination by Us</h4>
                                    <p className="text-gray-700 mb-2">
                                        We may terminate or suspend your account if you:
                                    </p>
                                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                                        <li>Violate these Terms of Service</li>
                                        <li>Engage in fraudulent or illegal activities</li>
                                        <li>Pose a security risk to our platform or other users</li>
                                    </ul>
                                </div>

                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-2">Effect of Termination</h4>
                                    <p className="text-gray-700">
                                        Upon termination, your access to the service will cease, and we may delete your account
                                        and associated data in accordance with our Privacy Policy.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Changes to Terms */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="w-5 h-5 text-indigo-600" />
                                Changes to These Terms
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-700 mb-4">
                                We may update these Terms from time to time to reflect changes in our service, legal requirements,
                                or business practices. We will notify you of material changes by:
                            </p>
                            <ul className="list-disc list-inside text-gray-700 space-y-1 mb-4">
                                <li>Posting the updated Terms on our platform</li>
                                <li>Updating the &quot;Last Updated&quot; date</li>
                                <li>Sending email notifications for significant changes</li>
                            </ul>
                            <p className="text-gray-700">
                                Your continued use of the service after changes become effective constitutes acceptance of the new Terms.
                            </p>
                        </CardContent>
                    </Card>

                    {/* Contact Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Mail className="w-5 h-5 text-blue-600" />
                                Contact Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                                <h4 className="font-semibold text-blue-900 mb-4">Questions About These Terms?</h4>
                                <p className="text-blue-800 mb-2">
                                    If you have any questions about these Terms of Service, please contact us:
                                </p>
                                <div className="space-y-2 text-blue-700">
                                    <p><strong>Email:</strong> <a href="mailto:support@hapogroup.co.za" className="underline">support@hapogroup.co.za</a></p>
                                    <p><strong>Subject Line:</strong> Terms of Service Inquiry - Hapo Media Content Hub</p>
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