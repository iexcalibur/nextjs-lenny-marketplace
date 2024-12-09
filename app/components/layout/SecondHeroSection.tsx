import Image from 'next/image';
import Button from '@/app/components/ui/Button';
import ipadImage from '@/app/assets/images/background/ipad.png'

export default function SecondHeroSection() {
  return (
    <div className="px-4 sm:px-6 md:px-8 lg:px-32 relative mb-8 md:mb-16">
      <div className="relative md:absolute left-0 md:left-16 top-0 md:-top-10 w-full md:w-1/2 flex items-center justify-center z-20 py-8 md:py-0">
        <Image
          src={ipadImage}
          alt="iPad Air"
          width={382}
          height={430}
          className="transform rotate-0 scale-100 md:scale-125 drop-shadow-2xl w-[280px] sm:w-[320px] md:w-auto"
          priority
        />
      </div>

      <div className="h-auto md:h-[400px] rounded-lg bg-[#FCECE1] relative overflow-hidden">
        <div className="container mx-auto h-full flex flex-col md:flex-row items-center justify-between px-4 sm:px-6 md:px-8 lg:px-16 py-8 md:py-0">
          <div className="hidden md:block md:w-1/2" />
          
          <div className="max-w-[500px] z-10 text-center md:text-left">
            <h2 className="text-3xl sm:text-4xl md:text-[48px] font-bold text-black mb-4">
              iPad Air Gen 5
            </h2>
            <p className="text-gray-600 text-base md:text-lg mb-6 md:mb-8 px-4 md:px-0">
              Experience unparalleled performance with the iPad Pro M2. Featuring a stunning Liquid Retina XDR display and the revolutionary M2 chip, this iPad delivers desktop-level power in a portable design.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button 
                text="Buy $900"
                bgColor="bg-[#1E4C2F]"
                className="w-full sm:w-auto px-8 md:px-12"
                onClick={() => console.log('Buy clicked')}
              />
              <Button 
                text="View Detail"
                bgColor="bg-transparent"
                textColor="text-[#1E4C2F]"
                className="w-full sm:w-auto px-8 md:px-12 border border-[#1E4C2F]"
                onClick={() => console.log('View Detail clicked')}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 