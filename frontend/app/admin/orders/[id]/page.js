'use client';

import { useEffect, useState, use } from 'react';
import api from '@/services/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Truck, CreditCard, Trash2 } from 'lucide-react';

export default function OrderDetailsPage({ params }) {
    const { id } = use(params);
    const router = useRouter();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchOrder = async () => {
        try {
            const { data } = await api.get(`/api/admin/orders/${id}`);
            setOrder(data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch order');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) fetchOrder();
    }, [id]);

    const handleDeliverHandler = async () => {
        try {
            await api.put(`/api/admin/orders/${order._id}/status`, {
                orderStatus: 'Delivered',
            });
            fetchOrder();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update status');
        }
    };

    const handlePaymentHandler = async () => {
        try {
            await api.put(`/api/admin/orders/${order._id}/payment`, {
                paymentStatus: 'Paid',
            });
            fetchOrder();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update payment');
        }
    };

    const handleStatusChange = async (e) => {
        const newStatus = e.target.value;
        try {
            await api.put(`/api/admin/orders/${order._id}/status`, {
                orderStatus: newStatus,
            });
            fetchOrder();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update status');
        }
    }

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete/cancel this order?')) {
            try {
                await api.delete(`/api/admin/orders/${order._id}`);
                router.push('/admin/orders');
            } catch (err) {
                alert(err.response?.data?.message || 'Failed to delete order');
            }
        }
    };

    if (loading) return <div className="p-6">Loading order details...</div>;
    if (error) return <div className="p-6 text-red-500">Error: {error}</div>;
    if (!order) return <div className="p-6">Order not found</div>;

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <Link href="/admin/orders" className="text-blue-600 flex items-center gap-2 mb-6 hover:underline">
                <ArrowLeft size={16} /> Back to Orders
            </Link>

            <div className="flex justify-between items-start mb-6">
                <h1 className="text-3xl font-bold">Order {order._id}</h1>
                <button
                    onClick={handleDelete}
                    className="bg-red-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-red-700 transition"
                >
                    <Trash2 size={16} /> Cancel/Delete Order
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Shipping Info */}
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 md:col-span-2">
                    <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
                    <p className="mb-2"><span className="font-semibold">Name:</span> {order.user?.name || 'Guest'}</p>
                    <p className="mb-2"><span className="font-semibold">Email:</span> {order.user?.email || 'N/A'}</p>
                    <p className="mb-4">
                        <span className="font-semibold">Address:</span> {order.shippingAddress?.address}, {order.shippingAddress?.city}, {order.shippingAddress?.postalCode}, {order.shippingAddress?.country}
                    </p>

                    <div className={`p-4 rounded border ${order.orderStatus === 'Delivered' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-yellow-50 border-yellow-200 text-yellow-800'}`}>
                        <div className="flex items-center gap-2 mb-2">
                            <Truck size={20} />
                            <span className="font-medium">Delivery Status:</span>
                            <span className="font-bold uppercase">{order.orderStatus}</span>
                        </div>
                        {order.orderStatus === 'Delivered' && order.deliveredAt && (
                            <p className="text-sm">Delivered on {new Date(order.deliveredAt).toLocaleString()}</p>
                        )}
                        <div className="mt-3">
                            <label className="block text-sm font-medium mb-1">Update Status:</label>
                            <select
                                value={order.orderStatus}
                                onChange={handleStatusChange}
                                className="bg-white border md:border-gray-300 p-2 rounded text-sm w-full md:w-auto"
                            >
                                <option value="Processing">Processing</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Payment Info */}
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                    <h2 className="text-xl font-semibold mb-4">Payment</h2>
                    <p className="mb-2"><span className="font-semibold">Method:</span> {order.paymentMethod}</p>

                    <div className={`p-4 rounded border mt-4 ${order.paymentStatus === 'Paid' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                        <div className="flex items-center gap-2 mb-2">
                            <CreditCard size={20} />
                            <span className="font-medium">Status:</span>
                            <span className="font-bold uppercase">{order.paymentStatus}</span>
                        </div>
                        {order.paymentStatus === 'Paid' && order.paidAt && (
                            <p className="text-sm">Paid on {new Date(order.paidAt).toLocaleString()}</p>
                        )}
                    </div>

                    {order.paymentStatus !== 'Paid' && (
                        <button
                            onClick={handlePaymentHandler}
                            className="w-full mt-4 bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700 transition"
                        >
                            Mark As Paid
                        </button>
                    )}
                </div>

                {/* Order Items */}
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 md:col-span-3">
                    <h2 className="text-xl font-semibold mb-4">Order Items</h2>
                    <div className="divide-y divide-gray-100">
                        {(!order.orderItems || order.orderItems.length === 0) ? <p>Order is empty</p> : (
                            order.orderItems.map((item, index) => (
                                <div key={index} className="py-4 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="h-16 w-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                                            {item.image ? (
                                                <img src={item.image} alt={item.title || 'Product'} className="h-full w-full object-cover" />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center text-gray-400 text-xs">No Img</div>
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{item.title || 'Unknown Product'}</p>
                                            <p className="text-sm text-gray-500">{item.qty} x ₹{item.price} = ₹{item.qty * item.price}</p>
                                        </div>
                                    </div>
                                    <div className="font-semibold text-gray-900">
                                        ₹{item.qty * item.price}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
