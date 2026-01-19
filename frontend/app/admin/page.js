'use client';

import { useState, Suspense } from 'react';
import api from '@/services/api';
import { useRouter } from 'next/navigation';

function AdminLoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { data } = await api.post('/api/users/login', { email, password });

            if (data.role === 'admin') {
                localStorage.setItem('userInfo', JSON.stringify(data));
                router.push('/admin/dashboard');
            } else {
                setError('Unauthorized: Access restricted to administrators only.');
                // Optionally clear session if the API set a cookie/token, 
                // but since we are relying on userInfo in localStorage for role checks in frontend, 
                // simply not setting it or removing it is enough for now.
                // However, the API might have set a cookie. 
                // If the user is just a regular user, we shouldn't log them in here.
            }
        } catch (err) {
            const msg = err.response?.data?.message || 'Invalid email or password';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black py-12 px-4 sm:px-6 lg:px-8 font-sans relative overflow-hidden">
            {/* Background Gradient/Effects */}
            <div className="absolute inset-0 bg-radial-gradient from-red-900/10 to-transparent opacity-30 pointer-events-none"></div>

            <div className="max-w-md w-full bg-neutral-900/60 backdrop-blur-xl p-8 md:p-10 rounded-2xl shadow-2xl border border-white/10 relative z-10">
                <div className="mb-8 text-center">
                    <span className="text-3xl mb-4 block filter drop-shadow-[0_0_10px_rgba(255,0,0,0.5)]">🛡️</span>
                    <h2 className="text-3xl font-serif font-bold text-white tracking-wide">
                        Admin Portal
                    </h2>
                    <p className="mt-2 text-sm text-gray-400 tracking-wide uppercase">
                        Authorized Personnel Only
                    </p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-900/20 border-l-4 border-red-500 p-4 rounded-md">
                            <span className="text-red-400 text-sm font-medium">{error}</span>
                        </div>
                    )}

                    <div className="space-y-5">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1" htmlFor="email">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                required
                                className="appearance-none block w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500/50 text-white transition-all"
                                placeholder="admin@rudradivine.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1" htmlFor="password">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                required
                                className="appearance-none block w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500/50 text-white transition-all"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(220,38,38,0.3)] hover:shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-all transform active:scale-[0.98]"
                    >
                        {loading ? 'Verifying...' : 'Access Dashboard'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default function AdminLoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-black text-red-500">Loading...</div>}>
            <AdminLoginForm />
        </Suspense>
    );
}
