import Medusa from "@medusajs/medusa-js";
import { NextResponse } from "next/server";

const medusa = new Medusa({
  baseUrl: process.env.NEXT_PUBLIC_MEDUSA_URL,
  apiKey: process.env.MEDUSA_ADMIN_API_KEY,
});

export async function POST(req) {
  try {
    const { cart_id, email, address, shipping_option_id } = await req.json();

    if (!cart_id || !email || !address || !shipping_option_id) {
      return NextResponse.json(
        { error: "cart_id, email, address and shipping_option_id are required" },
        { status: 400 }
      );
    }

    // Обновляем email и адреса
    await medusa.carts.update(cart_id, {
      email,
      shipping_address: address,
      billing_address: address,
    });

    // Добавляем выбранный способ доставки
    await medusa.carts.addShippingMethod(cart_id, { option_id: shipping_option_id });

    // Только manual payment (Publishable key не нужен)
    await medusa.carts.setPaymentSession(cart_id, { provider_id: "manual" });

    // Завершаем заказ
    const { order } = await medusa.carts.complete(cart_id);

    return NextResponse.json({ order }, { status: 200 });
  } catch (e) {
    console.error("Ошибка при завершении заказа:", e.response?.data || e.message);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
