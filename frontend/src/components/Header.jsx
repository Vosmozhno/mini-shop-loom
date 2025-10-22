"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { ShoppingCart, User } from "lucide-react";

export default function Header() {
  const { cart } = useCart();

  const cartCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <header className="fixed top-0 left-0 w-full z-50 text-white">

      <div className="grid grid-cols-3 items-center h-24 px-8 border-b border-white/20">
        
        <nav className="flex items-center justify-start gap-8">
          <Link href="/catalog" className="text-sm uppercase tracking-widest transition-colors hover:text-gray-400">
            Каталог
          </Link>
          <Link href="/about" className="text-sm uppercase tracking-widest transition-colors hover:text-gray-400">
            О нас
          </Link>
        </nav>

        <div className="flex justify-center">
          <Link href="/" className="text-3xl font-bold uppercase tracking-[0.2em] hover:text-gray-300">
            Loom
          </Link>
        </div>

        <nav className="flex items-center justify-end gap-8">

          <Link href="/cart" className="relative flex items-center transition-colors hover:text-gray-400">
            <ShoppingCart className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-white text-black text-xs rounded-full w-4 h-4 flex items-center justify-center font-semibold">
                {cartCount}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}