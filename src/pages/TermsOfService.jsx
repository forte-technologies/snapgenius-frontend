import { Link } from 'react-router-dom';

const TermsOfService = () => {
    // Get current date to insert in terms
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
                        <h1 className="text-3xl font-bold text-center text-gray-800">Terms of Service</h1>
                        <p className="text-sm text-gray-500 mt-2">Effective Date: {currentDate}</p>
                    </div>
                    
                    <div className="prose prose-slate max-w-none">
                        <p className="mb-6">
                            Welcome to SnapGenius. These Terms of Service ("Terms") govern your use of SnapGenius ("we," "us," or "our") and apply to all users of our services, including our web application, APIs, and any associated content ("Services").
                        </p>
                        <p className="mb-8">
                            By accessing or using the Services, you agree to be bound by these Terms. If you do not agree, do not use SnapGenius.
                        </p>

                        <section id="description-of-services" className="mb-10">
                            <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-4">1. Description of Services</h2>
                            <p className="mb-4">SnapGenius is an AI-powered personal assistant that enables users to:</p>
                            <ul className="list-disc pl-6 mb-4">
                                <li>Upload photos and notes</li>
                                <li>Automatically extract, store, and index content using AI</li>
                                <li>Retrieve and interact with this stored data on demand</li>
                            </ul>
                            <p>Our platform is designed to help users retain and organize personal information using modern retrieval-augmented generation (RAG) and vector storage systems.</p>
                        </section>
                        
                        <section id="user-conduct" className="mb-10">
                            <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-4">2. User Conduct</h2>
                            <p className="mb-4">By using SnapGenius, you agree:</p>
                            <ul className="mb-4">
                                <li className="mb-2"><strong>You will not upload, generate, or store illegal content of any kind.</strong></li>
                                <li className="mb-2"><strong>You are strictly prohibited from uploading or sharing any content involving child sexual abuse material (CSAM), pornography involving minors, or any non-consensual sexual content.</strong></li>
                                <li className="mb-2">You will not use SnapGenius to harass, threaten, or abuse others.</li>
                                <li className="mb-2">You are responsible for all content you upload, and you retain full legal responsibility for it.</li>
                                <li className="mb-2">You will not attempt to reverse-engineer, exploit, or disrupt our Services.</li>
                            </ul>
                            <p className="bg-red-50 p-4 rounded-lg border border-red-200 text-red-800">
                                <strong>Any violation of these conduct terms will result in immediate termination and reporting to the appropriate authorities where applicable.</strong>
                            </p>
                        </section>
                        
                        <section id="data-usage-privacy" className="mb-10">
                            <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-4">3. Data Usage and Privacy</h2>
                            <p className="mb-4">You own the content you upload. By using the platform, you grant SnapGenius a limited license to process, store, and index your data for the purpose of delivering our Services.</p>
                            <p>
                                Refer to our <Link to="/privacy-policy" className="text-[#10a37f] hover:underline">Privacy Policy</Link> for full details on how we handle your information.
                            </p>
                        </section>
                        
                        <section id="intellectual-property" className="mb-10">
                            <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-4">4. Intellectual Property</h2>
                            <p>SnapGenius, including its interface, models, branding, and underlying technology, is the property of Forte Technologies or its licensors. You may not duplicate, distribute, or create derivative works without explicit permission.</p>
                        </section>
                        
                        <section id="disclaimers" className="mb-10">
                            <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-4">5. Disclaimers</h2>
                            <ul className="list-disc pl-6">
                                <li>The Services are provided "as is" and "as available."</li>
                                <li>We make no guarantees regarding uptime, accuracy, or data retention.</li>
                                <li>We are not liable for any indirect or consequential damages, data loss, or service disruptions.</li>
                            </ul>
                        </section>
                        
                        <section id="termination" className="mb-10">
                            <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-4">6. Termination</h2>
                            <p>We reserve the right to suspend or terminate your access to SnapGenius at any time, for any reason, especially for violation of these Terms.</p>
                        </section>
                        
                        <section id="changes-to-terms" className="mb-10">
                            <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-4">7. Changes to Terms</h2>
                            <p>We may update these Terms from time to time. When we do, we will revise the "Effective Date" above. Continued use of SnapGenius constitutes acceptance of the new terms.</p>
                        </section>
                        
                        <section id="contact" className="mb-10">
                            <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-4">8. Contact</h2>
                            <p className="mb-4">For questions, legal concerns, or to report abuse:</p>
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
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

export default TermsOfService; 