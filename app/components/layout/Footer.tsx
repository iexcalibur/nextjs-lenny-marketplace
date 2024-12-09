import Image from 'next/image';
import Link from 'next/link';
import logo from '@/app/assets/images/icons/logo.svg';

export default function Footer() {
  return (
    <footer className="bg-gray-200 py-8 sm:py-12 md:py-16 mt-12 sm:mt-16 md:mt-24">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-32">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-12 lg:gap-32">
          <div className="col-span-1 sm:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Image 
                src={logo} 
                alt="Lenny Logo" 
                width={32} 
                height={32}
                className="rounded-lg"
              />
              <span className="text-xl font-bold text-black">lenny.</span>
            </div>
            <p className="text-black text-sm md:text-base">
              The biggest marketplace managed by Ideologist corp, which provides various kinds of daily needs and hobbies.
            </p>
          </div>

          <div className="mt-6 sm:mt-0">
            <h3 className="font-bold text-base md:text-lg mb-4 text-black">About Lenny</h3>
            <ul className="space-y-2 md:space-y-3 text-sm md:text-base text-black">
              <li><Link href="/information" className="hover:opacity-80">Information</Link></li>
              <li><Link href="/store-lactor" className="hover:opacity-80">Store Lactor</Link></li>
              <li><Link href="/bulk-purchase" className="hover:opacity-80">Bulk Purchase</Link></li>
              <li><Link href="/alteration" className="hover:opacity-80">Alteration Services</Link></li>
              <li><Link href="/gift" className="hover:opacity-80">Gift Delivery Service</Link></li>
              <li><Link href="/live" className="hover:opacity-80">Live Station</Link></li>
            </ul>
          </div>

          <div className="mt-6 sm:mt-0">
            <h3 className="font-bold text-base md:text-lg mb-4 text-black">Help</h3>
            <ul className="space-y-2 md:space-y-3 text-sm md:text-base text-black">
              <li><Link href="/faq" className="hover:opacity-80">FAQ</Link></li>
              <li><Link href="/return" className="hover:opacity-80">Return Policy</Link></li>
              <li><Link href="/privacy" className="hover:opacity-80">Privacy Policy</Link></li>
              <li><Link href="/accessibility" className="hover:opacity-80">Accessibility</Link></li>
              <li><Link href="/contact" className="hover:opacity-80">Contact Us</Link></li>
            </ul>
          </div>

          <div className="mt-6 sm:mt-0">
            <h3 className="font-bold text-base md:text-lg mb-4 text-black">Contact Us</h3>
            <ul className="space-y-2 md:space-y-3 text-sm md:text-base text-black">
              <li>For Lenny Consumer Complaint Services</li>
              <li>
                (684) 555-0102 and curtis.weaver@example.com
              </li>
              <li>Customer&apos;s Complaint Service</li>
              <li>Directorate Generate of the Republic of Indonesia</li>
              <li>(480) 555-0103</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
} 