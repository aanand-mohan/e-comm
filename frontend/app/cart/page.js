'use client';

import { useState, useEffect } from 'react';
import api from '@/services/api';
import Link from 'next/link';
import { Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';

export default function CartPage() {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);

    const fetchCart = async () => {
        try {
            const userInfo = localStorage.getItem('userInfo');

            if (!userInfo) {
                // GUEST MODE: Fetch from LocalStorage
                const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
                const validCart = guestCart.filter(item => item && item.product);
                setCartItems(validCart);

                const calcTotal = validCart.reduce((acc, item) => {
                    const price = item.product?.price || 0;
                    return acc + (price * item.quantity);
                }, 0);
                setTotal(calcTotal);
                setLoading(false);
                return;
            }

            // USER MODE: Fetch from API
            const { data } = await api.get('/api/cart');
            // Backend returns the cart array directly
            const items = Array.isArray(data) ? data : (data.items || []);
            setCartItems(items);
            // Calculate total safely
            const calcTotal = items.reduce((acc, item) => {
                const price = item.product?.price || 0;
                return acc + (price * item.quantity);
            }, 0);
            setTotal(calcTotal);
        } catch (error) {
            console.error('Failed to fetch cart:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const updateQuantity = async (itemId, newQty) => {
        if (newQty < 1) return;

        const userInfo = localStorage.getItem('userInfo');
        if (!userInfo) {
            // GUEST MODE
            const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
            const itemIndex = guestCart.findIndex(item => item.product._id === itemId);
            if (itemIndex > -1) {
                guestCart[itemIndex].quantity = newQty;
                localStorage.setItem('guestCart', JSON.stringify(guestCart));
                fetchCart(); // Refresh view
                // Trigger context update if possible, or force reload/event
                window.dispatchEvent(new Event('storage'));
            }
            return;
        }

        // USER MODE
        try {
            await api.put(`/api/cart/${itemId}`, { quantity: newQty }); // Adjust endpoint if needed
            fetchCart();
        } catch (error) {
            console.error('Failed to update quantity:', error);
        }
    };

    const removeItem = async (itemId) => {
        if (!window.confirm('Remove this item?')) return;

        const userInfo = localStorage.getItem('userInfo');
        if (!userInfo) {
            // GUEST MODE
            const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
            const newCart = guestCart.filter(item => item.product._id !== itemId);
            localStorage.setItem('guestCart', JSON.stringify(newCart));
            fetchCart();
            window.dispatchEvent(new Event('storage'));
            return;
        }

        // USER MODE
        try {
            await api.delete(`/api/cart/${itemId}`);
            fetchCart();
        } catch (error) {
            console.error('Failed to remove item:', error);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading cart...</div>;

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
                <ShoppingBag size={64} className="text-gray-300 mb-6" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
                <p className="text-gray-500 mb-8">Looks like you haven't added anything yet.</p>
                <Link href="/" className="bg-red-600 text-white px-8 py-3 rounded-full font-bold hover:bg-red-700 transition">
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                    <ShoppingBag className="text-red-600" size={32} /> Shopping Cart
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items List */}
                    <div className="lg:col-span-2 space-y-6">
                        {cartItems.map((item) => (
                            <div key={item._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col sm:flex-row gap-6 transition-transform hover:shadow-md">
                                {/* Product Image */}
                                <div className="w-full sm:w-32 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative group">
                                    <img
                                        src={item.product?.images?.[0] || 'https://via.placeholder.com/150'}
                                        alt={item.product?.title}
                                        className="w-full h-full object-cover Group-hover:scale-110 transition-transform duration-500"
                                    />
                                </div>

                                {/* Product Details */}
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-bold text-lg text-gray-900 line-clamp-2 hover:text-red-600 transition-colors">
                                                <Link href={`/product/${item.product?._id}`}>
                                                    {item.product?.title}
                                                </Link>
                                            </h3>
                                            <p className="font-bold text-lg text-red-600">
                                                ₹{(item.product?.price * item.quantity).toLocaleString('en-IN')}
                                            </p>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1 uppercase tracking-wide font-medium">
                                            {item.product?.category}
                                        </p>
                                        <p className="text-sm text-gray-400 mt-0.5">
                                            Unit Price: ₹{item.product?.price?.toLocaleString('en-IN')}
                                        </p>
                                    </div>

                                    {/* Validations / Controls */}
                                    <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
                                        <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1 border border-gray-200">
                                            <button
                                                onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                                                disabled={item.quantity <= 1}
                                                className="w-8 h-8 flex items-center justify-center bg-white rounded shadow-sm text-gray-600 hover:text-red-600 disabled:opacity-50 transition-colors"
                                            >
                                                -
                                            </button>
                                            <span className="w-8 text-center font-bold text-gray-900">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                                                className="w-8 h-8 flex items-center justify-center bg-white rounded shadow-sm text-gray-600 hover:text-green-600 transition-colors"
                                            >
                                                +
                                            </button>
                                        </div>

                                        <button
                                            onClick={() => removeItem(item.product?._id)}
                                            className="text-gray-400 hover:text-red-500 text-sm font-medium flex items-center gap-1 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50"
                                        >
                                            <Trash2 size={16} /> Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary - Sticky */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 sticky top-24">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 border-b pb-4">Order Summary</h2>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal ({cartItems.length} items)</span>
                                    <span className="font-medium">₹{total.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>GST (18%)</span>
                                    <span className="font-medium">₹{(total * 0.18).toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    <span className="text-green-600 font-bold uppercase text-sm bg-green-50 px-2 py-1 rounded">Free</span>
                                </div>
                            </div>

                            <div className="border-t border-dashed border-gray-200 pt-4 mb-8">
                                <div className="flex justify-between items-end">
                                    <span className="text-lg font-bold text-gray-900">Total Amount</span>
                                    <div className="text-right">
                                        <span className="block text-2xl font-bold text-red-600">
                                            ₹{(total + (total * 0.18)).toLocaleString('en-IN')}
                                        </span>
                                        <span className="text-xs text-gray-400 font-normal">Including all taxes</span>
                                    </div>
                                </div>
                            </div>

                            <Link href="/checkout" className="block w-full">
                                <button className="w-full bg-red-600 text-white py-4 rounded-xl font-bold hover:bg-red-700 transition shadow-lg shadow-red-200 flex items-center justify-center gap-2 group">
                                    Proceed to Checkout
                                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                                </button>
                            </Link>

                            <div className="mt-8 grid grid-cols-4 gap-2 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" alt="Visa" className="h-8 object-contain mx-auto" />
                                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-8 object-contain mx-auto" />
                                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-8 object-contain mx-auto" />
                                <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_%282018%29.svg" alt="Amex" className="h-8 object-contain mx-auto" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
