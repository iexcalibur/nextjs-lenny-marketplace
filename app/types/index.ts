export interface Product {
  id: string | number;
  name: string;
  price: number;
  imageUrl?: string;
  image_url?: string;
  description: string;
  rating?: number;
  sold?: number;
  location?: string;
  category?: string;
}

export interface CartItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  image_url: string;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  discount: number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  discountCode?: string;
  discountAmount: number;
  createdAt: Date;
} 