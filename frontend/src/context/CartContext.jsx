"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { medusa } from "@/lib/medusa";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshCart = async (cartId) => {
    try {
      const { cart: refreshed } = await medusa.store.cart.retrieve(cartId, {
        fields: "+items.thumbnail,+items.product.title",
      });
      setCart(refreshed);
    } catch (e) {
      console.error("Ошибка обновления корзины:", e);
      if (e.status === 404) {
        localStorage.removeItem("cart_id");
        setCart(null);
      }
    }
  };

  const createNewCart = async () => {
    try {
      const { regions } = await medusa.store.region.list();

      if (!regions || regions.length === 0) {
        console.error("Нет регионов. Убедитесь, что вы запустили 'medusa seed'");
        return;
      }

      const regionId = regions[0].id;

      const { cart: newCart } = await medusa.store.cart.create({
        region_id: regionId,
        shipping_address: {
          country_code: "ru",
        },
      });
      
      localStorage.setItem("cart_id", newCart.id);
      setCart(newCart);
    } catch (e) {
      console.error("Ошибка создания корзины:", e);
    }
  };

  useEffect(() => {
    async function init() {
      const cartId = localStorage.getItem("cart_id");
      if (cartId) {
        await refreshCart(cartId);
      } else {
        await createNewCart();
      }
      setLoading(false);
    }
    init();
  }, []);

  const addItem = async (variantId, quantity = 1) => {
    if (!cart?.id) await createNewCart();
    
    const currentCartId = cart?.id || localStorage.getItem("cart_id");

    try {
      await medusa.store.cart.createLineItem(currentCartId, {
        variant_id: variantId,
        quantity,
      });
      await refreshCart(currentCartId);
    } catch (e) {
      console.error("Ошибка добавления:", e);
    }
  };

  const removeItem = async (lineId) => {
    try {
      await medusa.store.cart.deleteLineItem(cart.id, lineId);
      await refreshCart(cart.id);
    } catch (e) {
      console.error("Ошибка удаления:", e);
    }
  };

  const updateQuantity = async (lineId, quantity) => {
    try {
      await medusa.store.cart.updateLineItem(cart.id, lineId, { quantity });
      await refreshCart(cart.id);
    } catch (e) {
      console.error("Ошибка обновления кол-ва:", e);
    }
  };

  const clearCart = async () => {
    localStorage.removeItem("cart_id");
    setCart(null);
    await createNewCart();
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