import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';

function Home() {
    const { user, isAuthenticated, login } = useAuth();
    const navigate = useNavigate();

    // If user is already authenticated, redirect to dashboard
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, navigate]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#fefbf6] to-[#f7f7f7]">
            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] px-14 py-12 w-full max-w-md text-center transition-all duration-300">
                <div className="mb-6">
                    <h1 className="font-['Plus_Jakarta_Sans'] font-light text-2xl tracking-tight text-zinc-800">
                        myGenius
                    </h1>
                </div>
                
                <button
                    onClick={login}
                    className="flex items-center justify-center gap-2 w-full rounded-full border border-zinc-300 bg-zinc-50 py-3 text-sm font-medium text-zinc-700 hover:bg-zinc-100 hover:shadow transition"
                >
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="h-5 w-5" />
                    <span>Continue with Google</span>
                </button>
                
                <div className="mt-12 flex justify-center space-x-4">
                    <a href="#" className="text-xs text-[#10a37f] hover:underline">
                        Terms of Use
                    </a>
                    <span className="text-xs text-gray-500">|</span>
                    <a href="#" className="text-xs text-[#10a37f] hover:underline">
                        Privacy Policy
                    </a>
                </div>
            </div>
        </div>
    );
}

export default Home;