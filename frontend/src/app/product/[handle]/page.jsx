"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { medusa } from "@/lib/medusa";
import { useCart } from "@/context/CartContext";

export default function ProductPage({ params }) {
  const { handle } = React.use(params);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    async function fetchProduct() {
      try {
        const { products } = await medusa.products.list({
          handle,
          fields: "*variants.calculated_price",
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

  if (loading) return <p className="p-6 text-gray-300">Загрузка...</p>;
  if (!product) return <p className="p-6 text-gray-300">Товар не найден</p>;

  const variant = product.variants?.[0];
  const price = variant?.calculated_price?.calculated_amount;
  const currency = variant?.calculated_price?.currency_code;

  return (
    <main className="p-6 max-w-7xl mx-auto min-h-screen text-white-100">
      
      <Link
        href="/catalog"
        className="inline-flex items-center text-grey-400 hover:text-stone-200 mb-6 transition"
      >
        ← Назад к каталогу
      </Link>
          <h1 className="text-3xl font-bold mb-4 text-stone-100 text-center">{product.title}</h1>


      <div className=" rounded-2xl shadow-xl grid grid-cols-1 md:grid-cols-2 gap-8 ">
        <div className="flex justify-center">
          <img
            src={product.thumbnail}
            alt={product.title}
            className="rounded-xl shadow-lg w-150 h-150 object-contain p-4"
          />
      </div>



        <div className="flex flex-col justify-center">
          <p className="text-stone-100 mb-6">{product.description}</p>

          {price !== undefined && (
            <p className="text-2xl font-semibold mb-6">
              <span className="bg-neutral-700 text-stone-100 px-3 py-1 rounded-xl">
                {price} {currency?.toUpperCase()}
              </span>
            </p>
          )}

          <button
            onClick={() => addItem(variant.id, 1)}
            className="px-6 py-3 bg-neutral-700 text-white text-lg rounded-xl hover:bg-stone-500 shadow-md transition inline-block"
          >
            Добавить в корзину ➝
          </button>
        </div>
      </div>
    </main>
  );
}
