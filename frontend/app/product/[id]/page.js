'use client';

import { useState, useEffect, use } from 'react';
import api from '@/services/api';
import { ShoppingCart, Heart, Truck, ShieldCheck, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ProductDetailsPage({ params }) {
    const { id } = use(params);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [mainImage, setMainImage] = useState('');

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await api.get(`/api/products/${id}`);
                setProduct(data);
                if (data.images && data.images.length > 0) {
                    setMainImage(data.images[0]);
                }
            } catch (error) {
                console.error('Failed to fetch product:', error);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchProduct();
    }, [id]);

    const addToCart = async () => {
        try {
            await api.post('/api/cart', { productId: product._id, quantity: 1 });
            // alert('Added to cart!');
            // Optional: Redirect to cart or update cart count context
        } catch (error) {
            console.error('Failed to add to cart:', error);
            // alert('Failed to add to cart. Please try again.');
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (!product) return <div className="min-h-screen flex items-center justify-center">Product not found</div>;

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                    {/* Left: Image Gallery */}
                    <div className="p-6 lg:p-10 bg-gray-100 flex flex-col gap-4">
                        <Link href="/" className="text-gray-500 hover:text-gray-800 flex items-center gap-2 mb-4 md:hidden">
                            <ArrowLeft size={16} /> Back
                        </Link>

                        <div className="aspect-[4/5] w-full bg-white rounded-lg overflow-hidden shadow-sm relative group">
                            <img
                                src={mainImage || 'https://via.placeholder.com/600x800'}
                                alt={product.title}
                                className="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                        <div className="flex gap-4 overflow-x-auto pb-2">
                            {product.images?.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setMainImage(img)}
                                    className={`w-20 h-20 flex-shrink-0 rounded-md overflow-hidden border-2 ${mainImage === img ? 'border-red-600' : 'border-transparent hover:border-gray-300'}`}
                                >
                                    <img src={img} alt={`View ${idx}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right: Product Info */}
                    <div className="p-6 lg:p-10 flex flex-col">
                        <Link href="/" className="text-gray-500 hover:text-gray-800 hidden md:flex items-center gap-2 mb-6">
                            <ArrowLeft size={16} /> Back to Shopping
                        </Link>

                        <span className="text-red-600 font-bold uppercase tracking-wider text-sm mb-2">{product.category}</span>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{product.title}</h1>

                        <div className="flex items-center gap-4 mb-6">
                            <span className="text-3xl font-bold text-red-700">₹{product.price.toLocaleString('en-IN')}</span>
                            {product.stock > 0 ? (
                                <span className="text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm font-medium">In Stock</span>
                            ) : (
                                <span className="text-red-600 bg-red-50 px-3 py-1 rounded-full text-sm font-medium">Out of Stock</span>
                            )}
                        </div>

                        <p className="text-gray-600 leading-relaxed mb-8 border-b border-gray-100 pb-8">
                            {product.description}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 mb-8">
                            <button
                                onClick={addToCart}
                                disabled={product.stock === 0}
                                className="flex-1 bg-red-600 text-white font-bold py-4 px-8 rounded-lg hover:bg-red-700 transition flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed shadow-lg shadow-red-100"
                            >
                                <ShoppingCart size={20} />
                                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                            </button>
                            <button className="bg-gray-100 text-gray-800 font-bold py-4 px-6 rounded-lg hover:bg-gray-200 transition flex items-center justify-center gap-2">
                                <Heart size={20} />
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-50 text-blue-600 rounded-full">
                                    <Truck size={18} />
                                </div>
                                <span>Free Delivery</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-50 text-green-600 rounded-full">
                                    <ShieldCheck size={18} />
                                </div>
                                <span>Authentic & Certified</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
