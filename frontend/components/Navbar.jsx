'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
   Search,
   ShoppingCart,
   User,
   Heart,
   Menu,
   X,
   Home,
   Grid
} from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
   const [isSticky, setIsSticky] = useState(false);
   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
   const { cartCount, wishlistCount } = useCart();

   useEffect(() => {
      const handleScroll = () => {
         setIsSticky(window.scrollY > 150);
      };
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
   }, []);

   return (
      <>

         {/* 1. TOP ANNOUNCEMENT BAR */}
         <div className="w-full bg-red-600 text-white text-xs md:text-sm py-1 px-4 flex justify-between items-center transition-all duration-300">
            <div className="hidden md:flex gap-4">
               <span>Welcome to Rudra Divine</span>
               <span>|</span>
               <span>Diwali Sale is Live!</span>
            </div>
            <div className="w-full md:w-auto overflow-hidden">
               <p className="animate-pulse text-center font-semibold">
                  Use Code: DIVINE20 for 20% OFF
               </p>
            </div>
            <div className="hidden md:flex gap-4">
               <span>Call Us: +91-99999*****</span>
            </div>
         </div>

         {/* STICKY CONTAINER FOR MAIN HEADER & NAV */}
         <div className={`sticky top-0 z-50 transition-shadow duration-300 ease-in-out ${isSticky ? 'shadow-lg' : ''}`}>

            {/* 2. MAIN HEADER (Logo Left | Search Center | Icons Right) */}
            <div className={`bg-white border-b border-gray-100 transition-[padding] duration-300 ease-in-out will-change-[padding] ${isSticky ? 'py-2' : 'py-4 md:py-6'}`}>
               <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">

                  {/* LEFT: Logo & Name */}
                  <div className="flex-shrink-0 w-full md:w-1/4 flex justify-center md:justify-start">
                     <Link href="/" className={`font-bold text-red-600 tracking-tighter uppercase flex items-center gap-2 transition-all ${isSticky ? 'text-xl md:text-2xl' : 'text-2xl md:text-3xl'}`}>
                        <span>🕉️</span>
                        <span>Rudra<span className="text-gray-800">Divine</span></span>
                     </Link>
                  </div>

                  {/* CENTER: Search Bar */}
                  <div className="w-full md:w-2/4 flex justify-center">
                     <div className="relative w-full max-w-2xl">
                        <input
                           type="text"
                           placeholder="Search for Rudraksha, Gemstones, etc..."
                           className={`w-full pl-6 pr-14 rounded-full border border-gray-300 bg-gray-50 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-red-500 focus:bg-white focus:ring-1 focus:ring-red-500 transition-all shadow-sm ${isSticky ? 'py-2 text-sm' : 'py-3'}`}
                        />
                        <button className={`absolute right-1 top-1 bottom-1 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center transition-colors ${isSticky ? 'px-3' : 'px-5'}`}>
                           <Search size={isSticky ? 16 : 20} />
                        </button>
                     </div>
                  </div>

                  {/* RIGHT: Icons List */}
                  <div className="w-full md:w-1/4 hidden md:flex justify-end items-center gap-6 lg:gap-8">
                     <div className="flex items-center gap-6">
                        <Link href="/wishlist" className="group flex flex-col items-center text-gray-700 hover:text-red-600 transition-colors relative">
                           <div className="relative">
                              <Heart size={isSticky ? 20 : 24} className="group-hover:scale-110 transition-transform" />
                              {wishlistCount > 0 && (
                                 <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm">{wishlistCount}</span>
                              )}
                           </div>
                           {!isSticky && <span className="text-xs mt-1 font-semibold">Wishlist</span>}
                        </Link>
                        <Link href="/account" className="group flex flex-col items-center text-gray-700 hover:text-red-600 transition-colors">
                           <User size={isSticky ? 20 : 24} className="group-hover:scale-110 transition-transform" />
                           {!isSticky && <span className="text-xs mt-1 font-semibold">Sign In</span>}
                        </Link>
                        <Link href="/cart" className="group flex flex-col items-center text-gray-700 hover:text-red-600 transition-colors relative">
                           <div className="relative">
                              <ShoppingCart size={isSticky ? 20 : 24} className="group-hover:scale-110 transition-transform" />
                              {cartCount > 0 && (
                                 <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm">{cartCount}</span>
                              )}
                           </div>
                           {!isSticky && <span className="text-xs mt-1 font-semibold">Cart</span>}
                        </Link>
                     </div>
                  </div>
               </div>
            </div>

            {/* 3. CATEGORY NAVIGATION (Now Part of Sticky Block) */}
            <div className="w-full bg-red-600 text-white shadow-sm transition-all duration-300">
               <div className="container mx-auto px-4">
                  <div className={`flex justify-between items-center ${isSticky ? 'h-10' : 'h-12 md:h-14'}`}>

                     {/* Mobile Toggle */}
                     <button onClick={() => setMobileMenuOpen(true)} className="md:hidden p-2 text-white">
                        <Menu size={24} />
                     </button>

                     {/* Desktop Links */}
                     <nav className={`hidden md:flex items-center gap-6 lg:gap-8 text-sm font-bold uppercase tracking-wide overflow-x-auto whitespace-nowrap w-full justify-center`}>
                        {['Home', 'Rudraksha', 'Gemstones', 'Yantra', 'Parad', 'Sphatik', 'Malas', 'Bracelets', 'Sale'].map((item) => (
                           <Link key={item} href={item === 'Home' ? '/' : `/category/${item.toLowerCase()}`} className="hover:text-yellow-200 transition-colors py-1 border-b-2 border-transparent hover:border-yellow-200">
                              {item}
                           </Link>
                        ))}
                     </nav>

                     {/* Sticky Right Actions (For Mobile in this bar) */}
                     <div className="flex items-center gap-4 md:hidden">
                        <Search size={20} />
                        <Link href="/cart" className="relative">
                           <ShoppingCart size={20} />
                           {cartCount > 0 && <span className="absolute -top-2 -right-2 bg-white text-red-600 text-[10px] h-4 w-4 rounded-full flex items-center justify-center font-bold">{cartCount}</span>}
                        </Link>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* 4. MOBILE MENU DRAWER */}
         <div className={`fixed inset-0 z-[60] bg-black bg-opacity-50 transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible md:hidden'}`} onClick={() => setMobileMenuOpen(false)}>
            <div className={`absolute top-0 left-0 w-3/4 h-full bg-white shadow-xl transform transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`} onClick={(e) => e.stopPropagation()}>
               <div className="bg-red-600 p-4 flex justify-between items-center text-white">
                  <span className="font-bold text-lg">Menu</span>
                  <button onClick={() => setMobileMenuOpen(false)}><X size={24} /></button>
               </div>
               <div className="p-4 flex flex-col gap-4 overflow-y-auto h-full pb-20">
                  {['Home', 'Rudraksha', 'Gemstones', 'Yantra', 'Parad', 'Sphatik', 'Malas'].map((item) => (
                     <Link key={item} href={item === 'Home' ? '/' : `/category/${item.toLowerCase()}`} className="text-gray-800 font-medium border-b pb-2">
                        {item}
                     </Link>
                  ))}
               </div>
            </div>
         </div>

         {/* 5. MOBILE BOTTOM NAV */}
         <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 z-50 flex justify-around items-center py-2 pb-safe shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
            <Link href="/" className="flex flex-col items-center text-red-600">
               <Home size={20} />
               <span className="text-[10px] mt-1 font-medium">Home</span>
            </Link>
            <Link href="/categories" className="flex flex-col items-center text-gray-500 hover:text-red-600">
               <Grid size={20} />
               <span className="text-[10px] mt-1 font-medium">Categories</span>
            </Link>
            <Link href="/wishlist" className="flex flex-col items-center text-gray-500 hover:text-red-600">
               <Heart size={20} />
               <span className="text-[10px] mt-1 font-medium">Wishlist</span>
            </Link>
            <Link href="/account" className="flex flex-col items-center text-gray-500 hover:text-red-600">
               <User size={20} />
               <span className="text-[10px] mt-1 font-medium">Account</span>
            </Link>
            <Link href="/cart" className="flex flex-col items-center text-gray-500 hover:text-red-600 relative">
               <div className="relative">
                  <ShoppingCart size={20} />
                  {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[9px] w-3.5 h-3.5 flex items-center justify-center rounded-full">{cartCount}</span>}
               </div>
               <span className="text-[10px] mt-1 font-medium">Cart</span>
            </Link>
         </div>


      </>
   );
}
