import Button from '../ui/Button';

interface ProductSummaryCardProps {
  promoCode: string;
  promoInput: string;
  promoError: string;
  totals: {
    subtotal: string;
    discount: string;
    total: string;
  };
  onPromoInputChange: (value: string) => void;
  onApplyPromo: () => void;
  onCheckout: () => void;
  isPromoApplied: boolean;
  appliedPromoCode: string;
  onClearPromo: () => void;
}

export default function ProductSummaryCard({
  promoCode,
  promoInput,
  promoError,
  totals,
  onPromoInputChange,
  onApplyPromo,
  onCheckout,
  isPromoApplied,
  appliedPromoCode,
  onClearPromo
}: ProductSummaryCardProps) {
  return (
    <div className="bg-white p-8 rounded-lg w-[380px] h-fit relative border-[0.5px] border-gray-200">
      <h2 className="text-xl font-bold text-black mb-4">Product Summary</h2>
      <div className="h-[1px] bg-gray-200 mx-2 mb-4"></div>
      <div className="space-y-4">
        <div className="flex justify-between text-gray-600">
          <span>Total Price</span>
          <span>${totals.subtotal}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Total Price (Discount)</span>
          <span>-${totals.discount}</span>
        </div>
        <div className="flex justify-between font-bold text-black text-lg">
          <span>Total Price</span>
          <span>${totals.total}</span>
        </div>
        <div className="h-[1px] bg-gray-200 mx-2 my-8"></div>
        <div className="h-24 rounded-xl border border-gray-200 p-4">
          <h3 className="font-bold text-black mb-2">Use a Promo Code</h3>
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <input 
                  type="text" 
                  placeholder="Enter promo code"
                  value={promoInput}
                  onChange={(e) => onPromoInputChange(e.target.value.toUpperCase())}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-black uppercase"
                  disabled={isPromoApplied}
                />
                {isPromoApplied && (
                  <button 
                    onClick={onClearPromo}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
              </div>
              <button 
                onClick={isPromoApplied ? undefined : onApplyPromo}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                  isPromoApplied 
                    ? 'bg-white text-green-800 border border-green-800'
                    : 'bg-green-800 text-white'
                }`}
              >
                {isPromoApplied ? 'Applied' : 'Apply'}
              </button>
            </div>
            {promoError && (
              <p className="text-red-500 text-xs">{promoError}</p>
            )}
          </div>
        </div>
        {promoCode && (
          <div className="border border-dashed border-gray-300 rounded-lg p-3">
            <p className="text-sm text-gray-600 text-center">
              <span className="font-medium text-gray-500">{promoCode}</span>
            </p>
          </div>
        )}
        <Button
          text="Checkout"
          onClick={onCheckout}
          className="w-full bg-green-800 text-white py-3 rounded-lg"
        />
      </div>
    </div>
  );
} 