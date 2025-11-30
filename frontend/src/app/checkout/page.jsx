"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { medusa } from "@/lib/medusa";

export default function CheckoutPage() {
  const { cart, loading } = useCart();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [address, setAddress] = useState({
    first_name: "",
    last_name: "",
    address_1: "",
    city: "",
    postal_code: "",
    country_code: "ru",
    phone: "",
  });
  const [shippingOptions, setShippingOptions] = useState([]);
  const [selectedShipping, setSelectedShipping] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!cart?.id) return;

    medusa.shippingOptions
      .list({ cart_id: cart.id })
      .then(({ shipping_options }) => setShippingOptions(shipping_options))
      .catch((e) => console.error("Ошибка загрузки способов доставки:", e));
  }, [cart]);

  const handleCompleteCheckout = async () => {
    if (!cart || !selectedShipping) return;
    setBusy(true);

    try {
      const res = await fetch("/api/complete-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cart_id: cart.id,
          email,
          address,
          shipping_option_id: selectedShipping,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Не удалось завершить заказ");

      localStorage.removeItem("cart_id");
      router.push(`/thank-you?order_id=${data.order.id}`);
    } catch (e) {
      console.error("Ошибка завершения заказа:", e);
      alert("Не удалось завершить заказ. Проверьте данные и повторите попытку.");
    } finally {
      setBusy(false);
    }
  };

  if (loading || !cart) return <p className="text-center py-20">Загрузка…</p>;

  return (
    <main className="max-w-3xl mx-auto py-16 px-6">
      <h1 className="text-3xl font-bold mb-10 text-center">Оформление заказа</h1>

      {/* EMAIL */}
      <div className="mb-8">
        <label className="block mb-2 text-sm uppercase tracking-widest">Email</label>
        <input
          type="email"
          className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      {/* SHIPPING ADDRESS */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <input
          placeholder="Имя"
          className="px-4 py-3 bg-neutral-900 border border-neutral-700 rounded"
          value={address.first_name}
          onChange={(e) => setAddress({ ...address, first_name: e.target.value })}
        />
        <input
          placeholder="Фамилия"
          className="px-4 py-3 bg-neutral-900 border border-neutral-700 rounded"
          value={address.last_name}
          onChange={(e) => setAddress({ ...address, last_name: e.target.value })}
        />
        <input
          placeholder="Адрес"
          className="col-span-2 px-4 py-3 bg-neutral-900 border border-neutral-700 rounded"
          value={address.address_1}
          onChange={(e) => setAddress({ ...address, address_1: e.target.value })}
        />
        <input
          placeholder="Город"
          className="px-4 py-3 bg-neutral-900 border border-neutral-700 rounded"
          value={address.city}
          onChange={(e) => setAddress({ ...address, city: e.target.value })}
        />
        <input
          placeholder="Почтовый индекс"
          className="px-4 py-3 bg-neutral-900 border border-neutral-700 rounded"
          value={address.postal_code}
          onChange={(e) => setAddress({ ...address, postal_code: e.target.value })}
        />
        <input
          placeholder="Телефон"
          className="px-4 py-3 bg-neutral-900 border border-neutral-700 rounded"
          value={address.phone}
          onChange={(e) => setAddress({ ...address, phone: e.target.value })}
        />
      </div>

      {/* SHIPPING OPTIONS */}
      <div className="mb-10">
        <h2 className="text-lg font-semibold mb-4 uppercase tracking-wider">Доставка</h2>

        {shippingOptions.length === 0 && (
          <p className="text-neutral-400">Нет доступных способов доставки</p>
        )}

        {shippingOptions.map((opt) => (
          <label key={opt.id} className="flex items-center gap-3 py-3 cursor-pointer">
            <input
              type="radio"
              name="shipping"
              checked={selectedShipping === opt.id}
              onChange={() => setSelectedShipping(opt.id)}
            />
            <div>
              <p>{opt.name}</p>
              <p className="text-sm text-neutral-400">
                {opt.amount && opt.currency_code
                  ? `${(opt.amount / 100).toFixed(2)} ${opt.currency_code.toUpperCase()}`
                  : "Цена недоступна"}
              </p>
            </div>
          </label>
        ))}
      </div>

      <button
        onClick={handleCompleteCheckout}
        disabled={busy || !selectedShipping}
        className="w-full bg-white text-black py-4 rounded font-bold disabled:opacity-30"
      >
        {busy ? "Оформляем…" : "Завершить заказ"}
      </button>
    </main>
  );
}
