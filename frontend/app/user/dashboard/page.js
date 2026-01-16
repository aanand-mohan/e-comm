'use client';

import { useEffect, useState } from 'react';
import api from '@/services/api';
import Link from 'next/link';
import { Package, User as UserIcon, Heart } from 'lucide-react';

export default function UserDashboard() {
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: userData } = await api.get('/api/users/profile');
                const { data: ordersData } = await api.get('/api/orders/myorders');
                setUser(userData);
                setOrders(ordersData);
            } catch (error) {
                console.error('Failed to fetch dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
        );
    }

    if (!user) return <div className="text-center p-10">Please login to view your dashboard.</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">My Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Profile Card */}
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 flex items-center gap-4">
                    <div className="bg-blue-100 p-3 rounded-full">
                        <UserIcon className="text-blue-600" size={24} />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold">{user.name}</h2>
                        <p className="text-gray-500 text-sm">{user.email}</p>
                        <Link href="/profile" className="text-blue-500 text-sm hover:underline mt-1 block">Edit Profile</Link>
                    </div>
                </div>

                {/* Orders Card */}
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 flex items-center gap-4">
                    <div className="bg-green-100 p-3 rounded-full">
                        <Package className="text-green-600" size={24} />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold">{orders.length} Orders</h2>
                        <Link href="/user/orders" className="text-blue-500 text-sm hover:underline mt-1 block">View History</Link>
                    </div>
                </div>

                {/* Wishlist Card */}
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 flex items-center gap-4">
                    <div className="bg-red-100 p-3 rounded-full">
                        <Heart className="text-red-600" size={24} />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold">Wishlist</h2>
                        <Link href="/wishlist" className="text-blue-500 text-sm hover:underline mt-1 block">View Saved Items</Link>
                    </div>
                </div>
            </div>

            <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
            {orders.length === 0 ? (
                <p className="text-gray-500">No orders placed yet.</p>
            ) : (
                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    <ul className="divide-y divide-gray-200">
                        {orders.slice(0, 5).map((order) => (
                            <li key={order._id}>
                                <div className="px-4 py-4 sm:px-6">
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm font-medium text-green-600 truncate">
                                            Order #{order._id.substring(0, 8)}
                                        </div>
                                        <div className="ml-2 flex-shrink-0 flex">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {order.orderStatus}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="mt-2 sm:flex sm:justify-between">
                                        <div className="sm:flex">
                                            <p className="flex items-center text-sm text-gray-500">
                                                Placed on {new Date(order.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                            <p>Total: ₹{order.totalAmount}</p>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
