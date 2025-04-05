import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
    // Get current date to insert in policy
    const currentDate = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    return (
        <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_#fefbf6,_#e9e7e4)]">
            <div className="container mx-auto px-4 py-12 max-w-4xl">
                {/* Back navigation */}
                <div className="mb-8">
                    <Link to="/" className="inline-flex items-center text-[#10a37f] hover:text-[#0d8c6c] transition">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Home
                    </Link>
                </div>
                
                {/* Main content */}
                <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] p-8 md:p-12">
                    <div className="mb-8 flex flex-col items-center">
                        <img src="/icons/pwa-192x192.png" alt="SnapGenius Logo" className="h-24 w-auto mb-6" />
                        <h1 className="text-3xl font-bold text-center text-gray-800">Privacy Policy</h1>
                        <p className="text-sm text-gray-500 mt-2">Effective Date: {currentDate}</p>
                    </div>
                    
                    <div className="prose prose-slate max-w-none">
                        <section id="introduction" className="mb-10">
                            <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-4">1. Introduction</h2>
                            <p className="mb-4">Welcome to <strong>SnapGenius</strong>, a product of <strong>Forte Technologies, Inc.</strong> ("we", "our", or "us"). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our progressive web application (PWA), <strong>SnapGenius</strong>, available at <code className="bg-gray-100 px-2 py-1 rounded text-sm">https://snapgenius.app</code>.</p>
                            <p>By using our app, you agree to the terms of this Privacy Policy. If you do not agree, please do not use our services.</p>
                        </section>
                        
                        <section id="information-we-collect" className="mb-10">
                            <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-4">2. Information We Collect</h2>
                            
                            <h3 className="text-lg font-medium text-gray-700 mt-6 mb-3">Personal Information</h3>
                            <p className="mb-4">When you sign in using <strong>Google OAuth2</strong>, we collect <strong>only your email address</strong>. We do not collect your name, contacts, or any other Google account data.</p>
                            <p className="mb-4">This email is used <strong>only</strong> for authentication and identification within the app. We do <strong>not</strong> use it for marketing or any unrelated purposes.</p>
                            
                            <h3 className="text-lg font-medium text-gray-700 mt-6 mb-3">Uploaded Content</h3>
                            <p className="mb-4">Images you upload are stored securely and processed to provide AI-based search and chat functionality. This data stays private to your account and is <strong>never shared or sold</strong>.</p>
                            
                            <h3 className="text-lg font-medium text-gray-700 mt-6 mb-3">Technical Information</h3>
                            <p>We may collect non-personal technical data (browser type, device info, timestamps) for performance monitoring and debugging.</p>
                        </section>
                        
                        <section id="use-of-information" className="mb-10">
                            <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-4">3. Use of Information</h2>
                            <p className="mb-4">We use your information to:</p>
                            <ul className="list-disc pl-6 mb-4">
                                <li>Authenticate access via Google</li>
                                <li>Enable core features of SnapGenius</li>
                                <li>Maintain app functionality</li>
                                <li>Respond to user support requests</li>
                            </ul>
                            <p>We do <strong>not</strong> use your data for advertising or third-party marketing.</p>
                        </section>
                        
                        <section id="disclosure-of-information" className="mb-10">
                            <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-4">4. Disclosure of Information</h2>
                            <p className="mb-4">We do <strong>not</strong> sell, lease, or disclose your data, unless:</p>
                            <ul className="list-disc pl-6">
                                <li>Required by <strong>law</strong> (e.g., subpoena, legal request)</li>
                                <li>To protect our rights or investigate abuse</li>
                                <li>With your <strong>explicit consent</strong></li>
                            </ul>
                        </section>
                        
                        <section id="data-storage-security" className="mb-10">
                            <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-4">5. Data Storage and Security</h2>
                            <p className="mb-4">We store all data securely using encrypted cloud infrastructure. Data is encrypted <strong>at rest and in transit</strong>. Access is limited to authorized personnel only.</p>
                            <p>We retain your data only as long as necessary. Deleting your account deletes your data.</p>
                        </section>
                        
                        <section id="cookies" className="mb-10">
                            <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-4">6. Tokens and Local Storage</h2>
                            <p>We do <strong>not</strong> use cookies. Instead, we use JWT tokens and local storage to maintain authentication state and support session functionality. No tracking or third-party data collection mechanisms are used.</p>
                        </section>
                        
                        <section id="childrens-privacy" className="mb-10">
                            <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-4">7. Children's Privacy</h2>
                            <p>SnapGenius is not for users under 13 years old. We do not knowingly collect data from children. If we do, we delete it upon notice.</p>
                        </section>
                        
                        <section id="third-party-services" className="mb-10">
                            <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-4">8. Third-Party Services</h2>
                            <p className="mb-4">We use <strong>Google OAuth2</strong> to authenticate users.</p>
                            <p className="mb-4">We only access your <strong>email address</strong> and do not retrieve or store any other Google account data.</p>
                            <p>For Google's privacy policy, visit: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[#10a37f] hover:underline">https://policies.google.com/privacy</a></p>
                        </section>
                        
                        <section id="your-rights" className="mb-10">
                            <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-4">9. Your Rights</h2>
                            <p className="mb-4">Depending on your location, you may have the right to:</p>
                            <ul className="list-disc pl-6 mb-4">
                                <li>Access your data</li>
                                <li>Request deletion</li>
                                <li>Withdraw consent</li>
                                <li>File a complaint</li>
                            </ul>
                            <p>To do so, email us at the address below.</p>
                        </section>
                        
                        <section id="changes" className="mb-10">
                            <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-4">10. Changes</h2>
                            <p>We may update this policy. Material changes will be announced via the app or email. Continued use implies acceptance of the new terms.</p>
                        </section>
                        
                        <section id="contact" className="mb-10">
                            <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-4">11. Contact</h2>
                            <p className="mb-4">For questions or concerns:</p>
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <p className="font-medium text-gray-700">Forte Technologies LLC</p>
                                <p className="text-[#10a37f]">Email: <a href="mailto:team@fortetechnologies.io" className="hover:underline">team@fortetechnologies.io</a></p>
                            </div>
                        </section>
                    </div>
                </div>
                
                {/* Footer */}
                <div className="mt-8 text-center text-sm text-gray-500">
                    <p>© {new Date().getFullYear()} Forte Technologies, Inc. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy; 