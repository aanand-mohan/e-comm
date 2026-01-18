'use client';

import { useState, useEffect } from 'react';
import api from '@/services/api';
import { useRouter } from 'next/navigation';
import { Upload } from 'lucide-react';

export default function AddProductPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        title: '',
        price: '',
        category: '',
        description: '',
        stock: '',
    });
    const [files, setFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await api.get('/api/categories/admin');
                setCategories(data);
            } catch (err) {
                console.error('Failed to fetch categories');
            }
        };
        fetchCategories();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        if (files.length + selectedFiles.length > 5) {
            alert('You can only upload a maximum of 5 images.');
            return;
        }

        setFiles(prev => [...prev, ...selectedFiles]);

        const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
        setPreviews(prev => [...prev, ...newPreviews]);
    };

    const removeImage = (index) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
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
            await api.post('/api/products/add', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            router.push('/admin/products');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Add Product</h1>

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
                    <select
                        name="category"
                        required
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                            <option key={cat._id} value={cat.name}>{cat.name}</option>
                        ))}
                    </select>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Images (Max 5)</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition relative">
                        <input
                            type="file"
                            multiple
                            onChange={handleFileChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            disabled={files.length >= 5}
                        />
                        <div className="flex flex-col items-center justify-center text-gray-500">
                            <Upload size={32} className="mb-2 text-gray-400" />
                            <span className="text-sm font-medium">Click to upload images</span>
                            <span className="text-xs text-gray-400 mt-1">{files.length}/5 selected</span>
                        </div>
                    </div>

                    {/* Image Previews */}
                    {previews.length > 0 && (
                        <div className="grid grid-cols-5 gap-4 mt-4">
                            {previews.map((src, index) => (
                                <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200">
                                    <img src={src} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700 transition disabled:opacity-50"
                >
                    {loading ? 'Creating...' : 'Create Product'}
                </button>
            </form>
        </div>
    );
}
