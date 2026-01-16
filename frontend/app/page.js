'use client';

import { useEffect, useState } from 'react';
import HeroVideo from '../components/HeroVideo';
import ProductCard from '../components/ProductCard';
import api from '@/services/api';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get('/api/products');
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <main className="min-h-screen bg-white">
      {/* 1. Hero Video */}
      <HeroVideo />

      {/* 2. Products Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center mb-12">
          <span className="text-red-600 font-bold tracking-widest uppercase text-xs mb-2">Shop Now</span>
          <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-900 uppercase tracking-tight">
            New Arrivals
          </h1>
          <div className="w-16 h-1 bg-red-600 mt-4"></div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading products...</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
            {products.length === 0 && (
              <div className="col-span-full text-center py-20 text-gray-500">
                No products found. Check back soon!
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
