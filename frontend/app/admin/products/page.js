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

    if (loading) return <div className="p-6">Loading products...</div>;
    if (error) return <div className="p-6 text-red-500">Error: {error}</div>;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Products</h1>
                <Link
                    href="/admin/products/add"
                    className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700 transition"
                >
                    <Plus size={20} /> Add Product
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Image</th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Name</th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Price</th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Category</th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Stock</th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {products.map((product) => (
                                <tr key={product._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="h-12 w-12 bg-gray-100 rounded overflow-hidden">
                                            {/* Display first image if available, else placeholder */}
                                            {product.images && product.images[0] ? (
                                                <img src={product.images[0]} alt={product.title} className="h-full w-full object-cover" />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center text-gray-400">No Img</div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                                        {product.title}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        ₹{product.price}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {product.category}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        {product.stock}
                                    </td>
                                    <td className="px-6 py-4 text-sm flex gap-3">
                                        <Link href={`/admin/products/${product._id}/edit`} className="text-blue-600 hover:text-blue-800">
                                            <Edit size={18} />
                                        </Link>
                                        <button
                                            onClick={() => deleteHandler(product._id)}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {products.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
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
