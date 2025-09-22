"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function ThankYouPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <main className="max-w-lg mx-auto p-6 text-center bg-gray-800 rounded-2xl shadow-lg mt-8">
      <h1 className="text-3xl font-bold text-green-400 mb-4">Спасибо за заказ!</h1>
      {orderId && (
        <p className="text-gray-300 mb-6">
          Номер вашего заказа: <span className="font-mono">{orderId}</span>
        </p>
      )}
      <Link
        href="/catalog"
        className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
      >
        Вернуться в каталог
      </Link>
    </main>
  );
}
