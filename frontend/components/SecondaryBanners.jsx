'use client';

import { useState, useEffect } from 'react';
import api from '@/services/api';
import Link from 'next/link';

export default function SecondaryBanners() {
    const [banner, setBanner] = useState(null);

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const { data } = await api.get('/api/banners');
                // Filter for Home Secondary position and Active status
                // We'll take the first one found, or map multiple if we want a grid.
                // Usually secondary banner is a single wide strip.
                const secondary = data.find(
                    b => b.position === 'home-secondary' && b.isActive
                );
                setBanner(secondary);
            } catch (err) {
                console.error("Failed to fetch secondary banner", err);
            }
        };

        fetchBanners();
    }, []);

    if (!banner) return null;

    return (
        <section className="py-12 bg-black container mx-auto px-4 max-w-7xl">
            <Link href={banner.link || '#'}>
                <div className="relative w-full h-[300px] md:h-[400px] rounded-2xl overflow-hidden group cursor-pointer shadow-2xl border border-white/10">
                    <img
                        src={banner.image}
                        alt={banner.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-8 md:p-12">
                        <div className="max-w-xl">
                            <span className="text-secondary font-bold tracking-widest uppercase text-sm mb-2 block animate-fade-in-up">
                                Limited Edition
                            </span>
                            <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-4 animate-fade-in-up delay-100">
                                {banner.title}
                            </h2>
                            <button className="text-white border-b border-secondary pb-1 hover:text-secondary hover:border-white transition-colors animate-fade-in-up delay-200">
                                Explore Collection
                            </button>
                        </div>
                    </div>
                </div>
            </Link>
        </section>
    );
}
