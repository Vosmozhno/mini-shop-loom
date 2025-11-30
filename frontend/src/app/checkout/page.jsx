"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { ChevronLeft } from "lucide-react";
import { useCheckout } from "./useCheckout";
import CheckoutForm from "./components/CheckoutForm";
import ShippingSelect from "./components/ShippingSelect";
import OrderSummary from "./components/OrderSummary";

export default function CheckoutPage() {
  const { cart, items, clearCart } = useCart();
  
  const logic = useCheckout(cart, items, clearCart);

  if (!items || items.length === 0) {
    return (
      <main className="max-w-4xl mx-auto px-6 py-12 text-center text-white">
        <h1 className="text-3xl font-bold mb-4">Корзина пуста</h1>
        <p className="text-neutral-400 mb-8">Добавьте товары, чтобы оформить заказ.</p>
        <Link href="/catalog" className="inline-block px-8 py-3 border border-white text-white uppercase text-sm tracking-widest hover:bg-white hover:text-black transition-colors">
          Вернуться в каталог
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-12 text-white">
      <Link href="/cart" className="inline-flex items-center text-neutral-400 hover:text-white mb-8 transition-colors">
        <ChevronLeft size={20} className="mr-2" />
        Вернуться в корзину
      </Link>

      <h1 className="text-3xl sm:text-4xl font-bold uppercase tracking-wider mb-10 text-center lg:text-left">
        Оформление заказа
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
        
        <form id="checkout-form" onSubmit={logic.handlePlaceOrder} noValidate className="lg:col-span-2 space-y-12">
          
          <CheckoutForm 
            email={logic.email}
            handleEmailChange={logic.handleEmailChange}
            address={logic.address}
            handleAddressChange={logic.handleAddressChange}
            errors={logic.errors}
          />

          <ShippingSelect 
            options={logic.shippingOptions}
            selected={logic.selectedShipping}
            onChange={logic.setSelectedShipping}
            loading={logic.loadingOptions}
            currency={logic.currency}
          />

        </form>

        <div className="lg:col-span-1">
          <OrderSummary 
            items={items}
            itemsTotal={logic.itemsTotal}
            shippingPrice={logic.shippingPrice}
            grandTotal={logic.grandTotal}
            currency={logic.currency}
            isSubmitting={logic.isSubmitting}
            disabled={logic.isSubmitting || logic.loadingOptions || !logic.selectedShipping}
          />
        </div>

      </div>
    </main>
  );
}