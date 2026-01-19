'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function DeveloperLayout({ children }) {
    const pathname = usePathname();
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);
    const isLoginPage = pathname === '/developer';

    useEffect(() => {
        if (isLoginPage) {
            setAuthorized(true);
            return;
        }

        const checkAuth = () => {
            const userInfo = localStorage.getItem('userInfo');

            if (!userInfo) {
                router.push('/developer');
                return;
            }

            try {
                const user = JSON.parse(userInfo);
                if (user.role !== 'developer') {
                    router.push('/developer');
                } else {
                    setAuthorized(true);
                }
            } catch (error) {
                localStorage.removeItem('userInfo');
                router.push('/developer');
            }
        };

        checkAuth();
    }, [pathname, isLoginPage, router]);

    if (!authorized) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-green-500 font-mono">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm tracking-widest uppercase">AUTHENTICATING...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white">
            {children}
        </div>
    );
}
