import React from "react";
import { Loader2 } from "lucide-react";

export default function ShippingSelect({ options, selected, onChange, loading, currency }) {
  return (
    <section>
      <h2 className="text-xl uppercase tracking-widest font-semibold mb-6 border-b border-white/10 pb-2">
        Способ доставки
      </h2>
      {loading ? (
        <div className="flex items-center text-neutral-400 py-4">
          <Loader2 className="animate-spin mr-3" /> Загрузка вариантов...
        </div>
      ) : options.length === 0 ? (
        <div className="p-4 border border-red-500/50 bg-red-500/10 rounded text-red-200">
          Нет доступных вариантов.
        </div>
      ) : (
        <div className="space-y-4">
          {options.map((option) => (
            <label 
              key={option.id} 
              className={`flex items-center justify-between p-4 border rounded-md cursor-pointer transition-all ${
                selected === option.id ? "border-white bg-neutral-800" : "border-white/20 hover:border-white/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <input 
                  type="radio" 
                  name="shipping" 
                  value={option.id} 
                  checked={selected === option.id} 
                  onChange={(e) => onChange(e.target.value)} 
                  className="w-4 h-4 accent-white bg-black" 
                />
                <span className="font-medium">{option.name}</span>
              </div>
              <span className="text-neutral-400">
                {option.amount > 0 ? `${(option.amount).toFixed(2)} ${currency}` : "Бесплатно"}
              </span>
            </label>
          ))}
        </div>
      )}
    </section>
  );
}