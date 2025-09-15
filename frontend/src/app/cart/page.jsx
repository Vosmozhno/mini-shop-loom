"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { Minus, Plus } from "lucide-react";

export default function CartPage() {
  const { cart, items, updateQuantity, removeItem } = useCart();

	const total = items.reduce(
		(sum, item) => sum + item.unit_price * item.quantity,
		0
	);

	const currency = cart?.region?.currency_code?.toUpperCase();


  if (!items.length) {
    return (
      <main className="p-6 min-h-screen text-gray-100 flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-4">Корзина</h1>
        <p className="mb-6 text-gray-400">Ваша корзина пуста.</p>
        <Link
          href="/catalog"
          className="px-4 py-2 bg-white text-black rounded-2xl hover:bg-gray-300 transition"
        >
          ← Вернуться в каталог
        </Link>
      </main>
    );
  }

  return (
    <main className="p-6 max-w-6xl rounded-3xl mx-auto h-auto bg-neutral-900 text-gray-100 mt-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Корзина</h1>

      <div className="space-y-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex flex-col md:flex-row items-center justify-between gap-4 bg-neutral-800 rounded-2xl shadow-xl p-4"
          >
            <div className="flex items-center gap-4 w-full md:w-2/3">
              <img
                src={item.thumbnail}
                alt={item.title}
                className="w-30 h-30 object-cover rounded-xl bg-neutral-900 shadow-lg"
              />
              <div>
                <h2 className="text-lg font-semibold text-6xl">{item.title}</h2>
                <p className="text-gray-400">
                  {item.unit_price} {currency}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-2 md:mt-0">
              <button
                onClick={() =>
                  updateQuantity(item.id, Math.max(item.quantity - 1, 1))
                }
                className="p-2 bg-neutral-700 rounded-full hover:bg-neutral-600"
              >
                <Minus size={16} />
              </button>
              <span className="text-lg">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="p-2 bg-neutral-700 rounded-full hover:bg-neutral-600"
              >
                <Plus size={16} />
              </button>

              <button
                onClick={() => removeItem(item.id)}
                className=" w-8 h-8 bg-red-600 rounded-full hover:bg-red-700"
              >
                ✕
              </button>
            </div>
          </div>
        ))}

        <div className="flex flex-col md:flex-row justify-between items-center bg-neutral-800 rounded-2xl shadow-xl p-6 mt-4">
          <p className="text-2xl font-bold mb-4 md:mb-0">
            Итого: {total} {currency}
          </p>
          <Link
            href="/checkout"
            className="px-6 py-3 bg-white text-black rounded-2xl hover:bg-gray-300 font-semibold transition"
          >
            Оформить заказ →
          </Link>
        </div>
      </div>
    </main>
  );
}
