'use client';

import { useState, useEffect } from 'react';
import api from '@/services/api';
import { useRouter } from 'next/navigation';
import { User, Package, LogOut } from 'lucide-react';
import Link from 'next/link';

export default function AccountPage() {
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchAccountData = async () => {
            const userInfo = localStorage.getItem('userInfo');
            if (!userInfo) {
                router.push('/login?redirect=/account');
                return;
            }

            setUser(JSON.parse(userInfo));

            try {
                // Fetch User Orders
                // Note: We need a route for 'my orders'. 
                // Let's assume GET /api/orders/myorders or similar based on standard Controller patterns
                // Checking previous implementation plan/history might be needed, but let's try standard first.
                // Re-using admin route might fail if not protected correctly, usually it's /api/orders/myorders
                const { data } = await api.get('/api/orders/myorders');
                setOrders(data);
            } catch (error) {
                console.error('Failed to fetch orders:', error);
                // Graceful degration: show empty orders if API fails (or route doesn't exist yet)
            } finally {
                setLoading(false);
            }
        };

        fetchAccountData();
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        localStorage.removeItem('guestCart'); // Optional: clear or keep? Usually keep guest stuff clear.
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;'; // Clear cookie if used
        router.push('/login');
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading account...</div>;

    if (!user) return null; // Redirecting

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium"
                    >
                        <LogOut size={20} /> Sign Out
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* User Profile */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="bg-red-100 p-3 rounded-full">
                                    <User size={32} className="text-red-600" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                                    <p className="text-gray-500 text-sm">{user.email}</p>
                                </div>
                            </div>
                            <div className="border-t pt-4">
                                <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold mb-2">Member Since</p>
                                <p className="text-gray-900">{new Date(user.createdAt || Date.now()).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>

                    {/* Order History */}
                    <div className="lg:col-span-2">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <Package className="text-gray-700" /> Order History
                        </h2>

                        {orders.length === 0 ? (
                            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                                <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
                                <Link href="/" className="text-red-600 font-bold hover:underline">Start Shopping</Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {orders.map(order => (
                                    <div key={order._id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                                        <div className="bg-gray-50 px-6 py-4 flex justify-between items-center flex-wrap gap-4">
                                            <div>
                                                <p className="text-sm text-gray-500">Order ID: <span className="font-mono text-gray-900">{order._id}</span></p>
                                                <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                    {order.paymentStatus}
                                                </span>
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                                    }`}>
                                                    {order.orderStatus}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="p-6">
                                            <div className="space-y-6">
                                                {order.products?.map((item, idx) => (
                                                    <div key={idx} className="flex items-start gap-4">
                                                        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                                            <img
                                                                src={item.image}
                                                                alt={item.title}
                                                                className="h-full w-full object-cover object-center"
                                                            />
                                                        </div>
                                                        <div className="flex-1">
                                                            <h3 className="text-base font-medium text-gray-900">{item.title}</h3>
                                                            {/* If description exists in product, we might need to fetch it or rely on title. Schema doesn't save desc. */}
                                                            <p className="mt-1 text-sm text-gray-500">Qty: {item.quantity}</p>
                                                            <p className="font-medium text-gray-900 mt-1">₹{item.price?.toLocaleString('en-IN')}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="border-t mt-6 pt-4 flex justify-between items-center">
                                                <p className="text-gray-500 text-sm">Total Amount</p>
                                                <p className="font-bold text-lg text-red-600">₹{order.totalAmount?.toLocaleString('en-IN')}</p>
                                            </div>

                                            <div className="mt-4 pt-2">
                                                <Link href={`/order-success/${order._id}`} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                                    View Invoice / Details &rarr;
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
