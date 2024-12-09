import { CartItem } from '@/app/types';

const API_BASE = 'http://localhost:8080/api';

export const api = {
  // Product APIs
  async getProducts() {
    try {
      const res = await fetch(`${API_BASE}/products`, {
        headers: {
          'Accept': 'application/json'
        },
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Failed to fetch products');
      return res.json();
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  // Add to Cart API
  async addToCart(cartItem: {
    userId: string;
    productId: string;
    quantity: number;
    price: number;
    name: string;
    imageUrl: string;
  }) {
    try {
      const response = await fetch(`${API_BASE}/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(cartItem),
        credentials: 'include'
      });

      const responseText = await response.text();
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return responseText ? JSON.parse(responseText) : null;
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  },

  // Cart APIs
  async getCart(userId: string): Promise<{ items: CartItem[] }> {
    try {
      const response = await fetch(`${API_BASE}/cart?userId=${userId}`, {
        headers: {
          'Accept': 'application/json'
        },
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Failed to fetch cart');
      }
      const data = await response.json();
      return {
        items: data.items || []
      };
    } catch (error) {
      console.error('Error fetching cart:', error);
      throw error;
    }
  },

  // Update Cart Item quantity API
  async updateCartItem(productId: string, data: { userId: string; quantity: number }) {
    try {
      const res = await fetch(`${API_BASE}/cart/${productId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          userId: data.userId,
          quantity: data.quantity
        }),
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Failed to update cart item');
      return res.json();
    } catch (error) {
      console.error('Error updating cart item:', error);
      throw error;
    }
  },

  // Remove Item from Cart API
  async removeFromCart(productId: string, userId: string) {
    try {
      const res = await fetch(`${API_BASE}/cart/${productId}?userId=${userId}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json'
        },
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Failed to remove from cart');
      return res.json();
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  },

  // Checkout API
  async checkout(userId: string, discountCode?: string) {
    try {
      const res = await fetch(`${API_BASE}/cart/checkout`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          userId,
          discountCode
        }),
        credentials: 'include'
      });
      
      if (!res.ok) throw new Error('Checkout failed');
      return res.json();
    } catch (error) {
      console.error('Error during checkout:', error);
      throw error;
    }
  },

  // Get active promo API
  async getActivePromo() {
    try {
      const res = await fetch(`${API_BASE}/admin/discount/active`, {
        headers: {
          'Accept': 'application/json'
        },
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Failed to fetch active promo');
      return res.json();
    } catch (error) {
      console.error('Error fetching active promo:', error);
      throw error;
    }
  },

  // Generate promo API
  async generatePromo(data: { code: string; discount_rate: number }) {
    try {
      const res = await fetch(`${API_BASE}/admin/discount`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(data),
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Failed to generate promo');
      return res.json();
    } catch (error) {
      console.error('Error generating promo:', error);
      throw error;
    }
  },

  // Get orders API
  async getOrders(userId: string) {
    try {
      const res = await fetch(`${API_BASE}/orders?userId=${userId}`, {
        headers: {
          'Accept': 'application/json'
        },
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Failed to fetch orders');
      return res.json();
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },
}; 