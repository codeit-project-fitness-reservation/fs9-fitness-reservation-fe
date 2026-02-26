'use client';

import Image from 'next/image';
import { UserCoupon } from '@/types';
import chevronRightIcon from '@/assets/images/chevron-right.svg';

interface PaymentCouponProps {
  availableCoupons: UserCoupon[];
  selectedCoupon: UserCoupon | null;
  onCouponSelect: (coupon: UserCoupon | null) => void;
  onCouponModalOpen: () => void;
}

export default function PaymentCoupon({
  availableCoupons,
  selectedCoupon,
  onCouponSelect,
  onCouponModalOpen,
}: PaymentCouponProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-base font-semibold text-gray-900">쿠폰</label>

      {selectedCoupon ? (
        <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex items-center gap-2">
            <span className="text-base font-medium text-blue-600">
              {selectedCoupon.discountPoints
                ? `-${selectedCoupon.discountPoints.toLocaleString()}P`
                : selectedCoupon.discountPercentage
                  ? `-${selectedCoupon.discountPercentage}%`
                  : ''}
            </span>
            <span className="text-sm text-gray-600">{selectedCoupon.couponName}</span>
            <button
              type="button"
              onClick={() => onCouponSelect(null)}
              className="flex size-5 items-center justify-center text-gray-400 hover:text-gray-600"
              aria-label="쿠폰 제거"
            >
              <span className="text-lg">×</span>
            </button>
          </div>
        </div>
      ) : null}

      <button
        type="button"
        onClick={onCouponModalOpen}
        className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white p-4 transition-colors hover:bg-gray-50"
      >
        <span className="text-base text-gray-700">
          사용 가능한 쿠폰 {availableCoupons.length}개
        </span>
        <Image src={chevronRightIcon} alt="" width={20} height={20} />
      </button>
    </div>
  );
}
