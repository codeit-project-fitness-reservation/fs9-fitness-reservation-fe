'use client';

import Image from 'next/image';
import SimpleHeader from '@/components/layout/SimpleHeader/SimpleHeader';
import couponIcon from '@/assets/images/coupon.svg';
import emptyStateIcon from '@/assets/images/Empty State.svg';
import { UserCoupon } from '@/types';
import { MOCK_USER_COUPONS } from '@/mocks/coupons';

type SvgImport = string | { src: string };

const getSvgSrc = (svg: SvgImport): string => {
  return typeof svg === 'string' ? svg : svg.src;
};

const formatDate = (date: Date | string | null | undefined): string => {
  if (!date) return '';
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}. ${month}. ${day}`;
};

const formatDiscount = (coupon: UserCoupon): string => {
  if (coupon.discountPercentage && coupon.discountPercentage > 0) {
    return `${coupon.discountPercentage}% 할인`;
  }
  if (coupon.discountPoints && coupon.discountPoints > 0) {
    return `${coupon.discountPoints.toLocaleString()}원 할인`;
  }
  return '할인 정보 없음';
};

const formatCondition = (coupon: UserCoupon): string => {
  if (coupon.discountPoints && coupon.discountPoints >= 10000) {
    return '20,000원 이상 결제 시';
  }
  return '제한 없음';
};

export default function CouponsPage() {
  const coupons: UserCoupon[] = MOCK_USER_COUPONS;

  return (
    <div className="flex min-h-[calc(100vh-56px)] flex-col bg-gray-50">
      <SimpleHeader title="쿠폰함" />

      <div className="mx-auto flex w-full flex-col gap-4 bg-gray-50 px-4 py-6 md:max-w-240">
        <p className="text-base font-medium text-gray-900">보유쿠폰 {coupons.length}장</p>

        {coupons.length > 0 ? (
          <div className="flex flex-col gap-3">
            {coupons.map((coupon) => (
              <div
                key={coupon.id}
                className="flex w-full items-center justify-between rounded-2xl bg-white p-8 shadow-sm"
                style={{
                  height: '192px',
                  boxShadow: '0 1px 8px 0 rgba(0, 0, 0, 0.06)',
                }}
              >
                <div className="flex flex-col gap-1">
                  <h3 className="text-base font-semibold text-gray-900">
                    {coupon.couponName || '쿠폰'}
                  </h3>
                  <p className="text-sm font-medium text-blue-600">{formatDiscount(coupon)}</p>
                  <p className="text-xs text-gray-500">{formatCondition(coupon)}</p>
                  {coupon.expiresAt && (
                    <p className="text-xs text-gray-500">만료: {formatDate(coupon.expiresAt)}</p>
                  )}
                </div>
                <div className="shrink-0">
                  <Image
                    src={getSvgSrc(couponIcon as SvgImport)}
                    alt="쿠폰"
                    width={64}
                    height={64}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex w-full flex-col items-center justify-center py-12">
            <div className="mb-4">
              <Image
                src={getSvgSrc(emptyStateIcon as SvgImport)}
                alt="빈 쿠폰함"
                width={228}
                height={207}
              />
            </div>
            <p className="text-sm text-gray-500">사용할 수 있는 쿠폰이 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}
