"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { medusa } from "@/lib/medusa";
import { useCart } from "@/context/CartContext";
import { Minus, Plus, Loader } from "lucide-react";

export default function ProductPage({ params }) {
  const { handle } = use(params);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToCart = async () => {
  if (!variant) {
    console.error("Вариант не найден");
    return;
  }

  setIsLoading(true);
  try {
    await addItem(variant.id, quantity);
  } catch (e) {
    console.error("Ошибка добавления в корзину:", e);
  } finally {
    setIsLoading(false);
  }
};


  useEffect(() => {
    async function fetchProduct() {
      try {
        const { products } = await medusa.products.list({
          handle,
          fields: "*variants.calculated_price",
          region_id: "reg_01K60RPE6D6HS0EQ71DVRBT35A",
        });
        setProduct(products[0] || null);
      } catch (e) {
        console.error("Ошибка загрузки товара:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [handle]);

  if (loading) return <p className="p-6 text-gray-400">Загрузка...</p>;
  if (!product) return <p className="p-6 text-gray-400">Товар не найден</p>;

  const variant = product.variants?.[0];
  const price = variant?.calculated_price?.calculated_amount;
  const currency = variant?.calculated_price?.currency_code;

  return (
    <main className="p-6 max-w-7xl mx-auto min-h-screen text-neutral-100">
      <Link
        href="/catalog"
        className="inline-flex items-center text-gray-400 hover:text-gray-200 mb-6 transition"
      >
        ← Назад в каталог
      </Link>

      <h1 className="text-3xl font-bold text-center mb-6">{product.title}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 shadow-xl p-6">
        <div className="flex justify-center items-center">
          <img
            src={product.thumbnail}
            alt={product.title}
            className="rounded-xl shadow-lg w-150 h-150 max-w-md object-contain"
          />
        </div>

        <div className="flex flex-col justify-center">
          <p className="text-gray-300 mb-6 leading-relaxed">{product.description}</p>

          {price !== undefined && (
            <p className="text-2xl font-semibold mb-4">
              <span className="bg-neutral-700 text-white px-3 py-1 rounded-xl">
                {price} {currency?.toUpperCase()}
              </span>
            </p>
          )}

          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="p-2 bg-neutral-700 rounded-full hover:bg-neutral-600"
            >
              <Minus size={16} />
            </button>
            <span className="text-lg">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="p-2 bg-neutral-700 rounded-full hover:bg-neutral-600"
            >
              <Plus size={16} />
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            className="px-8 py-3 bg-white text-black text-lg font-semibold rounded-2xl hover:bg-gray-300 shadow-md flex items-center justify-center gap-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader className="animate-spin h-7 w-7 text-black" />
            ) : (
              "Добавить в корзину →"
            )}
          </button>
        </div>
      </div>
    </main>
  );
}
