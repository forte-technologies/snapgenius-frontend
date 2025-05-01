import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
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

function App() {
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