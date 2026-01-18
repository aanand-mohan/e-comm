'use client';

import Link from 'next/link';
import { Heart, ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import api from '@/services/api';

export default function ProductCard({ product }) {
    const { refreshCounts, addToCart } = useCart();

    if (!product) return null;

    return (
        <div className="group bg-neutral-900/50 backdrop-blur-sm rounded-xl overflow-hidden hover:shadow-[0_0_20px_rgba(212,175,55,0.15)] transition-all duration-500 relative flex flex-col h-full border border-white/5 hover:border-primary/30 hover:-translate-y-1">

            {/* Wishlist Button */}
            <button
                onClick={async (e) => {
                    e.stopPropagation();
                    try {
                        await api.post('/api/users/wishlist', { productId: product._id });
                        refreshCounts();
                        // Consider toast notification instead of alert
                    } catch (error) {
                        console.error('Wishlist error', error);
                    }
                }}
                className="absolute top-4 right-4 z-20 bg-black/40 backdrop-blur-md p-2.5 rounded-full shadow-sm text-gray-400 hover:text-primary hover:bg-black/60 transition-all transform hover:scale-110 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 duration-300 border border-white/10"
                title="Add to Wishlist"
            >
                <Heart size={18} />
            </button>

            {/* Image Container - Aspect 4:5 */}
            <Link href={`/product/${product._id}`} className="block relative aspect-[4/5] overflow-hidden bg-neutral-900">
                <img
                    src={product.images?.[0] || 'https://via.placeholder.com/400x500?text=No+Image'}
                    alt={product.title}
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700 ease-in-out"
                />

                {/* Status Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {product.stock <= 5 && product.stock > 0 && (
                        <span className="bg-orange-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm border border-orange-400/20">
                            Low Stock
                        </span>
                    )}
                    {product.stock === 0 && (
                        <span className="bg-red-900/90 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm border border-red-500/20">
                            Sold Out
                        </span>
                    )}
                </div>
            </Link>

            {/* Content */}
            <div className="p-5 flex flex-col flex-grow relative bg-neutral-900/50">
                <div className="mb-2">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{product.category}</span>
                </div>

                <Link href={`/product/${product._id}`} className="block flex-grow">
                    <h3 className="font-serif font-medium text-white text-lg leading-snug line-clamp-2 hover:text-primary transition-colors mb-2">
                        {product.title}
                    </h3>
                </Link>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                    <span className="text-xl font-bold text-primary">₹{product.price.toLocaleString('en-IN')}</span>

                    {/* Minimal Add Button */}
                    <button
                        onClick={async (e) => {
                            e.stopPropagation();
                            try {
                                await addToCart(product, 1);
                            } catch (error) {
                                console.error('Cart error', error);
                            }
                        }}
                        disabled={product.stock === 0}
                        className="bg-white/5 text-gray-300 p-2.5 rounded-full hover:bg-primary hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed group/btn border border-white/10"
                        title="Add to Cart"
                    >
                        <ShoppingCart size={20} className="group-hover/btn:scale-110 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    );
}

