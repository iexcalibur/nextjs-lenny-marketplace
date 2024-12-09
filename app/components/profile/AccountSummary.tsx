interface AccountSummaryProps {
  summary: {
    totalItems: number;
    totalPurchase: number;
    discountCodes: string[];
    totalDiscount: number;
  };
}

export default function AccountSummary({ summary }: AccountSummaryProps) {
  return (
    <div className="bg-white p-8 rounded-lg border-[0.5px] border-gray-200">
      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-400 mb-2">Total Items Purchased</h3>
            <p className="text-3xl font-bold text-black">{summary.totalItems}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-400 mb-2">Total Purchase Amount</h3>
            <p className="text-3xl font-bold text-black">${summary.totalPurchase.toFixed(2)}</p>
          </div>
        </div>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-400 mb-2">Discount Codes Used</h3>
            {summary.discountCodes.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {summary.discountCodes.map((code, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-800"
                  >
                    {code}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No discount codes used</p>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-400 mb-2">Total Discount Amount</h3>
            <p className="text-3xl font-bold text-green-800">${summary.totalDiscount.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
} 