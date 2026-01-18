'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';
import { useContent } from '@/hooks/useContent';

const defaultSlides = [
    {
        id: 1,
        image: 'https://images.unsplash.com/photo-1620021665471-ca0afcb10243?w=1600&auto=format&fit=crop&q=80',
        title: 'Awaken Your Inner Light',
        subtitle: 'Begin your sacred journey. Align your energy with the cosmos through authentic spiritual tools.',
        cta: 'Start the Journey'
    },
    {
        id: 2,
        image: 'https://images.unsplash.com/photo-1615485925763-8678628890da?w=1600&auto=format&fit=crop&q=80',
        title: 'Balance & Protection',
        subtitle: 'Ancient Vedic wisdom to shield your aura and harmonize your life force.',
        cta: 'Find Your Balance'
    },
    {
        id: 3,
        image: 'https://images.unsplash.com/photo-1632516167262-e1a49e6d0a7a?w=1600&auto=format&fit=crop&q=80',
        title: 'Transform Your Reality',
        subtitle: 'Powerful Yantras and Parad aimed at manifesting abundance and spiritual growth.',
        cta: 'Experience Transformation'
    }
];

export default function HeroSection() {
    const [current, setCurrent] = useState(0);
    const { getContent, loading } = useContent('home_hero');
    const [slides, setSlides] = useState(defaultSlides);

    // Update slides with dynamic content when loaded
    useEffect(() => {
        if (!loading) {
            const title = getContent('home_hero_title');
            const subtitle = getContent('home_hero_subtitle');
            const cta = getContent('home_hero_cta');

            // We update the first slide to reflect the CMS settings
            // In a full CMS, we might have an array of slides, but for now we control the "Main" message via CMS
            if (title || subtitle || cta) {
                setSlides(prev => {
                    const newSlides = [...prev];
                    newSlides[0] = {
                        ...newSlides[0],
                        title: title || newSlides[0].title,
                        subtitle: subtitle || newSlides[0].subtitle,
                        cta: cta || newSlides[0].cta
                    };
                    return newSlides;
                });
            }
        }
    }, [loading, getContent]);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
        }, 5000); // Slowed down to 5s for better readability
        return () => clearInterval(timer);
    }, [slides.length]);

    return (
        <section className="relative h-[85vh] w-full overflow-hidden bg-black text-white">
            <AnimatePresence mode='wait'>
                <motion.div
                    key={current}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    className="absolute inset-0"
                >
                    {/* Background Image using Next.js Image */}
                    <div className="relative w-full h-full">
                        <Image
                            src={slides[current].image}
                            alt={slides[current].title}
                            fill
                            priority
                            className="object-cover opacity-80"
                        />
                    </div>

                    {/* Gradient Overlay - Lighter */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent" />
                </motion.div>
            </AnimatePresence>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center max-w-7xl">
                <motion.div
                    key={current + "-text"}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="max-w-2xl space-y-6"
                >
                    <span className="text-primary font-bold tracking-[0.3em] uppercase text-sm md:text-base">
                        {!loading && getContent('home_hero_label', 'Rudra Divine Spiritual Store')}
                    </span>

                    <h1 className="text-5xl md:text-7xl font-serif font-bold leading-tight drop-shadow-lg">
                        {slides[current].title}
                    </h1>

                    <p className="text-lg md:text-2xl text-gray-200 font-light max-w-xl">
                        {slides[current].subtitle}
                    </p>

                    <div className="pt-4">
                        <Link href="/category/all">
                            <button className="bg-primary text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-secondary hover:scale-105 transition-all duration-300 flex items-center gap-2">
                                {slides[current].cta} <ChevronRight size={20} />
                            </button>
                        </Link>
                    </div>
                </motion.div>

                {/* Progress Indicators */}
                <div className="absolute bottom-12 left-4 md:left-0 right-0 flex justify-center gap-3">
                    {slides.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrent(idx)}
                            className={`h-1 rounded-full transition-all duration-300 ${idx === current ? 'w-12 bg-primary' : 'w-4 bg-gray-600'}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
