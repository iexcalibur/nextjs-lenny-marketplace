'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, User, Menu, X } from 'lucide-react';
import logo from '@/app/assets/images/icons/logo.svg';
import { api } from '@/app/lib/api';

export default function Navbar() {
  const [cartCount, setCartCount] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const cart = await api.getCart("user123");
        const count = cart.items.reduce((sum, item) => sum + item.quantity, 0);
        setCartCount(count);
      } catch (error) {
        console.error('Failed to fetch cart count:', error);
        setCartCount(0);
      }
    };

    fetchCartCount();

    window.addEventListener('cart-updated', fetchCartCount);
    return () => {
      window.removeEventListener('cart-updated', fetchCartCount);
    };
  }, []);

  return (
    <nav className="bg-white shadow-sm fixed w-full top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-32 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image 
              src={logo} 
              alt="Lenny Logo" 
              width={32} 
              height={32}
              className="rounded-lg"
            />
            <span className="text-lg sm:text-xl font-bold text-black">lenny.</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/cart" className="p-2 hover:bg-gray-100 rounded-full relative">
              <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-green-800 text-white text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <Link href="/profile" className="p-2 hover:bg-gray-100 rounded-full">
              <User className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 hover:bg-gray-100 rounded-full"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-gray-600" />
            ) : (
              <Menu className="h-6 w-6 text-gray-600" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col gap-4">
              <Link 
                href="/cart" 
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                <ShoppingCart className="h-5 w-5 text-gray-600" />
                <span className="text-gray-600">Cart</span>
                {cartCount > 0 && (
                  <span className="bg-green-800 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center ml-auto">
                    {cartCount}
                  </span>
                )}
              </Link>
              <Link 
                href="/profile" 
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                <User className="h-5 w-5 text-gray-600" />
                <span className="text-gray-600">Profile</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
} 