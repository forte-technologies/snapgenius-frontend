import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';

// Define placeholder links 
const navLinks = [
    { name: 'Features', href: '/features' }, 
    { name: 'Tools', href: '/tools' },      
    { name: 'Pricing', href: '/pricing' },    
];

// Re-use colors if needed, or use Tailwind defaults
// const headingCharcoal = '#1F2937'; // Using Tailwind's text-gray-900 now

function PublicNavbar() {
    const { login } = useAuth(); 

    return (
        // Full-width header with bottom border
        <header className="w-full bg-white border-b border-gray-200"> 
            {/* Wider content container */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> 
                {/* Standard height flex container */}
                <div className="flex justify-between items-center h-16"> 
                    {/* Logo/Brand */}
                    <div className="flex-shrink-0 flex items-center">
                        {/* Using text-gray-900 for logo */}
                        <Link to="/" className="font-poppins font-bold text-2xl text-gray-900">snapGenius</Link> 
                    </div>
                    
                    {/* Desktop Navigation Links - Increased spacing */}
                    <nav className="hidden md:flex md:space-x-10">
                        {navLinks.map((item) => (
                            <Link 
                                key={item.name} 
                                to={item.href} 
                                // Updated text color, kept blue hover
                                className="font-poppins text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors duration-150 ease-in-out" 
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Login Button - Standard rounded style */}
                    <div className="hidden md:flex items-center">
                         <button
                            onClick={login} 
                            // Updated button style: rounded-md
                            className="font-poppins ml-8 inline-flex items-center justify-center px-5 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition"
                         >
                             Login
                         </button>
                     </div>

                    {/* Mobile Menu Button Placeholder */}
                     <div className="-mr-2 flex items-center md:hidden">
                          <button type="button" className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500" aria-expanded="false">
                             <span className="sr-only">Open main menu</span>
                             <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                             </svg>
                         </button>
                      </div>
                </div>
            </div>
         </header>
    );
}

export default PublicNavbar; 