'use client';

import { useEffect, useState } from 'react';
import HeroSection from '@/components/HeroSection';
import TrustStrip from '@/components/TrustStrip';
import CategoryShowcase from '@/components/CategoryShowcase';
import BrandStory from '@/components/BrandStory';
import ProductCard from '@/components/ProductCard';
import api from '@/services/api';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(8);

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
    <main className="min-h-screen bg-black overflow-hidden">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Trust Strip */}
      <TrustStrip />

      {/* 3. Category Showcase */}
      <CategoryShowcase />

      {/* 4. Brand Story */}
      <BrandStory />

      {/* 5. Featured Products Section */}
      <section id="featured-products" className="py-24 bg-neutral-950 relative">
        <div className="absolute inset-0 bg-radial-gradient from-primary/5 to-transparent opacity-50"></div>
        <div className="container mx-auto px-4 max-w-7xl relative z-10">

          {/* Section Header */}
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
            <div className="max-w-xl">
              <span className="text-secondary font-bold tracking-[0.2em] uppercase text-xs md:text-sm mb-2 block">
                Sacred Tools for Your Journey
              </span>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-white leading-tight">
                Experience the <span className="text-primary italic">Energy</span>
              </h2>
            </div>

          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-10">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse bg-neutral-900 rounded-2xl overflow-hidden border border-white/5 p-4">
                  <div className="bg-neutral-800 aspect-[4/5] w-full rounded-xl mb-4"></div>
                  <div className="h-4 bg-neutral-800 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-neutral-800 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-10">
              {products.slice(0, visibleCount).map((product, idx) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05, duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <ProductCard product={product} />
                  {/* Note: ProductCard might need CSS adjustments for dark mode if it doesn't look right. 
                        Assuming ProductCard is mostly image and text that adapts or is white-bg based card. 
                        If it's white card, it will pop nicely on dark bg. */}
                </motion.div>
              ))}
              {products.length === 0 && (
                <div className="col-span-full text-center py-20 bg-neutral-900 rounded-xl border border-white/5">
                  <p className="text-xl text-gray-400">No products found at the moment.</p>
                </div>
              )}
            </div>
          )}

          {products.length > visibleCount && (
            <div className="mt-16 text-center">
              <button
                onClick={() => setVisibleCount(prev => prev + 4)}
                className="bg-primary text-black px-10 py-4 rounded-full font-bold text-lg hover:bg-white transition-all duration-500 shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] inline-flex items-center gap-2 transform hover:-translate-y-1"
              >
                Show More <ArrowRight size={20} />
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
