'use client';

import Image from 'next/image';
import { UserCoupon } from '@/types';
import chevronDownIcon from '@/assets/images/chevron-down.svg';
import xCloseIcon from '@/assets/images/x-close.svg';

interface PaymentCouponProps {
  availableCoupons: UserCoupon[];
  selectedCoupon: UserCoupon | null;
  onCouponSelect: (coupon: UserCoupon | null) => void;
  onCouponModalOpen: () => void;
  couponDiscountDisplay: number;
}

export default function PaymentCoupon({
  availableCoupons,
  selectedCoupon,
  onCouponSelect,
  onCouponModalOpen,
  couponDiscountDisplay,
}: PaymentCouponProps) {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-gray-200 bg-white p-4">
      <div className="flex flex-col gap-1.5">
        <div className="flex w-full items-center justify-between">
          <p className="text-sm leading-5 font-medium text-gray-800">쿠폰</p>
          {selectedCoupon && couponDiscountDisplay > 0 && (
            <div className="flex items-center gap-1">
              <p className="text-sm leading-5 font-semibold text-blue-600">
                -{couponDiscountDisplay.toLocaleString()}P
              </p>
              <button
                type="button"
                onClick={() => onCouponSelect(null)}
                className="flex size-5 shrink-0 items-center justify-center"
                aria-label="쿠폰 제거"
              >
                <Image src={xCloseIcon} alt="" width={20} height={20} />
              </button>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={onCouponModalOpen}
          className="flex w-full items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-left transition-colors hover:bg-gray-50"
        >
          <span className="min-w-0 flex-1 truncate text-base leading-6 font-normal text-gray-900">
            {selectedCoupon
              ? selectedCoupon.couponName
              : `사용 가능한 쿠폰 ${availableCoupons.length}개`}
          </span>
          <Image src={chevronDownIcon} alt="" width={20} height={20} className="shrink-0" />
        </button>
      </div>
    </div>
  );
}
