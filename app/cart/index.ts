import { useState, useEffect } from 'react';
import { api } from '@/app/lib/api';
import { CartItem } from '@/app/types';
import { useRouter } from 'next/navigation';

export const useCart = () => {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [promoCode, setPromoCode] = useState<string>('');
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');
  const [isPromoApplied, setIsPromoApplied] = useState(false);
  const [appliedPromoCode, setAppliedPromoCode] = useState('');

  // Calculate totals
  const calculateTotals = () => {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = isPromoApplied ? subtotal * 0.2 : 0;
    const total = subtotal - discount;

    return {
      subtotal: subtotal.toFixed(2),
      discount: discount.toFixed(2),
      total: total.toFixed(2)
    };
  };

  const fetchCart = async () => {
    try {
      const cart = await api.getCart("user123");
      console.log('Fetched cart data:', cart);
      setCartItems(cart.items || []);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      setCartItems([]);
    }
  };

  const fetchPromoCode = async () => {
    try {
      const promo = await api.getActivePromo();
      setPromoCode(promo.code || '');
    } catch (error) {
      console.error('Failed to fetch promo:', error);
      setPromoCode('');
    }
  };

  useEffect(() => {
    fetchCart();
    fetchPromoCode();
    
    const handleCartUpdate = () => {
      console.log('Cart update event received');
      setTimeout(fetchCart, 100);
    };
    
    window.addEventListener('cart-updated', handleCartUpdate);
    return () => {
      window.removeEventListener('cart-updated', handleCartUpdate);
    };
  }, []);

  const handleQuantityChange = async (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      await handleRemove(productId);
      return;
    }
    try {
      await api.updateCartItem(productId, { userId: "user123", quantity: newQuantity });
      await fetchCart();
      window.dispatchEvent(new Event('cart-updated'));
    } catch (error) {
      console.error('Failed to update quantity:', error);
    }
  };

  const handleRemove = async (productId: string) => {
    try {
      await api.removeFromCart(productId, "user123");
      await fetchCart();
      window.dispatchEvent(new Event('cart-updated'));
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  };

  const handleApplyPromo = async () => {
    try {
      setPromoError('');
      if (!promoInput.trim()) return;
      
      const response = await api.getActivePromo();
      if (response.code === promoInput.trim().toUpperCase()) {
        setAppliedPromoCode(promoInput.trim().toUpperCase());
        setIsPromoApplied(true);
        setPromoCode(response.code);
        setPromoInput('');
      } else {
        setPromoError('Invalid promo code');
        setTimeout(() => {
          setPromoError('');
        }, 3000);
      }
    } catch (error) {
      console.error('Failed to apply promo:', error);
      setPromoError('Invalid promo code');
      setTimeout(() => {
        setPromoError('');
      }, 3000);
    }
  };

  const clearPromoCode = () => {
    setIsPromoApplied(false);
    setAppliedPromoCode('');
    setPromoCode('');
    setPromoInput('');
  };

  const handleCheckout = async () => {
    try {
      await api.checkout("user123", appliedPromoCode || undefined);
      window.dispatchEvent(new Event('cart-updated'));
      router.push('/');
    } catch (error) {
      console.error('Checkout failed:', error);
      alert('Failed to checkout. Please try again.');
    }
  };

  return {
    cartItems,
    promoCode,
    promoInput,
    promoError,
    totals: calculateTotals(),
    setPromoInput,
    handleApplyPromo,
    handleQuantityChange,
    handleRemove,
    handleCheckout,
    isPromoApplied,
    appliedPromoCode,
    clearPromoCode
  };
};
