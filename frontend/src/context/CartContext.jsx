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
          } catch (err) {
            console.warn("Старая корзина не найдена, создаём новую");
          }
        }

        if (!cart) {
          // --- ИЗМЕНЕНИЕ №1 ЗДЕСЬ ---
          // Добавляем ID канала продаж при создании новой корзины
          const response = await medusa.carts.create({
            region_id: "reg_01K85W4J26QYCAR5VP64BXCM63",
            sales_channel_id: process.env.NEXT_PUBLIC_SALES_CHANNEL_ID,
          });
          cart = response.cart;
          localStorage.setItem("cart_id", cart.id);
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
    try {
      const { cart: updatedCart } = await medusa.carts.lineItems.create(cart.id, {
        variant_id: variantId,
        quantity,
      });
      setCart(updatedCart);
    } catch (e) {
      console.error("Ошибка добавления товара в корзину:", e.response || e);
    }
  };

  const updateQuantity = async (lineId, quantity) => {
    try {
      await medusa.carts.lineItems.update(cart.id, lineId, { quantity });
      const { cart: refreshedCart } = await medusa.carts.retrieve(cart.id);
      setCart(refreshedCart);
    } catch (e) {
      console.error("Ошибка обновления количества:", e);
    }
  };

  const removeItem = async (lineId) => {
    try {
      await medusa.carts.lineItems.delete(cart.id, lineId);
      const { cart: refreshedCart } = await medusa.carts.retrieve(cart.id);
      setCart(refreshedCart);
    } catch (e) {
      console.error("Ошибка удаления позиции:", e);
    }
  };

  const clearCart = async () => {
    try {
      localStorage.removeItem("cart_id");
      // --- ИЗМЕНЕНИЕ №2 ЗДЕСЬ ---
      // Добавляем ID канала продаж также при создании корзины после очистки
      const { cart: newCart } = await medusa.carts.create({
        region_id: "reg_01K85W4J26QYCAR5VP64BXCM63",
        sales_channel_id: process.env.NEXT_PUBLIC_SALES_CHANNEL_ID,
      });
      setCart(newCart);
      localStorage.setItem("cart_id", newCart.id);
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
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);