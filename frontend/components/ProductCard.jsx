'use client';

import Link from 'next/link';
import { Heart, ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import api from '@/services/api';

export default function ProductCard({ product }) {
    const { refreshCounts, addToCart } = useCart();

    if (!product) return null;

    return (
        <div className="group bg-white rounded-lg border border-gray-100 overflow-hidden hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 relative">
            {/* Wishlist Button - ALWAYS VISIBLE */}
            <button
                onClick={async (e) => {
                    e.stopPropagation(); // Prevent navigation
                    try {
                        await api.post('/api/users/wishlist', { productId: product._id });
                        refreshCounts(); // Update badge
                        alert('Added to wishlist!');
                    } catch (error) {
                        console.error('Failed to add to wishlist:', error);
                        alert('Failed to add to wishlist (Ensure you are logged in)');
                    }
                }}
                className="absolute top-3 right-3 z-10 bg-white p-2 rounded-full shadow-sm text-gray-400 hover:text-red-600 transition-colors"
                title="Add to Wishlist"
            >
                <Heart size={18} />
            </button>

            {/* Image Container */}
            <Link href={`/product/${product._id}`}>
                <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
                    <img
                        src={product.images?.[0] || 'https://via.placeholder.com/400x500?text=No+Image'}
                        alt={product.title}
                        className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                    />
                    {/* Badge (Optional - e.g. New or Sale) */}
                    {product.stock <= 5 && product.stock > 0 && (
                        <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-wider">
                            Low Stock
                        </span>
                    )}
                    {product.stock === 0 && (
                        <span className="absolute top-2 left-2 bg-gray-800 text-white text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-wider">
                            Sold Out
                        </span>
                    )}
                </div>
            </Link>

            {/* Content */}
            <div className="p-4">
                <Link href={`/product/${product._id}`}>
                    <h3 className="font-medium text-gray-900 line-clamp-2 hover:text-red-700 transition-colors h-12 mb-2" title={product.title}>
                        {product.title}
                    </h3>
                </Link>

                <div className="flex items-center justify-between mt-2">
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-500 uppercase tracking-wide">{product.category}</span>
                        <span className="text-lg font-bold text-red-700">₹{product.price.toLocaleString('en-IN')}</span>
                    </div>
                </div>

                {/* Add to Cart Button - ALWAYS VISIBLE */}
                <button
                    onClick={async (e) => {
                        e.stopPropagation(); // Prevent navigation
                        try {
                            await addToCart(product, 1);
                            // alert('Added to cart!');
                        } catch (error) {
                            console.error('Failed to add to cart:', error);
                            // const errMsg = error.response?.data?.message || error.message || 'Failed to add to cart';
                            // alert(`Error: ${errMsg}`);
                        }
                    }}
                    disabled={product.stock === 0}
                    className="w-full mt-4 bg-gray-900 text-white text-xs font-bold uppercase py-2.5 rounded hover:bg-red-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    <ShoppingCart size={16} />
                    {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
            </div>
        </div>
    );
}

