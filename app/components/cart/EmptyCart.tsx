import Image from 'next/image';
import Link from 'next/link';
import logo from '@/app/assets/images/icons/logo.svg';

export default function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <Image 
        src={logo}
        alt="Lenny Logo"
        width={64}
        height={64}
        className="mb-6"
      />
      <p className="text-gray-500 text-lg mb-8">No products added. Shop with us!</p>
      <Link 
        href="/" 
        className="px-6 py-3 bg-green-800 text-white rounded-lg hover:bg-green-700 transition-colors"
      >
        Start Shopping
      </Link>
    </div>
  );
} 