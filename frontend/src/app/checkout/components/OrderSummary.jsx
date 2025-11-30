import React from "react";
import { Loader2 } from "lucide-react";

export default function OrderSummary({ items, itemsTotal, shippingPrice, grandTotal, currency, isSubmitting, disabled }) {
  return (
    <div className="bg-neutral-800 rounded-lg p-8 sticky top-32">
        <h2 className="text-xl uppercase font-semibold mb-6 tracking-wider">Ваш заказ</h2>
        
        <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
            {items.map(item => (
                <div key={item.id} className="flex gap-4 border-b border-white/5 pb-4 last:border-0">
                    {item.thumbnail && (
                      <div className="w-12 h-12 bg-black rounded overflow-hidden flex-shrink-0">
                        <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex justify-between text-sm font-medium">
                          <span className="uppercase">{item.product_title || item.title}</span>
                          <span>{(item.unit_price * item.quantity).toFixed(2)} {currency}</span>
                      </div>
                      <div className="text-xs text-neutral-400 mt-1">
                        {item.quantity} x {item.unit_price} {currency}
                      </div>
                    </div>
                </div>
            ))}
        </div>

        <div className="border-t border-white/10 pt-4 space-y-2">
            <div className="flex justify-between text-neutral-400 text-sm">
                <span>Товары</span>
                <span>{itemsTotal.toFixed(2)} {currency}</span>
            </div>
            <div className="flex justify-between text-neutral-400 text-sm">
                <span>Доставка</span>
                <span>{shippingPrice > 0 ? `${shippingPrice.toFixed(2)} ${currency}` : "Бесплатно"}</span>
            </div>
            <div className="flex justify-between items-center text-xl font-bold text-white pt-2 border-t border-white/10 mt-2">
                <span>Итого</span>
                <span>{grandTotal.toFixed(2)} {currency}</span>
            </div>
        </div>

        <button 
            form="checkout-form" 
            type="submit" 
            disabled={disabled} 
            className="mt-8 w-full bg-white text-black py-4 uppercase font-bold tracking-widest rounded hover:bg-neutral-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
        >
            {isSubmitting ? <><Loader2 className="animate-spin mr-2" /> Обработка...</> : "Оплатить заказ"}
        </button>
        
        <p className="text-xs text-neutral-500 mt-4 text-center">
            Нажимая кнопку, вы соглашаетесь с условиями обработки персональных данных.
        </p>
    </div>
  );
}