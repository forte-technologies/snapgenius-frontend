import React from 'react';
// import PublicNavbar from '../components/PublicNavbar'; // Removed

const headingCharcoal = '#1F2937';
const bodyGray = '#475569';

function Tools() {
  return (
    // Standard section padding and container
    <div className="py-24 sm:py-32">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 
            className="text-4xl font-bold tracking-tight sm:text-5xl text-center mb-12 lg:mb-16"
            style={{ color: headingCharcoal }}
        >
            Tools
        </h1>
        <p 
            className="mt-4 text-lg leading-relaxed text-center"
            style={{ color: bodyGray }}
        >
            Details about available tools coming soon...
          </p>
          {/* Add tool details here later */}
      </div>
    </div>
  );
}

export default Tools; 