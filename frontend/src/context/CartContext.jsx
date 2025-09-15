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
        const cartId = localStorage.getItem("cart_id");
        if (cartId) {
          const { cart } = await medusa.carts.retrieve(cartId);
          setCart(cart);
        } else {
          const { cart } = await medusa.carts.create();
          localStorage.setItem("cart_id", cart.id);
          setCart(cart);
        }
      } catch (e) {
        console.error("Ошибка загрузки корзины:", e);
      } finally {
        setLoading(false);
      }
    }
    initCart();
  }, []);

  const addItem = async (variantId, quantity = 1) => {
    if (!cart) return;
    try {
      const { cart: updated } = await medusa.carts.lineItems.create(cart.id, {
        variant_id: variantId,
        quantity,
      });
      setCart(updated);
    } catch (e) {
      console.error("Ошибка добавления товара в корзину:", e);
    }
  };

  const updateQuantity = async (lineId, quantity) => {
    try {
      const { cart: updated } = await medusa.carts.lineItems.update(
        cart.id,
        lineId,
        { quantity }
      );
      setCart(updated);
    } catch (e) {
      console.error("Ошибка обновления количества:", e);
    }
  };

  const removeItem = async (lineId) => {
  try {
    await medusa.carts.lineItems.delete(cart.id, lineId);
    const { cart: refreshed } = await medusa.carts.retrieve(cart.id); // <-- перезагружаем корзину
    setCart(refreshed);
  } catch (e) {
    console.error("Ошибка удаления позиции:", e);
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
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
