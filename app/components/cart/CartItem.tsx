import Image from 'next/image';
import { Trash2, Plus, Minus } from 'lucide-react';
import { CartItem as CartItemType } from '@/app/types';

interface CartItemProps {
  item: CartItemType;
  onQuantityChange: (productId: string, newQuantity: number) => void;
  onRemove: (productId: string) => void;
}

export default function CartItem({ item, onQuantityChange, onRemove }: CartItemProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white rounded-lg p-3 sm:p-4 shadow gap-4 sm:gap-0">
      {/* Product Info */}
      <div className="flex gap-3 sm:gap-4 w-full sm:w-auto">
        <div className="w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] rounded-lg overflow-hidden bg-[#F6F6F6] flex-shrink-0">
          <Image 
            src={item.image_url}
            alt={item.name}
            width={100}
            height={100}
            className="w-full h-full object-contain"
            unoptimized
          />
        </div>
        <div className="flex flex-col justify-center">
          <h3 className="font-semibold text-base sm:text-xl text-black mb-1 sm:mb-2">{item.name}</h3>
          <p className="font-bold text-green-800">${item.price}</p>
        </div>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 w-full sm:w-auto">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onQuantityChange(item.product_id, item.quantity - 1)}
            className="p-1 rounded-full hover:bg-gray-100 touch-manipulation"
            aria-label="Decrease quantity"
          >
            <Minus className="w-3 h-3 sm:w-4 sm:h-4 text-green-800" />
          </button>
          <span className="w-6 sm:w-8 text-center text-black font-bold text-base sm:text-lg">
            {item.quantity}
          </span>
          <button
            onClick={() => onQuantityChange(item.product_id, item.quantity + 1)}
            className="p-1 rounded-full hover:bg-gray-100 touch-manipulation"
            aria-label="Increase quantity"
          >
            <Plus className="w-3 h-3 sm:w-4 sm:h-4 text-green-800" />
          </button>
        </div>
        <button
          onClick={() => onRemove(item.product_id)}
          className="p-1.5 sm:p-2 rounded-full hover:bg-red-50 touch-manipulation"
          aria-label="Remove item"
        >
          <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 hover:text-red-600" />
        </button>
      </div>
    </div>
  );
} 