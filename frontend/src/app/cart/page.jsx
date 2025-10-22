"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { Minus, Plus, X } from "lucide-react";

export default function CartPage() {
  const { cart, items, updateQuantity, removeItem } = useCart();

  const total = items.reduce(
    (sum, item) => sum + item.unit_price * item.quantity,
    0
  );

  const currency = cart?.region?.currency_code?.toUpperCase();

  if (!items || items.length === 0) {
    return (
      <main className="max-w-4xl mx-auto px-6 py-12 text-center">
        <h1 className="text-4xl font-bold uppercase tracking-wider mb-4">Корзина</h1>
        <p className="text-neutral-400 mb-8">Ваша корзина пуста.</p>
        <Link
          href="/catalog"
          className="inline-block px-8 py-3 border-2 border-white bg-transparent text-white uppercase tracking-widest text-sm font-semibold transition-colors hover:bg-white hover:text-black"
        >
          Вернуться в каталог
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-4xl sm:text-5xl font-bold uppercase tracking-wider text-center mb-12">
        Корзина
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-16">
        
        {/* ЛЕВАЯ ЧАСТЬ — ТОВАРЫ */}
        <div className="lg:col-span-2">
          <div className="space-y-8">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-white/10 pb-8 gap-6"
              >
                {/* Фото + текст */}
                <div className="flex flex-1 items-start sm:items-center gap-6">
                  <div className="w-40 h-40 flex-shrink-0 bg-neutral-900 rounded-md overflow-hidden">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Расширенное место для текста */}
                  <div className="flex-1">
                    <h2 className="text-2xl uppercase tracking-widest font-semibold text-white leading-tight">
                      {item.title}
                    </h2>
                    <p className="mt-2 text-lg sm:text-xl text-neutral-400">
                      {(item.unit_price).toFixed(2)} {currency}
                    </p>
                  </div>
                </div>

                {/* Количество */}
                <div className="flex items-center gap-4 sm:gap-6">
                  <div className="flex items-center border border-white/30 rounded-md">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity === 1}
                      className="p-2 text-neutral-400 hover:text-white transition-colors disabled:opacity-30"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="text-base font-medium w-10 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-2 text-neutral-400 hover:text-white transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  {/* Кнопка удаления */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-neutral-500 hover:text-white transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ПРАВАЯ ЧАСТЬ — ИТОГ */}
        <div className="lg:col-span-1 mt-12 lg:mt-0">
          <div className="bg-neutral-800 rounded-lg p-8 sticky top-32">
            <h2 className="text-2xl uppercase tracking-wider font-semibold mb-6">Итоги заказа</h2>
            <div className="flex justify-between items-center text-lg border-b border-white/10 pb-4">
              <span>Сумма</span>
              <span className="font-semibold">{total.toFixed(2)} {currency}</span>
            </div>
            <div className="flex justify-between items-center text-lg pt-4">
              <span className="font-semibold">Всего к оплате</span>
              <span className="text-2xl font-bold">{total.toFixed(2)} {currency}</span>
            </div>
            <Link
              href="/checkout"
              className="mt-8 w-full inline-block px-8 py-4 bg-white text-black text-center text-sm uppercase tracking-widest font-semibold rounded-md hover:bg-neutral-300 transition-colors"
            >
              Оформить заказ
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
