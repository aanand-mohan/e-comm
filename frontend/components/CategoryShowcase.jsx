'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import api from '@/services/api';

export default function CategoryShowcase() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await api.get('/api/categories');
                setCategories(data);
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    // Helper to determine column span for visual variety
    // Pattern: 2-col, 1-col, 1-col... or just purely responsive grid
    const getColSpan = (index) => {
        // First item spans 2 cols if we have enough items to make it look good
        if (index === 0 && categories.length >= 3) return 'md:col-span-2';
        return 'md:col-span-1';
    };

    if (loading) return null; // Or a skeleton loader if preferred

    if (categories.length === 0) return null;

    return (
        <section className="py-32 bg-black relative">
            {/* Background ambient glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="container mx-auto px-4 max-w-7xl relative z-10">
                <div className="flex flex-col items-center mb-20 text-center">
                    <span className="text-primary/60 font-bold tracking-[0.3em] uppercase text-xs md:text-sm mb-4 block">
                        Sacred Collections
                    </span>
                    <h2 className="text-4xl md:text-6xl font-serif font-medium text-white mb-6">
                        Shop by <span className="text-primary italic">Category</span>
                    </h2>
                    <div className="h-px w-24 bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {categories.map((cat, idx) => (
                        <motion.div
                            key={cat._id}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1, duration: 0.8, ease: "easeOut" }}
                            viewport={{ once: true, margin: "-50px" }}
                            className={`group relative h-96 rounded-3xl overflow-hidden cursor-pointer ${getColSpan(idx)} border border-white/5 hover:border-primary/30 transition-colors duration-500`}
                        >
                            <Link href={`/category/${cat.slug}`} className="block w-full h-full relative">
                                {/* Image using Next.js Image */}
                                <Image
                                    src={cat.image || 'https://images.unsplash.com/photo-1620021665471-ca0afcb10243?w=800&auto=format&fit=crop&q=60'} // Fallback
                                    alt={cat.name}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-500" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />

                                {/* Content */}
                                <div className="absolute bottom-0 left-0 p-10 w-full transition-transform duration-500 group-hover:-translate-y-2">
                                    {cat.description && (
                                        <p className="text-primary text-sm font-medium tracking-wider uppercase mb-2 opacity-0 transform translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0 line-clamp-1">
                                            {cat.description}
                                        </p>
                                    )}
                                    <h3 className="text-white text-4xl font-serif font-bold group-hover:text-primary transition-colors duration-300">
                                        {cat.name}
                                    </h3>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
