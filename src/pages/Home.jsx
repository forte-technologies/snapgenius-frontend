import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';
// import appScreenshot from '../assets/snapgenius_academicAi.png'; // Removed unused import
import promptTunerImage from '../assets/snapgenius-prompt-tuner.png';

// Define custom colors for inline styles (can move to tailwind config later)
const primaryBlue = '#3366FF';
const headingCharcoal = '#1F2937';
const bodyGray = '#475569';

function Home() {
    const { isAuthenticated, login } = useAuth();
    const navigate = useNavigate();

    // If user is already authenticated, redirect to dashboard
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, navigate]);

    return (
        // PublicLayout handles overall background/min-height
        <>
            {/* Hero Section - Centered, single column */}
            <div className="container mx-auto px-4 pt-20 pb-24 md:pt-28 md:pb-32">
                {/* Removed max-width constraint for full flexibility */}
                <div className="mx-auto text-center">
                    {/* Content is now centered */}
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 mb-4" style={{ color: primaryBlue }}>
                        ✨ AI-Powered Learning Lab
                    </span>
                    <h1
                        className="font-poppins tracking-tight font-bold text-3xl sm:text-4xl md:text-5xl lg:text-5xl 2xl:text-[4.5rem]"
                        style={{ 
                            color: headingCharcoal,
                            fontSize: 'clamp(1.8rem, 4vw, 4.5rem)' // Further reduced maximum size and viewport scaling
                        }}
                    >
                        <span className="block">Your Academic Library Instantly Searchable</span>
                        <span className="block" style={{ color: primaryBlue }}>Zero Hallucinations</span>
                    </h1>
                    
                    <p
                        className="mt-5 font-poppins text-lg md:text-xl md:mt-6 mx-auto max-w-4xl" 
                        style={{ color: bodyGray }}
                    >
                        Upload nearly infinite documents and images. snapGenius uses AI to intelligently save, embed, and understand your documents and images, allowing you to ask questions and get answers based directly on your uploads. Never worry about inaccurate answers again.
                    </p>

                    {/* Buttons - Centered */}
                    <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                        <button
                            onClick={login}
                            className="font-poppins w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 border border-transparent rounded-full shadow-sm text-base font-medium text-white hover:opacity-90 transition"
                            style={{ backgroundColor: primaryBlue }}
                        >
                            Get Started Now <span aria-hidden="true" className="ml-2">→</span>
                        </button>
                        <Link
                            to="/features"
                            className="font-poppins w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 border rounded-full shadow-sm text-base font-medium bg-white hover:bg-gray-50 transition"
                            style={{ color: headingCharcoal, borderColor: '#E5E7EB' }}
                        >
                            Learn More
                        </Link>
                    </div>
                    {/* Social Proof - Centered */}
                    <div className="mt-8 flex justify-center items-center">
                        <div className="text-sm font-poppins" style={{ color: bodyGray }}>
                            <span className="font-semibold" style={{ color: headingCharcoal }}>Join 10,000+ learners</span> worldwide
                        </div>
                    </div>
                </div>
                {/* Removed the right column div containing the image */}
            </div>

            {/* New Prompt Tuner Section - Removed bg-white, adjusted padding */}
            <section className="pt-16 sm:pt-20 pb-24 sm:pb-32">
                 <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                     {/* Left Column: Prompt Tuner Image */}
                     <div className="order-last lg:order-first">
                         <img 
                            src={promptTunerImage} 
                            alt="Screenshot of the snapGenius prompt tuner dials" 
                            className="rounded-lg shadow-lg border border-gray-200 mx-auto lg:mx-0 max-w-sm lg:max-w-md"
                        />
                     </div>
                     {/* Right Column: Text - Apply new styles */}
                     <div className="text-center lg:text-left">
                         <h2 
                            className="font-poppins text-3xl font-semibold tracking-tight sm:text-4xl mb-4"
                            style={{ color: headingCharcoal }}
                        >
                             Fine-Tune Your AI Assistant
                         </h2>
                         <p 
                            className="mt-4 font-poppins text-lg leading-relaxed"
                            style={{ color: bodyGray }}
                        >
                             Control the AI's response precisely with our Prompt Tuner. Easily adjust tone, complexity, focus, depth, and clarity to get exactly the output you need for any task.
                         </p>
                         <p 
                            className="mt-3 font-poppins text-lg leading-relaxed"
                             style={{ color: bodyGray }}
                        >
                            We're constantly adding new features like this to make snapGenius the most helpful and efficient tool for interacting with your documents and knowledge.
                         </p>
                     </div>
                 </div>
             </section>
        </>
    );
}

export default Home;