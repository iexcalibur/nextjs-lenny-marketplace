import { useState } from 'react';
import { Product } from '@/app/types';
import { api } from '@/app/lib/api';

export const useProductCard = (product: Product) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToCart = async () => {
    setIsLoading(true);
    try {
      // First check if the product is already in the cart
      const cart = await api.getCart("user123");
      const existingItem = cart.items.find(
        item => String(item.product_id) === String(product.id)
      );

      if (existingItem) {
        // Update existing item quantity
        await api.updateCartItem(String(product.id), {
          userId: "user123",
          quantity: existingItem.quantity + 1
        });
      } else {
        // Add new item
        await api.addToCart({
          userId: "user123",
          productId: String(product.id),
          quantity: 1,
          price: product.price,
          name: product.name,
          imageUrl: product.imageUrl || ''
        });
      }

      // Notify other components about cart update
      window.dispatchEvent(new Event('cart-updated'));
      
    } catch (error) {
      console.error('Cart update error:', error);
      if (error instanceof TypeError || error instanceof SyntaxError) {
        alert('Network or server error. Please try again.');
      } else {
        alert(`Failed to update cart: ${(error as Error).message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleAddToCart
  };
};
