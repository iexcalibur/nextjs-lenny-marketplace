import Image from 'next/image';
import Button from '@/app/components/ui/Button';
import heroImage from '@/app/assets/images/background/herosection_bg.png';

export default function HeroSection() {
  return (
    <div className="px-4 sm:px-6 md:px-8 lg:px-32">
      <div className="w-full min-h-[400px] sm:min-h-[500px] md:min-h-[620px] bg-white -mx-4 sm:-mx-6 md:-mx-8 lg:-mx-32 relative overflow-hidden">
        <div className="container mx-auto h-full flex flex-col md:flex-row items-center justify-between px-4 sm:px-6 md:px-8 lg:px-16 py-8 md:py-0">
          <div className="bg-white rounded-lg md:ml-0 lg:ml-[120px] mt-4 md:mt-[100px] mb-8 md:mb-[192px] max-w-[600px] z-10 text-center md:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[58px] font-semibold leading-tight text-black">
              Upgrade Your Wardrobe With Our Collection
            </h1>
            <p className="pt-4 pb-8 md:pb-12 text-gray-600 text-base md:text-lg">
              Discover the latest fashion trends at our one-stop shop. 
              We offer premium quality clothing at competitive prices. 
              Express yourself with our curated collection of modern styles.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 sm:gap-6">
              <Button 
                text="Buy Now" 
                className="w-full sm:w-auto"
                onClick={() => console.log('Buy Now clicked')}
              />
              <Button 
                text="View Details"
                bgColor="bg-white"
                textColor="text-[#1E4C2F]"
                className="w-full sm:w-auto border border-[#1E4C2F]"
                onClick={() => console.log('View Details clicked')}
              />
            </div>
          </div>

          <div className="relative w-full md:w-1/2 aspect-[4/3] md:aspect-auto md:h-[600px] mt-8 md:mt-0">
            <Image
              src={heroImage}
              alt="Hero fashion"
              width={800}
              height={600}
              className="object-contain md:object-cover w-full h-full"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
} 