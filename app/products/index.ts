import { useState, useEffect } from 'react';
import { api } from '@/app/lib/api';
import { Product } from '../types';

interface APIProduct {
  id: string;
  name: string;
  price: number;
  image_url: string;
  description: string;
  rating?: number;
  sold?: number;
  location?: string;
  category?: string;
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await api.getProducts();
      const transformedProducts = data.map((product: APIProduct) => ({
        ...product,
        imageUrl: product.image_url,
      }));
      setProducts(transformedProducts);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  return {
    products,
    loading,
    error,
    refreshProducts: fetchProducts
  };
} 