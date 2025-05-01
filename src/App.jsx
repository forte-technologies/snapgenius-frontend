import { Routes, Route, useLocation } from 'react-router-dom';
import { lazy, Suspense, useEffect } from 'react';
import AuthProvider from './contexts/AuthProvider';
import ProtectedRoute from './components/ProtectedRoute';
import PublicLayout from './components/PublicLayout';
import Home from './pages/Home';
import Features from './pages/Features';
import Tools from './pages/Tools';
import Pricing from './pages/Pricing';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
const Dashboard = lazy(() => import('./pages/Dashboard'));

const LoadingFallback = () => (
    <div className="flex justify-center items-center h-screen">
        <div>Loading...</div>
    </div>
);

// List of paths where the scrollbar should always be visible
const scrollbarPaths = ['/', '/features', '/tools', '/pricing'];

function App() {
    const location = useLocation(); // Get current location

    // Effect to manage the html overflow style based on path
    useEffect(() => {
        if (scrollbarPaths.includes(location.pathname)) {
            document.documentElement.style.overflowY = 'scroll';
        } else {
            document.documentElement.style.overflowY = 'auto'; // Or '' or null
        }
        // Cleanup function is not strictly necessary here as we are resetting
        // but good practice if we were adding/removing classes/listeners
    }, [location.pathname]); // Re-run effect when path changes

    return (
        <AuthProvider>
            <Suspense fallback={<LoadingFallback />}>
                <Routes>
                    <Route element={<PublicLayout />}>
                        <Route path="/" element={<Home />} />
                        <Route path="/features" element={<Features />} />
                        <Route path="/tools" element={<Tools />} />
                        <Route path="/pricing" element={<Pricing />} />
                        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                        <Route path="/terms-of-service" element={<TermsOfService />} />
                    </Route>
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </Suspense>
        </AuthProvider>
    );
}

export default App;