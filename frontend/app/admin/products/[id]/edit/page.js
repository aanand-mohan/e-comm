'use client';

import { useEffect, useState, use } from 'react';
import api from '@/services/api';
import { useRouter } from 'next/navigation';
import { Upload } from 'lucide-react';

export default function EditProductPage({ params }) {
    // React's use() hook for unpacking params in Next.js 15+ (if applicable) or standard async prop
    // Assuming params is a Promise in recent Next.js versions or just object:
    // Safe handling:
    const router = useRouter();

    // In Next.js 15, params is a Promise. We need to unwrap it if it is one.
    // For safety, we can handle both, or check version. Usually standard component props work.
    // Wait, recent Next.js app dir changes made params awaitable.
    // Let's use `use(params)` pattern if we were using it, but standard params prop works mostly.
    // Simpler: Just rely on async wrapping or use standard prop access if not using advanced async features component-level.
    // BUT this is a client component ('use client'). Client components receive params as props directly in some versions, 
    // but in layout it's different.
    // Let's assume params is available directly as prop.
    const { id } = use(params);

    const [formData, setFormData] = useState({
        title: '',
        price: '',
        category: '',
        description: '',
        stock: '',
    });
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await api.get(`/api/products/${id}`);
                setFormData({
                    title: data.title,
                    price: data.price,
                    category: data.category,
                    description: data.description,
                    stock: data.stock,
                });
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch product');
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchProduct();
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFiles(e.target.files);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdating(true);
        setError(null);

        const data = new FormData();
        data.append('title', formData.title);
        data.append('price', formData.price);
        data.append('category', formData.category);
        data.append('description', formData.description);
        data.append('stock', formData.stock);

        for (let i = 0; i < files.length; i++) {
            data.append('images', files[i]);
        }

        try {
            await api.put(`/api/products/${id}`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            router.push('/admin/products');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update product');
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return <div className="p-6">Loading product...</div>;

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Edit Product</h1>

            {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                        type="text"
                        name="title"
                        required
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                        <input
                            type="number"
                            name="price"
                            required
                            value={formData.price}
                            onChange={handleChange}
                            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                        <input
                            type="number"
                            name="stock"
                            required
                            value={formData.stock}
                            onChange={handleChange}
                            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <input
                        type="text"
                        name="category"
                        required
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                        name="description"
                        required
                        rows="4"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    ></textarea>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Images (Replace Existing)</label>
                    <div className="border-2 border-dashed border-gray-300 rounded p-4 text-center cursor-pointer hover:bg-gray-50 transition relative">
                        <input
                            type="file"
                            multiple
                            onChange={handleFileChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="flex flex-col items-center justify-center text-gray-500">
                            <Upload size={24} className="mb-2" />
                            <span className="text-sm">Click to upload new images</span>
                            {files.length > 0 && (
                                <span className="mt-2 text-blue-600 font-medium">{files.length} file(s) selected</span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={updating}
                        className="w-full bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700 transition disabled:opacity-50"
                    >
                        {updating ? 'Updating...' : 'Update Product'}
                    </button>
                    <button
                        type="button"
                        onClick={() => router.push('/admin/products')}
                        className="w-full bg-gray-200 text-gray-800 py-2 rounded font-medium hover:bg-gray-300 transition"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
