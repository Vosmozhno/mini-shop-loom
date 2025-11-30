"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { medusa } from "@/lib/medusa";
import { useCart } from "@/context/CartContext";
import { Minus, Plus, Loader, ArrowLeft } from "lucide-react";

export default function ProductPage({ params }) {
  const { handle } = use(params);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const { cart, addItem, loading: cartLoading } = useCart();

  const handleAddToCart = async () => {
    if (!variant) {
      console.error("Вариант товара не найден, добавление невозможно.");
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
          region_id: "reg_01K85W4J26QYCAR5VP64BXCM63",
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

  if (loading) {
    return <main className="text-center p-12">Загрузка...</main>;
  }
  if (!product) {
    return <main className="text-center p-12">Товар не найден.</main>;
  }

  const variant = product.variants?.[0];
  const price = variant?.calculated_price?.calculated_amount !== undefined
    ? new Intl.NumberFormat("ru-RU", {
        style: "currency",
        currency: variant.calculated_price.currency_code || "RUB",
      }).format(variant.calculated_price.calculated_amount)
    : null;

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-8">
        <Link
          href="/catalog"
          className="inline-flex items-center gap-2 text-sm uppercase tracking-widest text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={16} />
          Назад в каталог
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
        <div className="aspect-square w-full relative bg-neutral-900 rounded-md">
          <img
            src={product.thumbnail}
            alt={product.title}
            className="w-full h-full object-contain"
          />
        </div>

        <div className="flex flex-col justify-center">
          <h1 className="text-4xl sm:text-5xl font-bold uppercase tracking-wider text-white mb-6">
            {product.title}
          </h1>

          {price && (
            <p className="text-3xl font-medium tracking-wide text-neutral-200 mb-8">
              {price}
            </p>
          )}

          <div className="prose prose-invert prose-lg text-neutral-200 mb-10">
            <p>{product.description}</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center border border-white/30 rounded-md">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="p-3 text-neutral-400 hover:text-white transition-colors"
              >
                <Minus size={16} />
              </button>
              <span className="text-base font-medium w-12 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="p-3 text-neutral-400 hover:text-white transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className="flex-grow px-8 py-3 bg-white text-black text-sm uppercase tracking-widest font-semibold rounded-md hover:bg-neutral-300 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              disabled={cartLoading || isLoading || !cart}
            >
              {isLoading ? (
                <Loader className="animate-spin h-5 w-5" />
              ) : (
                "Добавить в корзину"
              )}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}