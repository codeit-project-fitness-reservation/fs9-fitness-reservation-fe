interface PaymentSummaryProps {
  originalPrice: number;
  couponDiscount: number;
  pointsUsed: number;
}

export default function PaymentSummary({
  originalPrice,
  couponDiscount,
  pointsUsed,
}: PaymentSummaryProps) {
  const finalAmount = Math.max(0, originalPrice - couponDiscount - pointsUsed);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-base text-gray-700">가격</span>
        <span className="text-base font-medium text-gray-900">
          {originalPrice.toLocaleString()}원
        </span>
      </div>

      {couponDiscount > 0 && (
        <div className="flex items-center justify-between">
          <span className="text-base text-gray-700">쿠폰 할인</span>
          <span className="text-base font-medium text-blue-600">
            -{couponDiscount.toLocaleString()}원
          </span>
        </div>
      )}

      {pointsUsed > 0 && (
        <div className="flex items-center justify-between">
          <span className="text-base text-gray-700">포인트 사용</span>
          <span className="text-base font-medium text-blue-600">
            -{pointsUsed.toLocaleString()}P
          </span>
        </div>
      )}

      <div className="flex items-center justify-between border-t border-gray-200 pt-2">
        <span className="text-lg font-semibold text-gray-900">결제 금액</span>
        <span className="text-lg font-bold text-gray-900">{finalAmount.toLocaleString()}원</span>
      </div>
    </div>
  );
}
