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

    const displayTitle = slug.charAt(0).toUpperCase() + slug.slice(1);
    const isRudraksha = slug.toLowerCase() === 'rudraksha' || slug.toLowerCase().includes('rudraksha');

    return (
        <main className="min-h-screen bg-white">
            {isRudraksha ? (
                <div className="w-full h-[300px] md:h-[400px] relative mb-10 overflow-hidden">
                    <img
                        src="/banners/rudraksha-banner-v2.png"
                        alt="Rudraksha Collection"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <h1 className="text-4xl md:text-5xl font-bold text-white uppercase tracking-widest drop-shadow-lg">{displayTitle}</h1>
                    </div>
                </div>
            ) : (
                <div className="bg-red-600 text-white py-12 mb-10">
                    <div className="container mx-auto px-4 text-center">
                        <h1 className="text-4xl font-bold uppercase tracking-widest">{displayTitle}</h1>
                        <p className="mt-2 text-red-100">Divine Collection</p>
                    </div>
                </div>
            )}

            <div className="container mx-auto px-4 pb-20">
                {loading ? (
                    <div className="text-center py-20 text-gray-500">Loading collection...</div>
                ) : (
                    <>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
                            {products.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                        {products.length === 0 && (
                            <div className="text-center py-20">
                                <p className="text-xl text-gray-500 mb-4">No products found in this category.</p>
                                <a href="/" className="text-red-600 font-bold hover:underline">View All Products</a>
                            </div>
                        )}
                    </>
                )}
            </div>
        </main>
    );
}
