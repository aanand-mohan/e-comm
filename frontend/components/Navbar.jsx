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
import api from '@/services/api';

import { useContent } from '@/hooks/useContent';

export default function Navbar() {
   const [isSticky, setIsSticky] = useState(false);
   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
   const [categories, setCategories] = useState([]);
   const { cartCount, wishlistCount } = useCart();

   // Fetch Navbar content
   const { getContent, loading } = useContent('navbar');

   useEffect(() => {
      const handleScroll = () => {
         setIsSticky(window.scrollY > 100);
      };

      const fetchCategories = async () => {
         try {
            console.log('Fetching categories...');
            const { data } = await api.get('/api/categories');
            console.log('Categories fetched:', data);
            setCategories(data);
         } catch (error) {
            console.error('Failed to fetch categories:', error);
         }
      };

      fetchCategories();
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
   }, []);

   return (
      <>
         {/* 1. TOP ANNOUNCEMENT BAR - Sacred Dark & Gold */}
         <div className="bg-black text-gray-400 text-[10px] md:text-xs py-2 border-b border-white/5 tracking-wider font-serif">
            <div className="container mx-auto px-4 max-w-7xl flex justify-between items-center">
               <div className="hidden md:flex gap-6">
                  <span className="text-primary/80">{!loading && getContent('navbar_announcement_left', 'Awaken Your Inner Energy')}</span>
                  <span>{!loading && getContent('navbar_announcement_right', 'Authentic Vedic Tools')}</span>
               </div>
               <div className="w-full md:w-auto text-center">
                  <span className="font-medium text-gray-300">
                     {!loading && getContent('navbar_promo', 'Start Your Sacred Journey • Free Shipping on Orders over ₹999')}
                  </span>
               </div>
               <div className="hidden md:flex gap-6">
                  <span>Blessings: {!loading && getContent('navbar_phone', '+91-99999*****')}</span>
               </div>
            </div>
         </div>

         {/* 2. STICKY HEADER CONTAINER */}
         <header className={`sticky top-0 z-50 transition-all duration-300 ${isSticky ? 'bg-black/90 backdrop-blur-md shadow-2xl border-b border-white/10' : 'bg-transparent border-b border-white/5'}`}>

            {/* MAIN HEADER: Logo | Search | Actions */}
            <div className="container mx-auto px-4 max-w-7xl">
               <div className="flex justify-between items-center py-4 md:py-6 gap-4 md:gap-8">

                  {/* LEFT: Mobile Menu & Logo */}
                  <div className="flex items-center gap-3 md:gap-0">
                     <button onClick={() => setMobileMenuOpen(true)} className="md:hidden p-2 -ml-2 text-white hover:text-primary transition-colors">
                        <Menu size={24} />
                     </button>

                     <Link href="/" className="flex items-center gap-3 group">
                        <span className="text-2xl md:text-3xl filter drop-shadow-[0_0_10px_rgba(212,175,55,0.5)]">🕉️</span>
                        <div className="flex flex-col leading-none">
                           <span className="font-serif font-bold text-white text-xl md:text-2xl tracking-wide uppercase group-hover:text-primary transition-colors duration-300">
                              {!loading && getContent('navbar_logo_text', 'Rudra')}
                              {/* If you want "Divine" to be colored, we might need a richer text editor or just stick to simple text for now. 
                                  For now, let's assume the CMS sends the full string. I'll split it or just render as is. 
                                  Let's just render it fully. The user can type "RUDRA DIVINE"
                                  Wait, the design has "Rudra" in white and "Divine" in primary color.
                                  To keep it editable but maintain design, I probably need two fields or HTML support.
                                  Let's stick to simple text for MVP control. 
                               */}
                              {!loading ? getContent('navbar_logo_text', 'RudraDivine') : 'RudraDivine'}
                           </span>
                           <span className="text-[8px] md:text-[9px] text-gray-400 tracking-[0.3em] font-medium uppercase mt-1">
                              {!loading && getContent('navbar_subtitle', 'Spiritual Store')}
                           </span>
                        </div>
                     </Link>
                  </div>

                  {/* CENTER: Premium Modern Search Bar (Desktop) */}
                  <div className="hidden md:flex flex-1 max-w-xl mx-auto px-6">
                     <div className="relative w-full group">
                        <input
                           type="text"
                           placeholder="Search for peace, rudraksha, yantras..."
                           className="w-full pl-5 pr-14 py-3 rounded-full border border-white/10 bg-white/5 text-sm text-white placeholder-gray-500 outline-none focus:border-primary/50 focus:bg-black focus:ring-1 focus:ring-primary/30 transition-all shadow-inner group-hover:border-white/20"
                        />
                        <button className="absolute right-1.5 top-1.5 bottom-1.5 bg-primary/20 hover:bg-primary text-primary hover:text-black rounded-full px-5 flex items-center justify-center transition-all duration-300 active:scale-95 border border-primary/20">
                           <Search size={18} />
                        </button>
                     </div>
                  </div>

                  {/* RIGHT: Actions */}
                  <div className="flex items-center gap-2 md:gap-8">
                     <Link href="/" className="hidden md:hidden"> {/* Placeholder */}</Link>

                     {/* Mobile Search Icon */}
                     <button className="md:hidden p-2 text-gray-400 hover:text-primary transition-colors">
                        <Search size={22} />
                     </button>

                     <Link href="/wishlist" className="hidden md:flex flex-col items-center group relative text-gray-400 hover:text-primary transition-colors">
                        <div className="relative p-1">
                           <Heart size={22} className="group-hover:scale-110 transition-transform duration-300" strokeWidth={1.5} />
                           {wishlistCount > 0 && (
                              <span className="absolute -top-1 -right-1 bg-primary text-black text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full animate-in fade-in zoom-in">{wishlistCount}</span>
                           )}
                        </div>
                        <span className="text-[9px] font-medium uppercase tracking-widest mt-1 opacity-60 group-hover:opacity-100">Saved</span>
                     </Link>

                     <Link href="/account" className="hidden md:flex flex-col items-center group text-gray-400 hover:text-primary transition-colors">
                        <div className="relative p-1">
                           <User size={22} className="group-hover:scale-110 transition-transform duration-300" strokeWidth={1.5} />
                        </div>
                        <span className="text-[9px] font-medium uppercase tracking-widest mt-1 opacity-60 group-hover:opacity-100">Account</span>
                     </Link>

                     <Link href="/cart" className="flex flex-col items-center group relative text-white transition-colors">
                        <div className="relative p-2 bg-white/5 rounded-full group-hover:bg-primary/20 transition-colors duration-300 border border-white/5 group-hover:border-primary/30">
                           <ShoppingCart size={20} className="text-gray-200 group-hover:text-primary transition-colors duration-300" strokeWidth={1.5} />
                           {cartCount > 0 && (
                              <span className="absolute -top-1 -right-1 bg-primary text-black text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full shadow-[0_0_10px_rgba(212,175,55,0.4)] animate-in fade-in zoom-in">{cartCount}</span>
                           )}
                        </div>
                     </Link>
                  </div>
               </div>
            </div>

            {/* NAVIGATION LINKS (Desktop Only) */}
            <div className="hidden md:block border-t border-white/5 bg-black/50 backdrop-blur-sm">
               <div className="container mx-auto px-4 max-w-7xl">
                  <nav className="flex justify-center items-center gap-10 py-3 overflow-x-auto">
                     <Link
                        href="/"
                        className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-primary relative group py-1"
                     >
                        Home
                        <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-primary transition-all duration-300 group-hover:w-full opacity-50"></span>
                     </Link>
                     {categories.map((cat) => (
                        <Link
                           key={cat._id}
                           href={`/category/${cat.slug}`}
                           className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-primary relative group py-1"
                        >
                           {cat.name}
                           <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-primary transition-all duration-300 group-hover:w-full opacity-50"></span>
                        </Link>
                     ))}
                  </nav>
               </div>
            </div>
         </header>

         {/* 3. MOBILE MENU DRAWER */}
         <div className={`fixed inset-0 z-[60] bg-black/80 backdrop-blur-md transition-all duration-500 ${mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} onClick={() => setMobileMenuOpen(false)}>
            <div className={`absolute top-0 left-0 w-[85%] max-w-sm h-full bg-neutral-900 border-r border-white/10 shadow-2xl transform transition-transform duration-500 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`} onClick={(e) => e.stopPropagation()}>
               {/* Drawer Header */}
               <div className="bg-black/50 p-6 flex justify-between items-center border-b border-white/5">
                  <span className="font-serif font-bold text-xl tracking-wider text-white">MENU</span>
                  <button onClick={() => setMobileMenuOpen(false)} className="hover:bg-white/10 rounded-full p-2 transition text-gray-400 hover:text-white"><X size={24} /></button>
               </div>

               {/* Drawer Content */}
               <div className="py-4 px-6 h-full overflow-y-auto">
                  <ul className="flex flex-col space-y-2">
                     <li>
                        <Link
                           href="/"
                           className="flex items-center justify-between py-4 text-gray-300 font-medium tracking-wide border-b border-white/5 hover:text-primary transition-colors"
                           onClick={() => setMobileMenuOpen(false)}
                        >
                           Home
                        </Link>
                     </li>
                     {categories.map((cat) => (
                        <li key={cat._id}>
                           <Link
                              href={`/category/${cat.slug}`}
                              className="flex items-center justify-between py-4 text-gray-300 font-medium tracking-wide border-b border-white/5 hover:text-primary transition-colors"
                              onClick={() => setMobileMenuOpen(false)}
                           >
                              {cat.name}
                           </Link>
                        </li>
                     ))}
                     <li className="mt-8 pt-8 border-t border-white/10 space-y-4">
                        <Link href="/account" className="flex items-center gap-4 py-3 text-gray-400 font-medium hover:text-white transition-colors" onClick={() => setMobileMenuOpen(false)}>
                           <User size={20} className="text-primary" /> My Profile
                        </Link>
                        <Link href="/wishlist" className="flex items-center gap-4 py-3 text-gray-400 font-medium hover:text-white transition-colors" onClick={() => setMobileMenuOpen(false)}>
                           <Heart size={20} className="text-primary" /> My Wishlist
                        </Link>
                     </li>
                  </ul>
               </div>
            </div>
         </div>

         {/* 4. MOBILE BOTTOM NAV (Fixed at bottom) */}
         <div className="md:hidden fixed bottom-0 left-0 w-full bg-black/90 backdrop-blur-xl border-t border-white/10 z-50 flex justify-between px-8 items-center py-3 pb-safe">
            <Link href="/" className="flex flex-col items-center text-primary gap-1">
               <Home size={22} className="drop-shadow-[0_0_8px_rgba(212,175,55,0.3)]" />
               <span className="text-[9px] font-medium tracking-wide">Home</span>
            </Link>
            <Link href="/" onClick={(e) => { e.preventDefault(); setMobileMenuOpen(true); }} className="flex flex-col items-center text-gray-500 hover:text-primary gap-1 transition-colors">
               <Grid size={22} />
               <span className="text-[9px] font-medium tracking-wide">Menu</span>
            </Link>
            <Link href="/wishlist" className="flex flex-col items-center text-gray-500 hover:text-primary gap-1 transition-colors">
               <Heart size={22} />
               <span className="text-[9px] font-medium tracking-wide">Saved</span>
            </Link>
            <Link href="/account" className="flex flex-col items-center text-gray-500 hover:text-primary gap-1 transition-colors">
               <User size={22} />
               <span className="text-[9px] font-medium tracking-wide">Profile</span>
            </Link>
         </div>
      </>
   );
}
