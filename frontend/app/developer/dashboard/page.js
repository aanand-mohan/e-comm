'use client';

import { useEffect, useState } from 'react';
import api from '@/services/api';
import Link from 'next/link';
import { Terminal, Server, Database, Activity, ShieldAlert } from 'lucide-react';

export default function DeveloperDashboard() {
    const [systemHealth, setSystemHealth] = useState({
        status: 'Online',
        uptime: '99.9%',
        dbStatus: 'Connected',
        latency: '24ms'
    });
    // In a real app, we'd have a specific endpoint for system health. 
    // Reusing admin stats for some data for now.
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            // Developers can access admin stats too
            try {
                const { data } = await api.get('/api/admin/summary');
                setStats(data);
            } catch (error) {
                console.error('Failed to fetch stats:', error);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="min-h-screen bg-gray-900 text-green-400 p-6 font-mono">
            <div className="flex items-center gap-3 mb-8 border-b border-gray-700 pb-4">
                <Terminal size={32} />
                <h1 className="text-3xl font-bold">Developer Console_</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-gray-800 p-6 rounded border border-green-900 shadow-[0_0_10px_rgba(0,255,0,0.1)]">
                    <div className="flex items-center gap-2 mb-2 text-gray-400">
                        <Activity size={18} />
                        <span className="text-xs uppercase">System Status</span>
                    </div>
                    <div className="text-2xl font-bold text-white">{systemHealth.status}</div>
                </div>
                <div className="bg-gray-800 p-6 rounded border border-green-900 shadow-[0_0_10px_rgba(0,255,0,0.1)]">
                    <div className="flex items-center gap-2 mb-2 text-gray-400">
                        <Server size={18} />
                        <span className="text-xs uppercase">Server Uptime</span>
                    </div>
                    <div className="text-2xl font-bold text-white">{systemHealth.uptime}</div>
                </div>
                <div className="bg-gray-800 p-6 rounded border border-green-900 shadow-[0_0_10px_rgba(0,255,0,0.1)]">
                    <div className="flex items-center gap-2 mb-2 text-gray-400">
                        <Database size={18} />
                        <span className="text-xs uppercase">Database</span>
                    </div>
                    <div className="text-2xl font-bold text-white">{systemHealth.dbStatus}</div>
                </div>
                <div className="bg-gray-800 p-6 rounded border border-green-900 shadow-[0_0_10px_rgba(0,255,0,0.1)]">
                    <div className="flex items-center gap-2 mb-2 text-gray-400">
                        <ShieldAlert size={18} />
                        <span className="text-xs uppercase">Admin Privileges</span>
                    </div>
                    <div className="text-2xl font-bold text-white">Active</div>
                </div>
            </div>

            {/* Logs Window Simulation */}
            <div className="bg-black rounded-lg border border-gray-700 p-4 mb-8 h-64 overflow-y-auto">
                <div className="text-gray-500 mb-2 text-sm">System Logs</div>
                <div className="space-y-1 text-sm">
                    <p><span className="text-blue-400">[INFO]</span> Server started on port 5000</p>
                    <p><span className="text-blue-400">[INFO]</span> Database connection established</p>
                    <p><span className="text-yellow-400">[WARN]</span> High latency detected on /api/orders (simulated)</p>
                    <p><span className="text-blue-400">[INFO]</span> User session created for {stats ? 'Admin' : 'User'}</p>
                    <p><span className="text-green-400">[SUCCESS]</span> Payments module initialized</p>
                    <p className="animate-pulse">_</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-800 p-6 rounded border border-gray-700">
                    <h2 className="text-xl font-bold text-white mb-4">Quick Links</h2>
                    <ul className="space-y-2">
                        <li><Link href="/developer/users" className="hover:text-white hover:underline text-green-400 flex items-center gap-2">&gt; Manage Users (CRUD)</Link></li>
                        <li><Link href="/admin/dashboard" className="hover:text-white hover:underline">&gt; Access Admin Dashboard</Link></li>
                        <li><a href="/api-docs" className="hover:text-white hover:underline opacity-50 cursor-not-allowed">&gt; API Documentation (Coming Soon)</a></li>
                        <li><a href="/logs" className="hover:text-white hover:underline opacity-50 cursor-not-allowed">&gt; View System Logs</a></li>
                    </ul>
                </div>
                <div className="bg-gray-800 p-6 rounded border border-gray-700">
                    <h2 className="text-xl font-bold text-white mb-4">Environment Config</h2>
                    <pre className="text-xs bg-black p-4 rounded overflow-x-auto text-gray-300">
                        {`NODE_ENV=development
PORT=5000
DB_HOST=cluster0...
CLIENT_URL=http://localhost:3000
STRIPE_ENABLED=true`}
                    </pre>
                </div>
            </div>
        </div>
    );
}
