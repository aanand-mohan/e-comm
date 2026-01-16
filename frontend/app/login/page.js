'use client';

import { useState } from 'react';
import api from '@/services/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { useSearchParams } from 'next/navigation';

import SupportChat from '@/components/SupportChat';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showSupport, setShowSupport] = useState(false);

    // ... (router hooks)
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams.get('redirect') || '/';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setShowSupport(false);

        try {
            const { data } = await api.post('/api/users/login', { email, password });

            // ... (sync logic same as before)
            localStorage.setItem('userInfo', JSON.stringify(data));
            // SYNC GUEST CART
            try {
                const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
                if (guestCart.length > 0) {
                    const validItems = guestCart.filter(item => item && item.product && item.product._id);
                    const cartPromises = validItems.map(item =>
                        api.post('/api/cart', { productId: item.product._id, quantity: item.quantity })
                    );
                    await Promise.all(cartPromises);
                    localStorage.removeItem('guestCart');
                }
            } catch (syncError) {
                console.error('Cart sync failed:', syncError);
            }

            if (data.role === 'admin') {
                router.push('/admin/dashboard');
            } else if (data.role === 'developer') {
                router.push('/developer/dashboard');
            } else if (data.role === 'user') {
                router.push('/user/dashboard');
            } else {
                router.push(redirect);
            }
        } catch (err) {
            const msg = err.response?.data?.message || 'Invalid email or password';
            setError(msg);
            if (msg === 'Account deactivated') {
                setShowSupport(true);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Sign in to your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Or{' '}
                        <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500">
                            create a new account
                        </Link>
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-100 text-red-700 p-3 rounded flex flex-col gap-2">
                            <span>{error}</span>
                            {showSupport && (
                                <button
                                    type="button"
                                    onClick={() => setShowSupport(true)} // Actually it's just opening the modal
                                    className="text-sm font-bold underline text-red-800 hover:text-red-900 text-left"
                                >
                                    Contact Support for Activation
                                </button>
                            )}
                        </div>
                    )}
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <input
                                type="email"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <input
                                type="password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-end">
                        <Link href="/forgot-password" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                            Forgot your password?
                        </Link>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                            {loading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </div>
                </form>
            </div>

            {showSupport && (
                <SupportChat
                    onClose={() => setShowSupport(false)}
                    predefinedMessage="My account has been deactivated. I would like to request reactivation."
                />
            )}
        </div>
    );
}
