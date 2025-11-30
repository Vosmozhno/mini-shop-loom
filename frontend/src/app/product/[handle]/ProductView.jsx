"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { medusa } from "@/lib/medusa";
import { useCart } from "@/context/CartContext";
import { Minus, Plus, Loader, ArrowLeft } from "lucide-react";

export default function ProductView({ handle }) {
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const { cart, addItem, loading: cartLoading } = useCart();

  const variant = product?.variants?.[0];

  const handleAddToCart = async () => {
    if (!variant) {
      console.error("Вариант товара не найден");
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
        const { regions } = await medusa.store.region.list();
        
        if (!regions || regions.length === 0) {
          console.error("Регионы не найдены");
          setLoading(false);
          return;
        }

        const regionId = regions[0].id;

        const { products } = await medusa.store.product.list({
          handle: handle,
          region_id: regionId,
          fields: "+variants.calculated_price,+title,+description,+thumbnail,+images", 
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
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-white">
        <Loader className="animate-spin w-8 h-8 mr-2" /> Загрузка...
      </div>
    );
  }

  if (!product) {
    return (
      <main className="max-w-7xl mx-auto px-6 py-12 text-center text-white">
        <h1 className="text-2xl font-bold mb-4">Товар не найден</h1>
        <Link href="/catalog" className="underline hover:text-gray-300">
          Вернуться в каталог
        </Link>
      </main>
    );
  }

  const price = variant?.calculated_price?.calculated_amount !== undefined
    ? new Intl.NumberFormat("ru-RU", {
        style: "currency",
        currency: variant.calculated_price.currency_code || "RUB",
      }).format(variant.calculated_price.calculated_amount)
    : "Цена недоступна";

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
        <div className="aspect-square w-full relative bg-neutral-900 rounded-md overflow-hidden">
          {product.thumbnail ? (
             <img
               src={product.thumbnail}
               alt={product.title}
               className="w-full h-full object-cover"
             />
          ) : (
             <div className="w-full h-full flex items-center justify-center text-neutral-500">Нет фото</div>
          )}
        </div>

        <div className="flex flex-col justify-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-wider text-white mb-6">
            {product.title}
          </h1>

          <p className="text-2xl sm:text-3xl font-medium tracking-wide text-neutral-200 mb-8">
            {price}
          </p>

          <div className="prose prose-invert prose-lg text-neutral-200 mb-10 max-w-none">
            <p>{product.description}</p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <div className="flex items-center justify-between border border-white/30 rounded-md">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="p-3 text-neutral-400 hover:text-white transition-colors"
              >
                <Minus size={16} />
              </button>
              <span className="text-base font-medium text-white w-12 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="p-3 text-neutral-400 hover:text-white transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={cartLoading || isLoading || !variant}
              className="flex-grow px-8 py-3 bg-white text-black text-sm uppercase tracking-widest font-semibold rounded-md hover:bg-neutral-300 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed h-[50px]"
            >
              {isLoading ? (
                <Loader className="animate-spin h-5 w-5" />
              ) : (
                "Добавить в корзину"
              )}
            </button>
          </div>
          
          {!variant && <p className="text-red-500 text-sm mt-4">Ошибка: У товара нет вариантов.</p>}
        </div>
      </div>
    </main>
  );
}