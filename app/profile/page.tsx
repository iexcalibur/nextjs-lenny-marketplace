'use client';
import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import AccountSummary from '../components/profile/AccountSummary';
import ProductCard from '../components/product/ProductCard';
import { Product } from '../types';

interface OrderItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  user_id: string;
  items: OrderItem[];
  total_amount: number;
  discount_code: string;
  discount_amount: number;
  created_at: string;
}

export default function ProfilePage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersData, productsData] = await Promise.all([
          api.getOrders("user123"),
          api.getProducts()
        ]);
        
        // Randomly select 4 products for trending
        const shuffled = [...productsData].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 4);
        
        setOrders(ordersData);
        setTrendingProducts(selected);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, []);

  const calculateSummary = () => {
    const totalItems = orders.reduce((sum, order) => 
      sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
    );

    const totalPurchase = orders.reduce((sum, order) => sum + order.total_amount, 0);

    const discountCodes = orders
      .filter(order => order.discount_code)
      .map(order => order.discount_code);

    const totalDiscount = orders.reduce((sum, order) => sum + order.discount_amount, 0);

    return {
      totalItems,
      totalPurchase,
      discountCodes,
      totalDiscount
    };
  };

  return (
    <div className="min-h-screen bg-white w-full overflow-x-hidden">
      {/* Header Banner */}
      <div className="w-full h-[150px] sm:h-[200px] md:h-[250px] bg-gray-200">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-32 h-full flex items-center">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-black">Account Summary</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-32 py-4 sm:py-6 md:py-8">
        <div className="max-w-[1200px] mx-auto">
          <div className="relative -mt-[50px] sm:-mt-[75px] md:-mt-[100px] space-y-4 sm:space-y-6 md:space-y-8">
            {/* Account Summary Card */}
            <div className="bg-white p-4 sm:p-6 md:p-8 rounded-lg border-[0.5px] border-gray-200">
              <AccountSummary summary={calculateSummary()} />
            </div>

            {/* Trending Products Section */}
            <div className="bg-white p-4 sm:p-6 md:p-8 rounded-lg border-[0.5px] border-gray-200">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-black mb-4 sm:mb-6 md:mb-8">
                Trending Products
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 place-items-center">
                {trendingProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 