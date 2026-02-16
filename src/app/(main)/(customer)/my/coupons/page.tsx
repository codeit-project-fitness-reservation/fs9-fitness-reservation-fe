'use client';

import Image from 'next/image';
import SimpleHeader from '@/components/layout/SimpleHeader/SimpleHeader';
import couponIcon from '@/assets/images/coupon.svg';
import emptyStateIcon from '@/assets/images/Empty State.svg';
import { UserCoupon } from '@/types';

type SvgImport = string | { src: string };

const getSvgSrc = (svg: SvgImport): string => {
  return typeof svg === 'string' ? svg : svg.src;
};

// 날짜 포맷팅 함수
const formatDate = (date: Date | string | null | undefined): string => {
  if (!date) return '';
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}. ${month}. ${day}`;
};

// 할인 정보 포맷팅 함수
const formatDiscount = (coupon: UserCoupon): string => {
  const template = coupon.template;
  if (!template) return '할인 정보 없음';

  if (template.discountPercentage > 0) {
    return `${template.discountPercentage}% 할인`;
  }
  if (template.discountPoints > 0) {
    return `${template.discountPoints.toLocaleString()}원 할인`;
  }
  return '할인 정보 없음';
};

// 조건 정보 포맷팅 함수
const formatCondition = (coupon: UserCoupon): string => {
  const template = coupon.template;
  if (!template) return '제한 없음';

  // 할인 금액이 있으면 최소 결제 금액 조건 표시
  if (template.discountPoints > 0 && template.discountPoints >= 10000) {
    return '20,000원 이상 결제 시';
  }
  return '제한 없음';
};

// Mock 쿠폰 데이터 (실제 UserCoupon 타입 사용)
const MOCK_COUPONS: UserCoupon[] = [
  {
    id: '1',
    userId: 'user-1',
    templateId: 'tpl-1',
    issuedAt: new Date(),
    usedAt: undefined,
    template: {
      id: 'tpl-1',
      name: '무료 체험권',
      discountPoints: 0,
      discountPercentage: 100,
      expiresAt: new Date('2026-01-01'),
      createdAt: new Date(),
    },
  },
  {
    id: '2',
    userId: 'user-1',
    templateId: 'tpl-2',
    issuedAt: new Date(),
    usedAt: undefined,
    template: {
      id: 'tpl-2',
      name: '이벤트 쿠폰',
      discountPoints: 10000,
      discountPercentage: 0,
      expiresAt: new Date('2026-01-01'),
      createdAt: new Date(),
    },
  },
  {
    id: '3',
    userId: 'user-1',
    templateId: 'tpl-3',
    issuedAt: new Date(),
    usedAt: undefined,
    template: {
      id: 'tpl-3',
      name: '1주년 쿠폰',
      discountPoints: 0,
      discountPercentage: 50,
      expiresAt: new Date('2026-01-01'),
      createdAt: new Date(),
    },
  },
  {
    id: '4',
    userId: 'user-1',
    templateId: 'tpl-4',
    issuedAt: new Date(),
    usedAt: undefined,
    template: {
      id: 'tpl-4',
      name: '1주년 쿠폰',
      discountPoints: 0,
      discountPercentage: 50,
      expiresAt: new Date('2026-01-01'),
      createdAt: new Date(),
    },
  },
];

export default function CouponsPage() {
  // TODO: 실제 쿠폰 데이터로 교체
  const coupons: UserCoupon[] = []; // 빈 상태 테스트를 위해 빈 배열로 변경 가능: []

  return (
    <div className="flex min-h-[calc(100vh-56px)] flex-col bg-gray-50">
      <SimpleHeader title="쿠폰함" />

      <div className="mx-auto flex w-full flex-col gap-4 bg-gray-50 px-4 py-6 md:max-w-240">
        {/* 보유쿠폰 개수 */}
        <p className="text-base font-medium text-gray-900">보유쿠폰 {coupons.length}장</p>

        {/* 쿠폰 리스트 또는 빈 상태 */}
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
                    {coupon.template?.name || '쿠폰'}
                  </h3>
                  <p className="text-sm font-medium text-blue-600">{formatDiscount(coupon)}</p>
                  <p className="text-xs text-gray-500">{formatCondition(coupon)}</p>
                  {coupon.template?.expiresAt && (
                    <p className="text-xs text-gray-500">
                      만료: {formatDate(coupon.template.expiresAt)}
                    </p>
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
          </div>
        )}
      </div>
    </div>
  );
}
