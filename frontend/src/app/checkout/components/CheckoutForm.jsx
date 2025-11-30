import React from "react";
import { AlertCircle } from "lucide-react";

export default function CheckoutForm({ email, handleEmailChange, address, handleAddressChange, errors }) {
  
  const ErrorMessage = ({ message }) => {
    if (!message) return null;
    return (
        <div className="flex items-center text-red-500 text-xs mt-1 absolute -bottom-5 left-0">
            <AlertCircle size={12} className="mr-1" />{message}
        </div>
    );
  };

  const getInputClass = (hasError) => 
    `w-full bg-neutral-900 border p-3 rounded-md text-white focus:outline-none transition-colors ${
        hasError ? "border-red-500 focus:border-red-500" : "border-white/20 focus:border-white"
    }`;

  return (
    <div className="space-y-12">
      <section>
        <h2 className="text-xl uppercase tracking-widest font-semibold mb-6 border-b border-white/10 pb-2">Контакты</h2>
        <div className="flex flex-col relative pb-4">
          <label className="text-sm text-neutral-400 mb-2 uppercase tracking-wider">Email</label>
          <input type="email" name="email" value={email} onChange={handleEmailChange} className={getInputClass(!!errors.email)} placeholder="mail@example.com" />
          <ErrorMessage message={errors.email} />
        </div>
      </section>

      <section>
        <h2 className="text-xl uppercase tracking-widest font-semibold mb-6 border-b border-white/10 pb-2">Адрес доставки</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
            <div className="flex flex-col relative">
                <label className="text-sm text-neutral-400 mb-2">Имя</label>
                <input type="text" name="first_name" value={address.first_name} onChange={handleAddressChange} className={getInputClass(!!errors.first_name)} />
                <ErrorMessage message={errors.first_name} />
            </div>
            <div className="flex flex-col relative">
                <label className="text-sm text-neutral-400 mb-2">Фамилия</label>
                <input type="text" name="last_name" value={address.last_name} onChange={handleAddressChange} className={getInputClass(!!errors.last_name)} />
                <ErrorMessage message={errors.last_name} />
            </div>
            <div className="flex flex-col md:col-span-2 relative">
                <label className="text-sm text-neutral-400 mb-2">Адрес</label>
                <input type="text" name="address_1" placeholder="Улица, дом, квартира" value={address.address_1} onChange={handleAddressChange} className={getInputClass(!!errors.address_1)} />
                <ErrorMessage message={errors.address_1} />
            </div>
            <div className="flex flex-col relative">
                <label className="text-sm text-neutral-400 mb-2">Город</label>
                <input type="text" name="city" value={address.city} onChange={handleAddressChange} className={getInputClass(!!errors.city)} />
                <ErrorMessage message={errors.city} />
            </div>
            <div className="flex flex-col relative">
                <label className="text-sm text-neutral-400 mb-2">Индекс</label>
                <input type="text" name="postal_code" placeholder="123456" maxLength={6} value={address.postal_code} onChange={handleAddressChange} className={getInputClass(!!errors.postal_code)} />
                <ErrorMessage message={errors.postal_code} />
            </div>
            <div className="flex flex-col relative">
                <label className="text-sm text-neutral-400 mb-2">Телефон</label>
                <input type="tel" name="phone" placeholder="+7 (999) 000-00-00" value={address.phone} onChange={handleAddressChange} className={getInputClass(!!errors.phone)} />
                <ErrorMessage message={errors.phone} />
            </div>
        </div>
      </section>
    </div>
  );
}