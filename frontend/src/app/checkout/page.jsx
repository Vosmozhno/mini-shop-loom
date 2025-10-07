"use client"

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
// import { medusa } from '@/lib/medusa'; 
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const { cart } = useCart(); 
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postal_code: '',
  });
  const { clearCart } = useCart();
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckout = (e) => {
    e.preventDefault();
    setLoading(true);

    console.log("--- РЕЖИМ ЗАГЛУШКИ ---");
    console.log("Данные формы для отправки:", formData);
    alert("Внимание: Оформление заказа находится в режиме симуляции. Реальный заказ создан не будет.");

    setTimeout(() => {
      const fakeOrderId = `fake_order_${Math.random().toString(36).substring(2, 11)}`;
      
      console.log(`Симуляция успешна. Перенаправление на /thank-you с ID: ${fakeOrderId}`);

      clearCart();

      router.push(`/thank-you?order_id=${fakeOrderId}`);

    }, 1500);
    
  };

  return (
    <main className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Оформление заказа</h1>

      <form onSubmit={handleCheckout} className="bg-neutral-800 p-8 rounded-2xl shadow-lg space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300">Имя</label>
          <input type="text" name="name" id="name" required value={formData.name} onChange={handleInputChange} className="mt-1 block w-full bg-neutral-700 border-neutral-600 rounded-md shadow-sm p-2" />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
          <input type="email" name="email" id="email" required value={formData.email} onChange={handleInputChange} className="mt-1 block w-full bg-neutral-700 border-neutral-600 rounded-md shadow-sm p-2" />
        </div>
        
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-300">Телефон</label>
          <input type="tel" name="phone" id="phone" required value={formData.phone} onChange={handleInputChange} className="mt-1 block w-full bg-neutral-700 border-neutral-600 rounded-md shadow-sm p-2" />
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-300">Адрес</label>
          <input type="text" name="address" id="address" required value={formData.address} onChange={handleInputChange} className="mt-1 block w-full bg-neutral-700 border-neutral-600 rounded-md shadow-sm p-2" />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label htmlFor="city" className="block text-sm font-medium text-gray-300">Город</label>
            <input type="text" name="city" id="city" required value={formData.city} onChange={handleInputChange} className="mt-1 block w-full bg-neutral-700 border-neutral-600 rounded-md shadow-sm p-2" />
          </div>
          <div className="flex-1">
            <label htmlFor="postal_code" className="block text-sm font-medium text-gray-300">Почтовый индекс</label>
            <input type="text" name="postal_code" id="postal_code" required value={formData.postal_code} onChange={handleInputChange} className="mt-1 block w-full bg-neutral-700 border-neutral-600 rounded-md shadow-sm p-2" />
          </div>
        </div>

        <button type="submit" disabled={loading} className="w-full px-6 py-3 bg-white text-black rounded-xl hover:bg-gray-300 font-semibold transition disabled:bg-gray-500">
          {loading ? 'Обработка...' : 'Оформить заказ'}
        </button>
      </form>
    </main>
  );
}