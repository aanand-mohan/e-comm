'use client';

import { useState, useEffect } from 'react';
import api from '@/services/api';
import { useToast } from '@/context/ToastContext';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import Modal from '@/components/ui/Modal';
import { Plus, Edit2, Trash2, FolderOpen, Search } from 'lucide-react';
import Skeleton from '@/components/ui/Skeleton';

export default function CategoriesPage() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const { success, error: toastError } = useToast();

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({ name: '', description: '', image: '', isActive: true });
    const [submitting, setSubmitting] = useState(false);

    const fetchCategories = async () => {
        try {
            const { data } = await api.get('/api/categories/admin');
            setCategories(data);
        } catch (err) {
            console.error(err);
            toastError('Failed to fetch categories');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const resetForm = () => {
        setFormData({ name: '', description: '', image: '', isActive: true });
        setEditingCategory(null);
    };

    const handleOpenModal = (category = null) => {
        if (category) {
            setEditingCategory(category);
            setFormData({
                name: category.name,
                description: category.description || '',
                image: category.image || '',
                isActive: category.isActive
            });
        } else {
            resetForm();
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (editingCategory) {
                await api.put(`/api/categories/${editingCategory._id}`, formData);
                success('Category updated successfully');
            } else {
                await api.post('/api/categories', formData);
                success('Category created successfully');
            }
            setIsModalOpen(false);
            fetchCategories();
        } catch (err) {
            toastError(err.response?.data?.message || 'Operation failed');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this category?')) return;
        try {
            await api.delete(`/api/categories/${id}`);
            success('Category deleted');
            fetchCategories();
        } catch (err) {
            toastError('Failed to delete category');
        }
    };

    const filteredCategories = categories.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className="space-y-4">
            <div className="flex justify-between">
                <Skeleton className="w-48 h-10 rounded-lg bg-neutral-900 border border-white/10" />
                <Skeleton className="w-32 h-10 rounded-lg bg-neutral-900 border border-white/10" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} className="h-40 rounded-2xl bg-neutral-900 border border-white/10" />
                ))}
            </div>
        </div>
    );

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-white tracking-wide">Categories</h1>
                    <p className="text-gray-400 mt-1">Manage product categories</p>
                </div>
                <Button
                    variant="primary"
                    icon={<Plus size={20} />}
                    onClick={() => handleOpenModal()}
                    className="bg-primary hover:bg-white hover:text-black text-black font-bold shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-all"
                >
                    Add Category
                </Button>
            </div>

            {/* Search */}
            <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Search categories..."
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-neutral-900 border border-white/10 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary/50 text-white placeholder-gray-600 transition-all font-sans"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Categories Grid */}
            {filteredCategories.length === 0 ? (
                <EmptyState
                    icon={<FolderOpen size={48} className="text-gray-600" />}
                    title="No categories found"
                    description="Get started by creating your first category."
                    actionLabel="Create Category"
                    onAction={() => handleOpenModal()}
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredCategories.map((cat) => (
                        <div key={cat._id} className="group bg-neutral-900/50 backdrop-blur-sm rounded-2xl border border-white/5 shadow-lg hover:border-primary/30 transition-all overflow-hidden flex flex-col">
                            <div className="h-40 bg-neutral-900 relative overflow-hidden">
                                {cat.image ? (
                                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-700">
                                        <FolderOpen size={48} />
                                    </div>
                                )}
                                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleOpenModal(cat)}
                                        className="p-2 bg-white/90 backdrop-blur rounded-full text-black hover:bg-primary transition-all shadow-sm"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(cat._id)}
                                        className="p-2 bg-white/90 backdrop-blur rounded-full text-black hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                                <div className={`absolute bottom-3 left-3 px-2 py-1 text-xs font-bold rounded-md uppercase tracking-wide border ${cat.isActive ? 'bg-green-900/80 text-white border-green-500/30' : 'bg-red-900/80 text-white border-red-500/30'}`}>
                                    {cat.isActive ? 'Active' : 'Inactive'}
                                </div>
                            </div>
                            <div className="p-5 flex-1 flex flex-col">
                                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-primary transition-colors">{cat.name}</h3>
                                <p className="text-sm text-gray-400 line-clamp-2">{cat.description || 'No description'}</p>
                                <div className="mt-4 pt-4 border-t border-white/5 text-xs text-gray-600 font-mono text-right mt-auto">
                                    /{cat.slug}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* CREATE/EDIT MODAL */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingCategory ? 'Edit Category' : 'New Category'}
            >
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Category Name</label>
                        <input
                            type="text"
                            required
                            className="w-full px-4 py-2 rounded-lg bg-neutral-900 border border-white/10 focus:ring-1 focus:ring-primary focus:border-primary/50 outline-none text-white placeholder-gray-600 transition-all"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Description</label>
                        <textarea
                            rows="3"
                            className="w-full px-4 py-2 rounded-lg bg-neutral-900 border border-white/10 focus:ring-1 focus:ring-primary focus:border-primary/50 outline-none text-white placeholder-gray-600 transition-all custom-scrollbar"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Image URL</label>
                        <input
                            type="url"
                            placeholder="https://..."
                            className="w-full px-4 py-2 rounded-lg bg-neutral-900 border border-white/10 focus:ring-1 focus:ring-primary focus:border-primary/50 outline-none text-white placeholder-gray-600 transition-all"
                            value={formData.image}
                            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="isActive"
                            className="w-5 h-5 rounded bg-neutral-900 border-gray-600 text-primary focus:ring-primary focus:ring-offset-gray-900"
                            checked={formData.isActive}
                            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                        />
                        <label htmlFor="isActive" className="text-sm font-medium text-gray-300">Active Status</label>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                        <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white hover:bg-white/5">Cancel</Button>
                        <Button type="submit" variant="primary" isLoading={submitting} className="bg-primary hover:bg-white hover:text-black text-black font-bold border-none">
                            {editingCategory ? 'Save Changes' : 'Create Category'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
