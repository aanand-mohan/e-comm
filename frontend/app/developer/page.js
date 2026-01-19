'use client';

import { useState, Suspense } from 'react';
import api from '@/services/api';
import { useRouter } from 'next/navigation';
import { Terminal, Code, Cpu } from 'lucide-react';

function DeveloperLoginForm() {
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

            if (data.role === 'developer') {
                localStorage.setItem('userInfo', JSON.stringify(data));
                router.push('/developer/dashboard');
            } else {
                setError('Access Denied: Developer privileges required.');
            }
        } catch (err) {
            const msg = err.response?.data?.message || 'Authentication Failed';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] py-12 px-4 sm:px-6 lg:px-8 font-mono relative overflow-hidden">
            {/* Matrix-like Background Effect */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,0,0.03)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
            <div className="absolute inset-0 bg-radial-gradient from-green-900/10 to-transparent opacity-40 pointer-events-none"></div>

            <div className="max-w-md w-full bg-[#111] border border-green-500/20 p-8 md:p-10 rounded-xl shadow-[0_0_40px_rgba(0,255,0,0.1)] relative z-10 backdrop-blur-sm">
                <div className="mb-8 text-center relative">
                    <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 w-24 h-24 bg-green-500/10 rounded-full blur-xl"></div>
                    <Cpu className="mx-auto h-12 w-12 text-green-500 mb-4 animate-pulse" />
                    <h2 className="text-3xl font-bold text-white tracking-wider mb-2">
                        DEV<span className="text-green-500">_PORTAL</span>
                    </h2>
                    <p className="text-xs text-green-500/60 uppercase tracking-[0.2em] font-light">
                        System Access Control
                    </p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-900/10 border border-red-500/50 p-3 rounded text-center">
                            <span className="text-red-400 text-xs font-bold tracking-wide">
                                [ERROR]: {error}
                            </span>
                        </div>
                    )}

                    <div className="space-y-5">
                        <div className="group">
                            <label className="block text-xs font-bold text-green-500/70 uppercase tracking-widest mb-2" htmlFor="email">
                                // IDENTITY
                            </label>
                            <div className="relative">
                                <Terminal className="absolute left-3 top-3 h-5 w-5 text-gray-500 group-focus-within:text-green-500 transition-colors" />
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    className="appearance-none block w-full pl-10 pr-4 py-3 bg-black/40 border border-white/5 rounded-lg text-green-400 placeholder-gray-700 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500/50 transition-all font-mono"
                                    placeholder="dev@rudradivine.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="group">
                            <label className="block text-xs font-bold text-green-500/70 uppercase tracking-widest mb-2" htmlFor="password">
                                // ACCESS_KEY
                            </label>
                            <div className="relative">
                                <Code className="absolute left-3 top-3 h-5 w-5 text-gray-500 group-focus-within:text-green-500 transition-colors" />
                                <input
                                    id="password"
                                    type="password"
                                    required
                                    className="appearance-none block w-full pl-10 pr-4 py-3 bg-black/40 border border-white/5 rounded-lg text-green-400 placeholder-gray-700 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500/50 transition-all font-mono"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full relative group overflow-hidden bg-green-900/20 border border-green-500/50 hover:bg-green-500/10 text-green-400 font-bold py-3.5 px-4 rounded-lg transition-all transform active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-black"
                    >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            {loading ? (
                                <span className="animate-pulse">INITIALIZING HANDSHAKE...</span>
                            ) : (
                                <>
                                    <span>EXECUTE_LOGIN</span>
                                    <span className="block h-2 w-2 bg-green-500 rounded-full animate-ping"></span>
                                </>
                            )}
                        </span>
                        <div className="absolute inset-0 bg-green-500/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-white/5 text-center">
                    <p className="text-[10px] text-gray-600">
                        RESTRICTED AREA • AUTHORIZED PERSONNEL ONLY • V.2.0.4
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function DeveloperLoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-black text-green-500 font-mono">LOADING_MODULES...</div>}>
            <DeveloperLoginForm />
        </Suspense>
    );
}
