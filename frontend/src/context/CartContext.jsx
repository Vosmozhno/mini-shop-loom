"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { medusa } from "@/lib/medusa";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initCart() {
      try {
        let cart;
        const cartId = localStorage.getItem("cart_id");

        if (cartId) {
  
          try {
            const response = await medusa.carts.retrieve(cartId);
            cart = response.cart;
            console.log("Загружена существующая корзина:", cart);
          } catch (err) {
            console.warn("Старая корзина не найдена, создаём новую");
          }
        }

        if (!cart) {
          const response = await medusa.carts.create({
            region_id: "reg_01K60RPE6D6HS0EQ71DVRBT35A",
          });
          cart = response.cart;
          localStorage.setItem("cart_id", cart.id);
          console.log("Создана новая корзина:", cart);
        }

        setCart(cart);
      } catch (e) {
        console.error("Ошибка инициализации корзины:", e);
      } finally {
        setLoading(false);
      }
    }

    initCart();
  }, []);



  const addItem = async (variantId, quantity = 1) => {
    if (!cart) {
      console.error("Корзина ещё не инициализирована");
      return;
    }

    if (!variantId) {
      console.error("variantId не передан");
      return;
    }

    try {
      console.log("Добавляем в корзину:", { cartId: cart.id, variantId, quantity });
      const response = await medusa.carts.lineItems.create(cart.id, {
        variant_id: variantId,
        quantity,
      });
      console.log("Добавлено в корзину:", response.cart);
      setCart(response.cart);
    } catch (e) {
      console.error("Ошибка добавления товара в корзину:", e.response || e);
    }
  };

  const updateQuantity = async (lineId, quantity) => {
    try {
      const { cart: updated } = await medusa.carts.lineItems.update(cart.id, lineId, { quantity });
      setCart(updated);
    } catch (e) {
      console.error("Ошибка обновления количества:", e);
    }
  };

  const removeItem = async (lineId) => {
  try {
    const { cart: updatedCart } = await medusa.carts.lineItems.delete(cart.id, lineId);

    setCart(updatedCart);

  } catch (e) {
    console.error("Ошибка удаления позиции:", e);
  }
};

 const clearCart = async () => {
    try {
      localStorage.removeItem("cart_id");

      const { cart: newCart } = await medusa.carts.create({
        region_id: "reg_01K60RPE6D6HS0EQ71DVRBT35A",
      });

      setCart(newCart);

      localStorage.setItem("cart_id", newCart.id);

      console.log("Корзина очищена и создана новая:", newCart);
    } catch (e) {
      console.error("Ошибка при очистке корзины:", e);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        items: cart?.items || [],
        loading,
        addItem,
        updateQuantity,
        removeItem,
        clearCart, // <-- 5. Добавляем новую функцию в контекст
      }}
    >
      {children}
    </CartContext.Provider>
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        items: cart?.items || [],
        loading,
        addItem,
        updateQuantity,
        removeItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
