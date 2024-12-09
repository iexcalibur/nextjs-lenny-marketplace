import { useState } from 'react';
import { Product } from '@/app/types';
import { api } from '@/app/lib/api';

export const useProductCard = (product: Product) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToCart = async () => {
    setIsLoading(true);
    try {
      const cartItem = {
        userId: "user123",
        productId: String(product.id),
        quantity: 1,
        price: product.price,
        name: product.name,
        imageUrl: product.image_url || product.imageUrl || ''
      };

      const data = await api.addToCart(cartItem);
      console.log('Add to cart success:', data);
      
      window.dispatchEvent(new Event('cart-updated'));
      
    } catch (error) {
      console.error('Add to cart error:', error);
      if (error instanceof TypeError || error instanceof SyntaxError) {
        alert('Network or server error. Please try again.');
      } else {
        alert(`Failed to add product to cart: ${(error as Error).message}`);
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
