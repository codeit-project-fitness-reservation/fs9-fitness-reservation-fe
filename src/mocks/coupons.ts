import { UserCoupon } from '@/types';

export const MOCK_USER_COUPONS: UserCoupon[] = [
  {
    id: 'usercoupon-1',
    userId: 'user-1',
    templateId: 'tpl-coupon-1',
    couponName: '무료 체험권',
    discountPoints: null,
    discountPercentage: 100,
    expiresAt: '2026-12-31T23:59:59.000Z',
    issuedAt: '2026-01-15T10:00:00.000Z',
    usedAt: null,
  },
  {
    id: 'usercoupon-2',
    userId: 'user-1',
    templateId: 'tpl-coupon-2',
    couponName: '이벤트 쿠폰',
    discountPoints: 10000,
    discountPercentage: null,
    expiresAt: '2026-12-31T23:59:59.000Z',
    issuedAt: '2026-01-16T10:00:00.000Z',
    usedAt: null,
  },
  {
    id: 'usercoupon-3',
    userId: 'user-1',
    templateId: 'tpl-coupon-3',
    couponName: '1주년 쿠폰',
    discountPoints: null,
    discountPercentage: 50,
    expiresAt: '2026-12-31T23:59:59.000Z',
    issuedAt: '2026-01-17T10:00:00.000Z',
    usedAt: null,
  },
  {
    id: 'usercoupon-4',
    userId: 'user-1',
    templateId: 'tpl-coupon-4',
    couponName: '1주년 쿠폰',
    discountPoints: null,
    discountPercentage: 50,
    expiresAt: '2026-12-31T23:59:59.000Z',
    issuedAt: '2026-01-18T10:00:00.000Z',
    usedAt: null,
  },
];

export function markCouponAsUsed(couponId: string): void {
  const coupon = MOCK_USER_COUPONS.find((c) => c.id === couponId);
  if (coupon && !coupon.usedAt) {
    coupon.usedAt = new Date().toISOString();
  }
}
