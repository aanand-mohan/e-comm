'use client';

import { useState, useEffect } from 'react';
import api from '@/services/api';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { CreditCard, Truck, ShieldCheck, MapPin, Phone, User, Globe } from 'lucide-react';

export default function CheckoutPage() {
    const { cartCount, refreshCounts } = useCart(); // We can fetch items directly from API to ensure fresh data
    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const router = useRouter();

    // Form State matches Backend Order Schema
    const [formData, setFormData] = useState({
        fullName: '',
        address: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'India',
        phone: '',
        paymentMethod: 'COD' // Default
    });

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const { data } = await api.get('/api/cart');
                const items = Array.isArray(data) ? data : (data.items || []);
                setCartItems(items);
                const calcTotal = items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
                setTotal(calcTotal);
            } catch (error) {
                console.error('Failed to fetch cart:', error);
                router.push('/cart'); // Redirect if cart fails
            } finally {
                setLoading(false);
            }
        };

        fetchCart();
    }, [router]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            // Transform form data to match backend expected structure
            // Backend expects: shippingAddress object and paymentMethod string
            const payload = {
                shippingAddress: {
                    fullName: formData.fullName,
                    address: formData.address,
                    city: formData.city,
                    state: formData.state,
                    postalCode: formData.postalCode,
                    country: formData.country,
                    phone: formData.phone
                },
                paymentMethod: formData.paymentMethod
            };

            // 1. Create Order
            const { data: orderData } = await api.post('/api/checkout', payload);

            // 2. Clear Cart (Common for both)
            refreshCounts();

            // 3. Handle Payment Flow
            if (formData.paymentMethod === 'Card') {
                // Call Payment API to get Session URL
                try {
                    const { data: sessionData } = await api.post('/api/payment/create-checkout-session', {
                        orderId: orderData._id,
                        cartItems: cartItems // Pass cart items for Stripe Line Items
                    });

                    if (sessionData.url) {
                        window.location.href = sessionData.url; // Redirect to Stripe
                    } else {
                        throw new Error('Failed to retrieve payment URL');
                    }
                } catch (paymentError) {
                    console.error('Payment Session Creation Failed:', paymentError);
                    alert('Order created but payment failed. Redirecting to order details...');
                    router.push(`/order-success/${orderData._id}`);
                }
            } else {
                // COD Flow
                router.push(`/order-success/${orderData._id}`);
            }

        } catch (error) {
            console.error('Checkout failed:', error);
            alert(error.response?.data?.message || 'Checkout failed. Please try again.');
        } finally {
            // Keep submitting true if redirecting to avoid double clicks
            if (formData.paymentMethod !== 'Card') {
                setSubmitting(false);
            }
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading checkout...</div>;

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <h2 className="text-xl font-bold mb-4">Your cart is empty</h2>
                <button onClick={() => router.push('/')} className="text-blue-600 hover:underline">Return to Home</button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
                    <p className="mt-2 text-gray-600">Complete your order</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

                    {/* LEFT COLUMN: Shipping Form */}
                    <div className="bg-white p-8 rounded-xl shadow-sm">
                        <div className="flex items-center gap-3 mb-6 border-b pb-4">
                            <Truck className="text-red-600" />
                            <h2 className="text-xl font-bold text-gray-900">Shipping Details</h2>
                        </div>

                        <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User size={18} className="text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        name="fullName"
                                        required
                                        className="pl-10 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm py-2.5 bg-gray-50 border"
                                        placeholder="John Doe"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Phone size={18} className="text-gray-400" />
                                    </div>
                                    <input
                                        type="tel"
                                        name="phone"
                                        required
                                        className="pl-10 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm py-2.5 bg-gray-50 border"
                                        placeholder="+91 98765 43210"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 pt-3 pointer-events-none">
                                        <MapPin size={18} className="text-gray-400" />
                                    </div>
                                    <textarea
                                        name="address"
                                        required
                                        rows="3"
                                        className="pl-10 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm py-2.5 bg-gray-50 border"
                                        placeholder="Street Address, Apartment, etc."
                                        value={formData.address}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                    <input
                                        type="text"
                                        name="city"
                                        required
                                        className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm py-2.5 bg-gray-50 border px-3"
                                        placeholder="Mumbai"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                                    <input
                                        type="text"
                                        name="state"
                                        required
                                        className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm py-2.5 bg-gray-50 border px-3"
                                        placeholder="Maharashtra"
                                        value={formData.state}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">PIN Code</label>
                                    <input
                                        type="text"
                                        name="postalCode"
                                        required
                                        className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm py-2.5 bg-gray-50 border px-3"
                                        placeholder="400001"
                                        value={formData.postalCode}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Globe size={18} className="text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            name="country"
                                            required
                                            className="pl-10 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm py-2.5 bg-gray-50 border px-3"
                                            value={formData.country}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* RIGHT COLUMN: Order Summary */}
                    <div className="space-y-8">
                        {/* Order Items */}
                        <div className="bg-white p-8 rounded-xl shadow-sm">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 border-b pb-4">Order Summary</h2>
                            <div className="flow-root">
                                <ul className="-my-6 divide-y divide-gray-100">
                                    {cartItems.map((item) => (
                                        <li key={item._id} className="py-6 flex">
                                            <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                                <img
                                                    src={item.product?.images?.[0]}
                                                    alt={item.product?.title}
                                                    className="h-full w-full object-cover object-center"
                                                />
                                            </div>
                                            <div className="ml-4 flex flex-1 flex-col">
                                                <div>
                                                    <div className="flex justify-between text-base font-medium text-gray-900">
                                                        <h3 className="line-clamp-1">{item.product?.title}</h3>
                                                        <p className="ml-4">₹{(item.product?.price * item.quantity).toLocaleString('en-IN')}</p>
                                                    </div>
                                                    <p className="mt-1 text-sm text-gray-500">{item.product?.category}</p>
                                                </div>
                                                <div className="flex flex-1 items-end justify-between text-sm">
                                                    <p className="text-gray-500">Qty {item.quantity}</p>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Payment Method & Total */}
                        <div className="bg-white p-8 rounded-xl shadow-sm">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 border-b pb-4">Payment</h2>

                            {/* Payment Options (Simplified for now) */}
                            {/* Payment Options */}
                            <div className="space-y-4 mb-8">
                                <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition ${formData.paymentMethod === 'COD' ? 'border-red-200 bg-red-50' : 'hover:bg-gray-50'}`}>
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="COD"
                                        checked={formData.paymentMethod === 'COD'}
                                        onChange={handleInputChange}
                                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                                    />
                                    <span className="ml-3 flex items-center gap-2 font-medium text-gray-900">
                                        <Truck size={18} /> Cash on Delivery (COD)
                                    </span>
                                </label>

                                <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition ${formData.paymentMethod === 'Card' ? 'border-green-200 bg-green-50' : 'hover:bg-gray-50'}`}>
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="Card"
                                        checked={formData.paymentMethod === 'Card'}
                                        onChange={handleInputChange}
                                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                                    />
                                    <span className="ml-3 flex items-center gap-2 font-medium text-gray-900">
                                        <CreditCard size={18} /> Online Payment (Stripe)
                                    </span>
                                </label>
                            </div>

                            {/* Total Calculation */}
                            <div className="space-y-2 pt-4 border-t border-gray-200">
                                <div className="flex justify-between text-gray-600">
                                    <p>Subtotal</p>
                                    <p>₹{total.toLocaleString('en-IN')}</p>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <p>Shipping</p>
                                    <p className="text-green-600 font-medium">Free</p>
                                </div>
                                <div className="flex justify-between items-center text-xl font-bold text-gray-900 pt-4">
                                    <p>Order Total</p>
                                    <p className="text-red-600">₹{total.toLocaleString('en-IN')}</p>
                                </div>
                            </div>

                            <button
                                type="submit"
                                form="checkout-form"
                                disabled={submitting}
                                className={`w-full mt-8 text-white py-4 rounded-lg font-bold text-lg transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed ${formData.paymentMethod === 'Card'
                                    ? 'bg-green-600 hover:bg-green-700 shadow-green-100'
                                    : 'bg-red-600 hover:bg-red-700 shadow-red-100'
                                    }`}
                            >
                                {submitting ? (
                                    'Processing...'
                                ) : (
                                    <>
                                        {formData.paymentMethod === 'Card' ? <CreditCard size={20} /> : <ShieldCheck size={20} />}
                                        {formData.paymentMethod === 'Card' ? 'Pay Now' : 'Place Order'}
                                    </>
                                )}
                            </button>

                            <p className="text-center text-xs text-gray-500 mt-4 flex items-center justify-center gap-1">
                                <ShieldCheck size={14} /> Secure Checkout
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
