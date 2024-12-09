'use client';
import ProductsPage from './products/page';
import HeroSection from './components/layout/HeroSection';
import SecondHeroSection from './components/layout/SecondHeroSection';

export default function Home() {

  return (
    <div className="bg-white min-h-screen">
      <div className="space-y-8 md:space-y-12 lg:space-y-16">
        <HeroSection />
        <div className="px-4 sm:px-6 md:px-8 lg:px-32">
          <ProductsPage />
        </div>
        <SecondHeroSection />
      </div>
    </div>
  );
}

