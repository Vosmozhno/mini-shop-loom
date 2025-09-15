"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { ShoppingCart } from "lucide-react";

export default function Header() {
  const { cart } = useCart();

  const cartCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-neutral-900 shadow-md">
      <Link href="/" className="text-2xl font-bold text-white hover:text-gray-300">
        Loom
      </Link>

      <nav className="flex items-center gap-6">
        <Link href="/catalog" className="hover:text-gray-300">
          Каталог
        </Link>
        <Link href="/about" className="hover:text-gray-300">
          О нас
        </Link>

        <Link href="/cart" className="relative flex items-center hover:text-gray-300">
          <ShoppingCart className="w-6 h-6" />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-xs rounded-full w-5 h-5 flex items-center justify-center text-white">
              {cartCount}
            </span>
          )}
        </Link>
      </nav>
    </header>
  );
}
