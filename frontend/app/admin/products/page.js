'use client';

import { useEffect, useState } from 'react';
import api from '@/services/api';
import Link from 'next/link';
import { Plus, Edit, Trash2 } from 'lucide-react';

export default function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProducts = async () => {
        try {
            const { data } = await api.get('/api/products');
            setProducts(data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const deleteHandler = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await api.delete(`/api/products/${id}`);
                setProducts(products.filter((product) => product._id !== id));
            } catch (err) {
                alert(err.response?.data?.message || 'Failed to delete product');
            }
        }
    };

    if (loading) return (
        <div className="p-6 space-y-4">
            <div className="flex justify-between">
                <div className="w-48 h-10 bg-neutral-900 rounded-lg animate-pulse border border-white/10" />
                <div className="w-32 h-10 bg-neutral-900 rounded-lg animate-pulse border border-white/10" />
            </div>
            <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-full h-16 bg-neutral-900 rounded-lg animate-pulse border border-white/10" />
                ))}
            </div>
        </div>
    );
    if (error) return <div className="p-6 text-red-400 bg-red-900/20 border border-red-500/30 rounded-lg m-6">Error: {error}</div>;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-white tracking-wide">Products</h1>
                    <p className="text-gray-400 mt-1">Manage your spiritual types</p>
                </div>
                <Link
                    href="/admin/products/add"
                    className="bg-primary hover:bg-white hover:text-black text-black px-4 py-2 rounded-lg flex items-center gap-2 transition-all font-bold shadow-[0_0_15px_rgba(212,175,55,0.3)]"
                >
                    <Plus size={20} /> Add Product
                </Link>
            </div>

            <div className="bg-neutral-900/50 backdrop-blur-sm rounded-2xl shadow-lg border border-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-white/5">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Image</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Price</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Stock</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {products.map((product) => (
                                <tr key={product._id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="h-12 w-12 bg-neutral-800 rounded-lg overflow-hidden border border-white/10">
                                            {/* Display first image if available, else placeholder */}
                                            {product.images && product.images[0] ? (
                                                <img src={product.images[0]} alt={product.title} className="h-full w-full object-cover" />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center text-gray-600 text-xs">No Img</div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-white font-medium">
                                        {product.title}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-primary font-bold">
                                        ₹{product.price}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-400">
                                        <span className="bg-white/5 px-2 py-1 rounded border border-white/5 text-xs">
                                            {product.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-300">
                                        {product.stock}
                                    </td>
                                    <td className="px-6 py-4 text-sm flex gap-3">
                                        <Link href={`/admin/products/${product._id}/edit`} className="p-2 bg-white/5 rounded-full text-gray-400 hover:text-white hover:bg-primary/20 transition-all">
                                            <Edit size={18} />
                                        </Link>
                                        <button
                                            onClick={() => deleteHandler(product._id)}
                                            className="p-2 bg-white/5 rounded-full text-gray-400 hover:text-red-400 hover:bg-red-900/20 transition-all"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {products.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                        No products found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
