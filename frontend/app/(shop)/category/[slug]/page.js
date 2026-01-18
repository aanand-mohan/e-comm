'use client';

import { useState, useEffect, use } from 'react';
import api from '@/services/api';
import ProductCard from '@/components/ProductCard';
import { useSearchParams } from 'next/navigation';

export default function CategoryPage({ params }) {
    const { slug } = use(params);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                // Fetch all products and filter client-side for now implies we might not have a category filter endpoint yet.
                // Or better, assume query param support if backend has it. 
                // Let's try fetching all and filtering in JS to be safe given current context, 
                // OR checking if backend supports filtering.
                // Previous context said: getOrders has filtering, but getProducts (in productController) usually does too.
                // Let's try fetching with query first, if that returns all, we filter.

                const { data } = await api.get('/api/products');

                // Flexible matching: check if product category includes the slug or is equal (case insensitive)
                const filtered = data.filter(p =>
                    p.category.toLowerCase().includes(slug.toLowerCase()) ||
                    slug.toLowerCase().includes(p.category.toLowerCase())
                );

                setProducts(filtered);
            } catch (error) {
                console.error('Failed to fetch products:', error);
            } finally {
                setLoading(false);
            }
        };

        if (slug) fetchProducts();
    }, [slug]);

    // State for Banners
    const [banners, setBanners] = useState([]);
    const [bannerLoading, setBannerLoading] = useState(true);

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                // Fetch public banners (assuming GET /api/banners returns active banners)
                // If not, we might need to filter from a general endpoint or hitting a specific one.
                // admin page uses /api/banners/admin. content usually /api/banners.
                // We'll try fetching all and filtering by link matching the slug.
                const { data } = await api.get('/api/banners');

                // Filter banners that are linked to this category
                // Logic: Banner link includes the slug (e.g., '/category/rudraksha')
                const categoryBanners = data.filter(b =>
                    b.isActive &&
                    (b.link?.toLowerCase().includes(slug.toLowerCase()) || b.position === 'category-top')
                );

                // If no specific banners found, maybe fallback to some generic ones or keep empty?
                // User said "use banner that i set at each route", implying specific ones.
                // We'll sort by displayOrder
                setBanners(categoryBanners.sort((a, b) => a.displayOrder - b.displayOrder));
            } catch (err) {
                console.error("Failed to fetch banners", err);
            } finally {
                setBannerLoading(false);
            }
        };

        if (slug) fetchBanners();
    }, [slug]);

    return (
        <main className="min-h-screen bg-black text-white">
            {/* Dynamic Split Banner Header */}
            <div className="relative w-full min-h-[50vh] flex flex-col md:flex-row mb-12 border-b border-white/10">

                {/* Left Side: Black & Empty with Text */}
                <div className="w-full md:w-1/2 bg-black flex flex-col justify-center p-8 md:p-16 relative z-10">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>

                    <span className="text-primary font-bold tracking-[0.2em] uppercase mb-4 text-sm animate-fade-in-up">Sacred Collection</span>
                    <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 leading-tight animate-fade-in-up delay-100">
                        {slug.charAt(0).toUpperCase() + slug.slice(1)}
                    </h1>
                    <p className="text-gray-400 text-lg max-w-md font-light leading-relaxed animate-fade-in-up delay-200">
                        Discover the divine energy of our authentic {slug} collection. curated for your spiritual journey.
                    </p>

                    <div className="mt-8 flex gap-2 animate-fade-in-up delay-300">
                        <div className="h-1 w-12 bg-primary rounded-full"></div>
                        <div className="h-1 w-4 bg-white/20 rounded-full"></div>
                        <div className="h-1 w-4 bg-white/20 rounded-full"></div>
                    </div>
                </div>

                {/* Right Side: Animated Grid of Banners */}
                <div className="w-full md:w-1/2 bg-neutral-900 relative overflow-hidden flex items-center justify-center p-4">
                    {/* Background Abstract Effect */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-50"></div>

                    {bannerLoading ? (
                        <div className="grid grid-cols-2 gap-4 w-full h-full max-w-2xl">
                            <div className="bg-neutral-800 animate-pulse rounded-2xl h-64"></div>
                            <div className="bg-neutral-800 animate-pulse rounded-2xl h-64 mt-8"></div>
                            <div className="bg-neutral-800 animate-pulse rounded-2xl h-64 -mt-8"></div>
                            <div className="bg-neutral-800 animate-pulse rounded-2xl h-64"></div>
                        </div>
                    ) : banners.length > 0 ? (
                        <div className="grid grid-cols-2 gap-4 w-full max-w-2xl transform rotate-1 hover:rotate-0 transition-transform duration-1000">
                            {banners.map((banner, index) => (
                                <div
                                    key={banner._id}
                                    className={`relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 group ${index % 2 === 0 ? 'mt-8' : '-mt-8'} hover:z-10 transition-all duration-500 hover:scale-105`}
                                    style={{ height: '300px' }}
                                >
                                    <img
                                        src={banner.image}
                                        alt={banner.title}
                                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                        <p className="text-white text-xs font-bold uppercase tracking-widest">{banner.title}</p>
                                    </div>
                                </div>
                            ))}
                            {/* Fill grid if only 1 banner */}
                            {banners.length === 1 && (
                                <div className="bg-neutral-900/50 rounded-2xl border border-white/5 flex items-center justify-center -mt-8">
                                    <span className="text-4xl">🕉️</span>
                                </div>
                            )}
                        </div>
                    ) : (
                        // Fallback abstract visuals if no banners set
                        <div className="grid grid-cols-2 gap-4 w-full max-w-2xl opacity-50 grayscale hover:grayscale-0 transition-all duration-1000">
                            <div className="bg-neutral-800 rounded-2xl h-64 mt-8 bg-[url('/placeholder-sacred-1.jpg')] bg-cover"></div>
                            <div className="bg-neutral-800 rounded-2xl h-64 -mt-8 bg-[url('/placeholder-sacred-2.jpg')] bg-cover"></div>
                        </div>
                    )}
                </div>
            </div>

            <div className="container mx-auto px-4 pb-24 max-w-7xl">
                {/* Mobile Filter & Sort Bar (Visible on Mobile Only) */}
                <div className="md:hidden flex gap-4 mb-6 sticky top-16 z-30 bg-black/80 backdrop-blur-md py-2 border-b border-white/10">
                    <button className="flex-1 bg-neutral-900 border border-white/10 py-3 rounded-lg font-semibold text-gray-300 flex items-center justify-center gap-2 shadow-sm hover:text-white transition-colors">
                        <span>Filters</span>
                    </button>
                    <button className="flex-1 bg-neutral-900 border border-white/10 py-3 rounded-lg font-semibold text-gray-300 flex items-center justify-center gap-2 shadow-sm hover:text-white transition-colors">
                        <span>Sort By</span>
                    </button>
                </div>

                <div className="flex flex-col md:flex-row gap-10">
                    {/* SIDEBAR FILTERS (Desktop Only) */}
                    <aside className="hidden md:block w-64 flex-shrink-0 space-y-8 sticky top-24 h-fit">
                        {/* Categories Filter */}
                        <div className="bg-neutral-900/50 backdrop-blur-sm p-6 rounded-2xl border border-white/5 shadow-lg">
                            <h3 className="font-serif font-bold text-lg mb-4 text-white border-b border-white/10 pb-2">Categories</h3>
                            <ul className="space-y-3 text-sm text-gray-400">
                                {['Rudraksha', 'Gemstones', 'Yantras', 'Malas', 'Spiritual Idols', 'Parads', 'Sphatiks'].map((cat) => (
                                    <li key={cat}>
                                        <label className="flex items-center gap-3 cursor-pointer hover:text-primary transition-colors group">
                                            <input type="checkbox" className="rounded border-gray-600 bg-black text-primary  focus:ring-primary focus:ring-offset-black" />
                                            <span className="group-hover:translate-x-1 transition-transform">{cat}</span>
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Price Filter */}
                        <div className="bg-neutral-900/50 backdrop-blur-sm p-6 rounded-2xl border border-white/5 shadow-lg">
                            <h3 className="font-serif font-bold text-lg mb-4 text-white border-b border-white/10 pb-2">Price Range</h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <input type="number" placeholder="Min" className="w-full bg-black border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
                                    <span className="text-gray-500">-</span>
                                    <input type="number" placeholder="Max" className="w-full bg-black border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
                                </div>
                                <button className="w-full bg-white text-black py-2 rounded text-sm font-bold hover:bg-primary hover:text-white transition-colors shadow-lg">Apply</button>
                            </div>
                        </div>
                    </aside>

                    {/* PRODUCT GRID */}
                    <div className="flex-1">
                        {/* Sort Options (Desktop) */}
                        <div className="hidden md:flex justify-between items-center mb-8">
                            <p className="text-gray-400 text-sm">Showing <span className="font-bold text-primary">{products.length}</span> results</p>
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-gray-400">Sort By:</span>
                                <select className="bg-neutral-900 border border-white/10 text-gray-300 text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5 outline-none hover:border-white/30 transition-colors cursor-pointer">
                                    <option>Featured</option>
                                    <option>Price: Low to High</option>
                                    <option>Price: High to Low</option>
                                    <option>Newest Arrivals</option>
                                </select>
                            </div>
                        </div>

                        {loading ? (
                            <div className="flex justify-center items-center py-32">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {products.map((product) => (
                                        <div key={product._id} className="h-full">
                                            <ProductCard product={product} />
                                        </div>
                                    ))}
                                </div>
                                {products.length === 0 && (
                                    <div className="text-center py-32 bg-neutral-900/50 backdrop-blur-sm rounded-2xl border border-white/5 shadow-lg">
                                        <div className="text-6xl mb-4">🧘</div>
                                        <p className="text-xl text-gray-400 mb-6 font-light">No divine treasures found in this category.</p>
                                        <a href="/" className="inline-block px-8 py-3 bg-primary text-black font-bold rounded-full hover:bg-white transition-colors shadow-[0_0_15px_rgba(212,175,55,0.3)]">Return Home</a>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
