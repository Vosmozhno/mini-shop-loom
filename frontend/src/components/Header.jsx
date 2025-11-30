"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { ShoppingCart, Menu, X } from "lucide-react";

export default function Header() {
  const { cart } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const cartCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 text-white bg-black/30 backdrop-blur-md transition-all border-b border-white/10">
        
        <div className="grid grid-cols-3 items-center h-16 md:h-24 px-4 md:px-8">
          
          <div className="flex items-center justify-start">
            
            <nav className="hidden md:flex gap-8">
              <Link href="/catalog" className="text-sm uppercase tracking-widest transition-colors hover:text-gray-400">
                Каталог
              </Link>
              <Link href="/about" className="text-sm uppercase tracking-widest transition-colors hover:text-gray-400">
                О нас
              </Link>
            </nav>

            <button onClick={toggleMenu} className="md:hidden p-2 -ml-2 hover:text-gray-300">
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          <div className="flex justify-center">
            <Link href="/" className="text-xl md:text-3xl font-bold uppercase tracking-[0.2em] hover:text-gray-300" onClick={closeMenu}>
              Loom
            </Link>
          </div>

          <nav className="flex items-center justify-end gap-8">
            <Link href="/cart" className="relative flex items-center transition-colors hover:text-gray-400" onClick={closeMenu}>
              <ShoppingCart className="w-5 h-5 md:w-6 md:h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-white text-black text-[10px] md:text-xs rounded-full w-3.5 h-3.5 md:w-4 md:h-4 flex items-center justify-center font-semibold">
                  {cartCount}
                </span>
              )}
            </Link>
          </nav>
        </div>
      </header>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl md:hidden pt-24">
          <nav className="flex flex-col items-center gap-8 p-8 text-white">
            <Link 
              href="/catalog" 
              onClick={closeMenu}
              className="text-2xl uppercase tracking-widest hover:text-gray-400 transition-colors"
            >
              Каталог
            </Link>
            <Link 
              href="/about" 
              onClick={closeMenu}
              className="text-2xl uppercase tracking-widest hover:text-gray-400 transition-colors"
            >
              О нас
            </Link>
            
          </nav>
        </div>
      )}
    </>
  );
}