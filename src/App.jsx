import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import AuthProvider from './contexts/AuthProvider';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
const Dashboard = lazy(() => import('./pages/Dashboard'));
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';

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
                    <Route path="/" element={<Home />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="/terms-of-service" element={<TermsOfService />} />
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