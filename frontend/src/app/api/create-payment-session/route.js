import Medusa from "@medusajs/medusa-js";

const medusa = new Medusa({
  baseUrl: process.env.NEXT_PUBLIC_MEDUSA_URL || "http://localhost:9000/store",
  publishableApiKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
});

export async function POST(req) {
  try {
    const { cartId, customer } = await req.json();

    if (!cartId || !customer) {
      return new Response(JSON.stringify({ error: "cartId and customer are required" }), { status: 400 });
    }

    // Форматируем и валидируем данные
    const phone = customer.phone.startsWith("+")
      ? customer.phone.replace(/\s/g, "")
      : `+7${customer.phone.replace(/\D/g, "").slice(-10)}`;

    const postal_code = (customer.postalCode || "123456").replace(/\D/g, "").slice(0, 6);
    const city = customer.city || "Москва";

    if (!/^\+\d{10,15}$/.test(phone)) {
      return new Response(JSON.stringify({ error: "Телефон должен быть в формате +7XXXXXXXXXX" }), { status: 400 });
    }
    if (!/^\d{6}$/.test(postal_code)) {
      return new Response(JSON.stringify({ error: "Почтовый индекс должен быть 6 цифр" }), { status: 400 });
    }
    if (!/\S+@\S+\.\S+/.test(customer.email)) {
      return new Response(JSON.stringify({ error: "Некорректный email" }), { status: 400 });
    }

    // Обновляем корзину
    await medusa.carts.update(cartId, {
      region_id: "reg_01K5EN1H5M4MAYFNP22D517X82",
      shipping_address: {
        first_name: customer.name,
        last_name: customer.lastName || "",
        address_1: customer.address,
        city,
        postal_code,
        phone,
			},
      email: customer.email,
    });

    // Создаём платежную сессию
    await medusa.carts.createPaymentSessions(cartId);
    await medusa.carts.setPaymentSession(cartId, { provider_id: "manual" });


    // Завершаем корзину (создаём заказ)
    const { type, data } = await medusa.carts.complete(cartId);

    if (type === "order") {
      return new Response(JSON.stringify({ orderId: data.id }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      return new Response(JSON.stringify({ error: "Не удалось создать заказ" }), { status: 500 });
    }
  } catch (err) {
    console.error("Ошибка Medusa:", JSON.stringify(err, null, 2));
    return new Response(JSON.stringify({ error: err.message || "Ошибка при оформлении заказа" }), { status: 500 });
  }
}
