"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

export default function CheckoutPage() {
  const { cart } = useCart();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!cart || cart.items?.length === 0) {
    return <p className="p-6 text-center">Корзина пуста</p>;
  }

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Проверка всех полей
    for (const key in form) {
      if (!form[key]) {
        setError("Пожалуйста, заполните все поля.");
        return;
      }
    }

    try {
      setLoading(true);

      const res = await fetch("/api/create-payment-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartId: cart.id,
          customer: form,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push(`/thank-you?orderId=${data.orderId}`);
      } else {
        setError(data.error || "Произошла ошибка при оформлении заказа");
      }
    } catch (err) {
      console.error(err);
      setError("Произошла ошибка при оформлении заказа");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-lg mx-auto p-6 bg-gray-800 rounded-2xl shadow-lg mt-8">
      <h1 className="text-2xl font-bold mb-6 text-center text-white">
        Оформление заказа
      </h1>

      {error && <p className="text-red-400 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" placeholder="Имя" value={form.name} onChange={handleChange} className="w-full p-3 rounded-lg bg-gray-700 text-white" />
        <input name="lastName" placeholder="Фамилия" value={form.lastName} onChange={handleChange} className="w-full p-3 rounded-lg bg-gray-700 text-white" />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} type="email" className="w-full p-3 rounded-lg bg-gray-700 text-white" />
        <input name="phone" placeholder="Телефон" value={form.phone} onChange={handleChange} className="w-full p-3 rounded-lg bg-gray-700 text-white" />
        <input name="address" placeholder="Адрес" value={form.address} onChange={handleChange} className="w-full p-3 rounded-lg bg-gray-700 text-white" />
        <input name="city" placeholder="Город" value={form.city} onChange={handleChange} className="w-full p-3 rounded-lg bg-gray-700 text-white" />
        <input name="postalCode" placeholder="Почтовый индекс" value={form.postalCode} onChange={handleChange} className="w-full p-3 rounded-lg bg-gray-700 text-white" />

        <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-3 rounded-lg font-semibold disabled:opacity-50">
          {loading ? "Оформляем..." : "Оформить заказ"}
        </button>
      </form>
    </main>
  );
}
