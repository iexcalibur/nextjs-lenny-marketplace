'use client';
import Button from '../components/ui/Button';
import { useProducts } from './index';
import ProductCard from '@/app/components/product/ProductCard';

export default function ProductsPage() {
  const { products, loading, error } = useProducts();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!products.length) return <div>No products found</div>;

  return (
    <div className="w-full overflow-x-hidden px-4 sm:px-6 md:px-8 lg:px-32">
      <div className="text-center mb-8 sm:mb-12 md:mb-16">
        <h1 className="text-2xl sm:text-3xl md:text-[38px] font-semibold text-black mb-4">
          Popular Product on Store
        </h1>
        <p className="text-base sm:text-lg md:text-[18px] text-gray-600">
          Discover our curated collection of trending products loved by customers worldwide
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 place-items-center">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div className="flex justify-center py-8 sm:py-10 md:py-12">
        <Button 
          text="Load More" 
          bgColor="bg-white"
          textColor="text-[#1E4C2F]"
          className="border border-[#1E4C2F]"
        />
      </div>
    </div>
  );
} 