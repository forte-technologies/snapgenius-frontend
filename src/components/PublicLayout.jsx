import React from 'react';
import { Outlet } from 'react-router-dom';
import PublicNavbar from './PublicNavbar';

function PublicLayout() {
  return (
    // Adjust background/min-height as needed for the overall public section
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <PublicNavbar />
      {/* Main content area where child routes render */}
      <main>
        <Outlet /> 
      </main>
    </div>
  );
}

export default PublicLayout; 