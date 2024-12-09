import { Product } from '@/app/types';
import Image from 'next/image';
import Button from '../ui/Button';
import { useProductCard } from './index';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { isLoading, handleAddToCart } = useProductCard(product);

  return (
    <div className="bg-white rounded-lg overflow-hidden w-[278px] h-[415px]">
      <div className="relative h-[280px] bg-gray-200 rounded-lg">
        <Image
          src={product.image_url || product.imageUrl || ''}
          alt={product.name}
          fill
          className="object-contain"
          unoptimized
        />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-black truncate max-w-[180px]">{product.name}</h3>
          <p className="text-green-600 font-bold">${product.price}</p>
        </div>
        <Button
          text={isLoading ? 'Adding...' : 'Add to Cart'}
          onClick={handleAddToCart}
          className="w-full"
       
        />
      </div>
    </div>
  );
}
