'use client';

import { useEffect, useState } from 'react';
import api from '@/services/api';
import { Trash2, User, Shield, ShieldAlert, Check } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import Skeleton from '@/components/ui/Skeleton';

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { success, error: toastError } = useToast();

    const fetchUsers = async () => {
        try {
            const { data } = await api.get('/api/users');
            setUsers(data);
        } catch (err) {
            toastError(err.response?.data?.message || 'Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            await api.delete(`/api/users/${id}`);
            setUsers(users.filter(user => user._id !== id));
            success('User deleted successfully');
        } catch (err) {
            toastError(err.response?.data?.message || 'Failed to delete user');
        }
    };

    if (loading) return (
        <div className="space-y-4">
            <div className="flex justify-between">
                <Skeleton className="w-48 h-10 rounded-lg bg-neutral-900 border border-white/10" />
            </div>
            <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full rounded-lg bg-neutral-900 border border-white/10" />
                ))}
            </div>
        </div>
    );

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-serif font-bold text-white tracking-wide">Users</h1>
                <p className="text-gray-400 mt-1">Manage platform users and administrators</p>
            </div>

            <div className="bg-neutral-900/50 backdrop-blur-sm rounded-2xl shadow-lg border border-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-white/5">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">User</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Joined</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {users.map((user) => (
                                <tr key={user._id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-neutral-800 border border-white/10 flex items-center justify-center text-primary font-bold text-xs uppercase">
                                                {user.name ? user.name[0] : 'U'}
                                            </div>
                                            <span className="text-sm font-medium text-white">{user.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-400">
                                        {user.email}
                                    </td>
                                    <td className="px-6 py-4">
                                        {user.isAdmin ? (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/20 text-primary border border-primary/30">
                                                <Shield size={12} fill="currentColor" /> Admin
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-800 text-gray-400 border border-gray-700">
                                                <User size={12} /> User
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleDelete(user._id)}
                                            className="p-2 bg-white/5 rounded-full text-gray-400 hover:text-red-400 hover:bg-red-900/20 transition-all"
                                            title="Delete User"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                        No users found.
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
