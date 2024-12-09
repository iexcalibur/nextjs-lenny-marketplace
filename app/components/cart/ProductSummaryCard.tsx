import Button from '../ui/Button';

interface Totals {
  subtotal: number;
  discount: number;
  total: number;
}

interface ProductSummaryCardProps {
  promoInput: string;
  promoError: string | null;
  totals: Totals;
  onPromoInputChange: (value: string) => void;
  onApplyPromo: () => void;
  onCheckout: () => void;
  isPromoApplied: boolean;
  appliedPromoCode: string | null;
  onClearPromo: () => void;
}

export default function ProductSummaryCard({
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
    <div className="bg-white p-4 sm:p-6 md:p-8 rounded-lg border-[0.5px] border-gray-200 w-full">
      <h2 className="text-lg sm:text-xl font-bold text-black mb-6">Order Summary</h2>
      
      {/* Promo Code Section */}
      <div className="mb-6">
        {isPromoApplied ? (
          <div className="flex items-center justify-between mb-2">
            <span className="text-green-800">Applied code: {appliedPromoCode}</span>
            <button 
              onClick={onClearPromo}
              className="text-sm text-red-500 hover:text-red-600"
            >
              Remove
            </button>
          </div>
        ) : (
          <>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={promoInput}
                onChange={(e) => onPromoInputChange(e.target.value)}
                placeholder="Enter promo code"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500"
              />
              <Button
                text="Apply"
                onClick={onApplyPromo}
                className="px-6"
              />
            </div>
            {promoError && (
              <p className="text-red-500 text-sm">{promoError}</p>
            )}
          </>
        )}
      </div>

      {/* Totals Section */}
      <div className="space-y-4 mb-6">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span className="text-black font-medium">${totals.subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Discount</span>
          <span className="text-green-800 font-medium">-${totals.discount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between pt-4 border-t border-gray-200">
          <span className="text-black font-bold">Total</span>
          <span className="text-black font-bold">${totals.total.toFixed(2)}</span>
        </div>
      </div>

      {/* Checkout Button */}
      <Button
        text="Proceed to Checkout"
        onClick={onCheckout}
        className="w-full"
      />
    </div>
  );
} 