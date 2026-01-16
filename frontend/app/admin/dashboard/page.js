'use client';

import { useEffect, useState } from 'react';
import api from '@/services/api';
import Link from 'next/link';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        usersCount: 0,
        productsCount: 0,
        ordersCount: 0,
        totalSales: 0,
        recentOrders: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await api.get('/api/admin/summary');
                setStats(data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch stats');
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <div className="p-6">Loading dashboard...</div>;
    if (error) return <div className="p-6 text-red-500">Error: {error}</div>;

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium">Total Sales</h3>
                    <p className="text-2xl font-bold text-gray-900 mt-2">
                        ₹{stats.totalSales.toLocaleString()}
                    </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium">Total Orders</h3>
                    <p className="text-2xl font-bold text-gray-900 mt-2">
                        {stats.ordersCount}
                    </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium">Products</h3>
                    <p className="text-2xl font-bold text-gray-900 mt-2">
                        {stats.productsCount}
                    </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium">Users</h3>
                    <p className="text-2xl font-bold text-gray-900 mt-2">
                        {stats.usersCount}
                    </p>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="mb-8 flex gap-4">
                <Link href="/admin/products" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                    Manage Products
                </Link>
                <Link href="/admin/orders" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
                    Manage Orders
                </Link>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-semibold">Recent Orders</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Order ID</th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">User</th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Date</th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Total</th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {stats.recentOrders.map((order) => (
                                <tr key={order._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm text-gray-900 font-mono">
                                        {order._id.substring(0, 8)}...
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        {order.user?.name || 'Guest'}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        ₹{order.totalAmount}
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${order.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {order.paymentStatus}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <Link href={`/admin/orders/${order._id}`} className="text-blue-600 hover:text-blue-800">
                                            View
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            {stats.recentOrders.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                                        No recent orders found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
