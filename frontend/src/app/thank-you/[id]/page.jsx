"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { medusa } from "@/lib/medusa";
import { CheckCircle, Loader2, Package, MapPin } from "lucide-react";

export default function ThankYouPage() {
  const params = useParams();
  const orderId = params?.id;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!orderId) return;

    async function fetchOrder() {
      try {
        const { order } = await medusa.store.order.retrieve(orderId, {
          fields: "+items.thumbnail,+items.product.title,+shipping_address",
        });
        
        setOrder(order);
      } catch (err) {
        console.error("Ошибка получения заказа:", err);
        setError("Не удалось загрузить данные заказа.");
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [orderId]);

  const formatPrice = (amount, currencyCode) => {
    if (amount === undefined || amount === null) return "0.00";
    
    const value = amount; 

    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: currencyCode?.toUpperCase() || "RUB",
    }).format(value);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-black">
        <Loader2 className="w-10 h-10 animate-spin text-neutral-500" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <main className="max-w-4xl mx-auto px-6 py-20 text-center text-white">
        <h1 className="text-3xl font-bold mb-4 text-red-500">Ошибка</h1>
        <p className="text-neutral-400 mb-8">{error || "Заказ не найден"}</p>
        <Link 
          href="/" 
          className="inline-block px-8 py-3 border border-white text-white uppercase text-sm tracking-widest hover:bg-white hover:text-black transition-colors"
        >
          На главную
        </Link>
      </main>
    );
  }

  const shippingTotal = order.shipping_total || 0;
  const taxTotal = order.tax_total || 0;
  const grandTotal = order.total || 0;
  
  const calculatedSubtotal = grandTotal - shippingTotal - taxTotal;

  return (
    <main className="max-w-4xl mx-auto px-6 py-12 text-white">
      
      <div className="text-center mb-16">
        <div className="flex justify-center mb-6">
          <CheckCircle className="w-20 h-20 text-green-500" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-wider mb-4">
          Спасибо за заказ!
        </h1>
        <p className="text-neutral-400 text-lg">
          Номер заказа: <span className="text-white font-mono">#{order.display_id}</span>
        </p>
        <p className="text-sm text-neutral-500 mt-2">
          Подтверждение отправлено на {order.email}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-white/10 pt-12">
        
        <div className="md:col-span-2 space-y-8">
          <h2 className="text-xl uppercase tracking-widest font-semibold flex items-center gap-2">
            <Package size={20} /> Состав заказа
          </h2>
          
          <div className="space-y-6">
            {order.items?.map((item) => (
              <div key={item.id} className="flex gap-4 items-start bg-neutral-900/50 p-4 rounded-lg">
                <div className="w-20 h-24 bg-neutral-800 rounded overflow-hidden flex-shrink-0">
                  {item.thumbnail ? (
                    <img 
                      src={item.thumbnail} 
                      alt={item.title} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-600 text-xs">
                      No img
                    </div>
                  )}
                </div>

                <div className="flex-1 flex flex-col justify-between h-24">
                  <div>
                    <h3 className="font-medium text-lg">{item.product_title || item.title}</h3>
                    <p className="text-sm text-neutral-400">
                        {item.variant_title !== "Default Variant" ? item.variant_title : ""}
                    </p>
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="text-sm text-neutral-500">Кол-во: {item.quantity}</span>
                    <span className="font-semibold">
                      {formatPrice(item.unit_price * item.quantity, order.currency_code)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-1 space-y-8">
          
          <div>
            <h2 className="text-xl uppercase tracking-widest font-semibold mb-4 flex items-center gap-2">
              <MapPin size={20} /> Доставка
            </h2>
            <div className="bg-neutral-900 p-6 rounded-lg text-sm text-neutral-300 space-y-1">
              <p className="text-white font-medium mb-2">
                {order.shipping_address?.first_name} {order.shipping_address?.last_name}
              </p>
              <p>{order.shipping_address?.address_1}</p>
              {order.shipping_address?.address_2 && <p>{order.shipping_address?.address_2}</p>}
              <p>
                {order.shipping_address?.postal_code}, {order.shipping_address?.city}
              </p>
              <p className="uppercase mt-2 text-xs text-neutral-500">
                {order.shipping_address?.country_code}
              </p>
            </div>
          </div>

          <div className="bg-neutral-800 p-6 rounded-lg">
            <h3 className="text-lg uppercase font-semibold mb-4 border-b border-white/10 pb-2">
              Итого
            </h3>
            <div className="space-y-3 text-sm">
              
              <div className="flex justify-between text-neutral-400">
                <span>Подытог</span>
                <span>{formatPrice(calculatedSubtotal, order.currency_code)}</span>
              </div>
              
              <div className="flex justify-between text-neutral-400">
                <span>Доставка</span>
                <span>{formatPrice(shippingTotal, order.currency_code)}</span>
              </div>
              
              {taxTotal > 0 && (
                <div className="flex justify-between text-neutral-400">
                  <span>Налог</span>
                  <span>{formatPrice(taxTotal, order.currency_code)}</span>
                </div>
              )}
              
              <div className="flex justify-between text-xl font-bold text-white pt-4 border-t border-white/10 mt-2">
                <span>Всего</span>
                <span>{formatPrice(grandTotal, order.currency_code)}</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      <div className="mt-16 text-center space-y-4 md:space-y-0 md:space-x-4 flex flex-col md:flex-row justify-center">
        <Link 
          href="/catalog" 
          className="inline-flex items-center justify-center px-8 py-4 bg-white text-black font-bold uppercase tracking-widest hover:bg-neutral-200 transition-colors rounded"
        >
          Продолжить покупки
        </Link>
      </div>
    </main>
  );
}