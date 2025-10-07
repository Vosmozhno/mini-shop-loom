"use client"

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle } from 'lucide-react';

export default function ThankYouPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');

  return (
    <main className="p-6 max-w-2xl mx-auto text-center flex flex-col items-center justify-center min-h-[70vh]">
      
      <CheckCircle className="text-green-500 w-16 h-16 mb-4" />

      <h1 className="text-3xl font-bold mb-3 text-white">
        Спасибо за ваш заказ!
      </h1>

      <p className="mb-8 text-gray-400 max-w-md">
        Ваш заказ был успешно оформлен. Вся информация отправлена на указанный вами email. Мы скоро свяжемся с вами для подтверждения деталей.
      </p>

      {orderId && (
        <div className="mb-8">
          <p className="text-lg text-gray-300">
            Номер вашего заказа:
          </p>
          <p className="font-mono text-xl bg-neutral-800 text-white px-4 py-2 rounded-lg inline-block mt-2 shadow-md">
            {orderId.startsWith('fake_') ? `#${orderId.slice(11)}` : orderId}
          </p>
        </div>
      )}

      <Link
        href="/catalog"
        className="px-6 py-3 bg-white text-black rounded-xl hover:bg-gray-300 font-semibold transition shadow-lg"
      >
        ← Вернуться в каталог
      </Link>
    </main>
  );
}