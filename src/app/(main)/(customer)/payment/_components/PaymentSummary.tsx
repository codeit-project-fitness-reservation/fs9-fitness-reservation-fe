interface PaymentSummaryProps {
  originalPrice: number;
  couponDiscount: number;
  finalAmount: number;
}

export default function PaymentSummary({
  originalPrice,
  couponDiscount,
  finalAmount,
}: PaymentSummaryProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-base text-gray-700">가격</span>
        <span className="text-base font-medium text-gray-900">
          {originalPrice.toLocaleString()}P
        </span>
      </div>

      {couponDiscount > 0 && (
        <div className="flex items-center justify-between">
          <span className="text-base text-gray-700">쿠폰 할인</span>
          <span className="text-base font-medium text-blue-600">
            -{couponDiscount.toLocaleString()}P
          </span>
        </div>
      )}

      <div className="flex items-center justify-between border-t border-gray-200 pt-2">
        <span className="text-lg font-semibold text-gray-900">결제 포인트</span>
        <span className="text-lg font-bold text-gray-900">{finalAmount.toLocaleString()}P</span>
      </div>
    </div>
  );
}
