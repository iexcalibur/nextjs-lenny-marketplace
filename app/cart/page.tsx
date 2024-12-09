'use client';
import { useCart } from './index';
import { useState, useEffect } from 'react';
import CartItem from '../components/cart/CartItem';
import ProductCard from '../components/product/ProductCard';
import ProductSummaryCard from '../components/cart/ProductSummaryCard';
import EmptyCart from '../components/cart/EmptyCart';
import { Product } from '../types';
import { api } from '../lib/api';

export default function CartPage() {
  const { 
    cartItems, 
    promoInput, 
    promoError,
    totals: rawTotals,
    setPromoInput, 
    handleApplyPromo, 
    handleQuantityChange, 
    handleRemove,
    handleCheckout,
    isPromoApplied,
    appliedPromoCode,
    clearPromoCode
  } = useCart();

  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);

  const totals = {
    subtotal: parseFloat(rawTotals.subtotal),
    discount: parseFloat(rawTotals.discount),
    total: parseFloat(rawTotals.total)
  };

  useEffect(() => {
    const fetchTrendingProducts = async () => {
      try {
        const products = await api.getProducts();
        const shuffled = [...products].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 4);
        setTrendingProducts(selected);
      } catch (error) {
        console.error('Failed to fetch trending products:', error);
      }
    };

    fetchTrendingProducts();
  }, []);

  return (
    <div className="min-h-screen bg-white w-full overflow-x-hidden">
      <div className="w-full h-[150px] sm:h-[200px] md:h-[250px] bg-gray-200">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-32 h-full flex items-center">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-black">Shopping Cart</h1>
        </div>
      </div>
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-32 py-4 sm:py-6 md:py-8">
        <div className="space-y-4 sm:space-y-6 md:space-y-8">
          {cartItems.length > 0 ? (
            <div className="relative -mt-[50px] sm:-mt-[75px] md:-mt-[100px]">
              <div className="max-w-[1200px] mx-auto">
                <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 justify-center">
                  <div className="w-full lg:w-[65%] space-y-4 bg-white p-4 sm:p-6 md:p-8 rounded-lg relative border-[0.5px] border-gray-200">
                    {cartItems.map((item, index) => (
                      <CartItem
                        key={`${item.product_id}-${index}`}
                        item={item}
                        onQuantityChange={handleQuantityChange}
                        onRemove={handleRemove}
                      />
                    ))}
                  </div>
                  <div className="w-full lg:w-[35%] lg:max-w-[400px]">
                    <ProductSummaryCard
                      promoInput={promoInput}
                      promoError={promoError}
                      totals={totals}
                      onPromoInputChange={setPromoInput}
                      onApplyPromo={handleApplyPromo}
                      onCheckout={handleCheckout}
                      isPromoApplied={isPromoApplied}
                      appliedPromoCode={appliedPromoCode}
                      onClearPromo={clearPromoCode}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative -mt-[50px] sm:-mt-[75px] md:-mt-[100px] max-w-[800px] mx-auto">
              <div className="bg-white p-4 sm:p-6 md:p-8 rounded-lg border-[0.5px] border-gray-200">
                <EmptyCart />
              </div>
            </div>
          )}

          <div className="max-w-[1200px] mx-auto">
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