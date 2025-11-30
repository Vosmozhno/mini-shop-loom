import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { medusa } from "@/lib/medusa";

export function useCheckout(cart, items, clearCart) {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [address, setAddress] = useState({
    first_name: "", last_name: "", address_1: "",
    city: "", postal_code: "", country_code: "ru", phone: "",
  });
  const [errors, setErrors] = useState({});
  const [shippingOptions, setShippingOptions] = useState([]);
  const [selectedShipping, setSelectedShipping] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingOptions, setLoadingOptions] = useState(false);

  const currency = cart?.region?.currency_code?.toUpperCase() || "RUB";

  const itemsTotal = items?.reduce((sum, item) => sum + item.unit_price * item.quantity, 0) || 0;
  const selectedOptionData = shippingOptions.find(o => o.id === selectedShipping);
  const shippingPrice = selectedOptionData ? selectedOptionData.amount : 0;
  const grandTotal = itemsTotal + shippingPrice;

  useEffect(() => {
    async function loadShipping() {
      if (!cart?.id) return;
      setLoadingOptions(true);
      try {
        const { shipping_options } = await medusa.store.fulfillment.listCartOptions({ cart_id: cart.id });
        setShippingOptions(shipping_options);
        if (shipping_options.length > 0 && !selectedShipping) {
          setSelectedShipping(shipping_options[0].id);
        }
      } catch (err) {
        console.error("Ошибка загрузки доставки:", err);
      } finally {
        setLoadingOptions(false);
      }
    }
    loadShipping();
  }, [cart?.id]);

  const formatPhoneNumber = (value) => {
    const phone = value.replace(/\D/g, "");
    if (!phone) return "";
    if (["7", "8", "9"].includes(phone[0])) {
      let formatted = "+7 ";
      if (phone.length > 1) formatted += "(" + phone.substring(1, 4);
      if (phone.length >= 5) formatted += ") " + phone.substring(4, 7);
      if (phone.length >= 8) formatted += "-" + phone.substring(7, 9);
      if (phone.length >= 10) formatted += "-" + phone.substring(9, 11);
      return formatted;
    }
    return "+" + phone;
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email) newErrors.email = "Введите Email";
    else if (!emailRegex.test(email)) newErrors.email = "Некорректный формат";

    if (!address.first_name.trim()) newErrors.first_name = "Введите имя";
    if (!address.last_name.trim()) newErrors.last_name = "Введите фамилию";
    if (!address.address_1.trim()) newErrors.address_1 = "Введите адрес";
    if (!address.city.trim()) newErrors.city = "Введите город";
    
    if (!address.postal_code) newErrors.postal_code = "Введите индекс";
    else if (address.postal_code.replace(/\D/g, '').length !== 6) newErrors.postal_code = "6 цифр";

    const rawPhone = address.phone.replace(/\D/g, '');
    if (!address.phone) newErrors.phone = "Введите телефон";
    else if (rawPhone.length < 11) newErrors.phone = "Некорректный номер";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddressChange = (e) => {
    let value = e.target.value;
    const name = e.target.name;
    if (name === "phone") value = formatPhoneNumber(value);
    setAddress({ ...address, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: null });
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (errors.email) setErrors({ ...errors, email: null });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
    }
    if (!cart?.id) return;

    setIsSubmitting(true);
    try {
      await medusa.store.cart.update(cart.id, {
        email, shipping_address: address, billing_address: address,
      });

      if (selectedShipping) {
        await medusa.store.cart.addShippingMethod(cart.id, { option_id: selectedShipping });
      }

      const { payment_collection } = await medusa.client.fetch(`/store/payment-collections`, {
        method: "POST", body: { cart_id: cart.id }
      });

      await medusa.client.fetch(`/store/payment-collections/${payment_collection.id}/payment-sessions`, {
        method: "POST", body: { provider_id: "pp_system_default" }
      });

      const response = await medusa.store.cart.complete(cart.id);

      if (response.type === "order") {
        await clearCart();
        router.push(`/thank-you/${response.order.id}`);
      } else {
        alert("Не удалось завершить заказ.");
      }
    } catch (error) {
      console.error(error);
      alert("Ошибка при оформлении.");
    } finally {
  
      setIsSubmitting(false);
    }
  };

  return {
    email, handleEmailChange,
    address, handleAddressChange,
    shippingOptions, selectedShipping, setSelectedShipping,
    loadingOptions, isSubmitting, handlePlaceOrder,
    errors, currency, itemsTotal, shippingPrice, grandTotal
  };
}