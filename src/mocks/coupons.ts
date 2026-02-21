import { UserCoupon } from '@/types';

export const MOCK_USER_COUPONS: UserCoupon[] = [
  {
    id: 'usercoupon-1',
    userId: 'user-1',
    templateId: 'tpl-coupon-1',
    issuedAt: new Date('2026-01-15T10:00:00'),
    usedAt: undefined,
    template: {
      id: 'tpl-coupon-1',
      centerId: undefined,
      name: '무료 체험권',
      discountPoints: 0,
      discountPercentage: 100,
      expiresAt: new Date('2026-12-31T23:59:59'),
      createdAt: new Date('2026-01-01T00:00:00'),
    },
  },
  {
    id: 'usercoupon-2',
    userId: 'user-1',
    templateId: 'tpl-coupon-2',
    issuedAt: new Date('2026-01-16T10:00:00'),
    usedAt: undefined,
    template: {
      id: 'tpl-coupon-2',
      centerId: undefined,
      name: '이벤트 쿠폰',
      discountPoints: 10000,
      discountPercentage: 0,
      expiresAt: new Date('2026-12-31T23:59:59'),
      createdAt: new Date('2026-01-01T00:00:00'),
    },
  },
  {
    id: 'usercoupon-3',
    userId: 'user-1',
    templateId: 'tpl-coupon-3',
    issuedAt: new Date('2026-01-17T10:00:00'),
    usedAt: undefined,
    template: {
      id: 'tpl-coupon-3',
      centerId: undefined,
      name: '1주년 쿠폰',
      discountPoints: 0,
      discountPercentage: 50,
      expiresAt: new Date('2026-12-31T23:59:59'),
      createdAt: new Date('2026-01-01T00:00:00'),
    },
  },
  {
    id: 'usercoupon-4',
    userId: 'user-1',
    templateId: 'tpl-coupon-4',
    issuedAt: new Date('2026-01-18T10:00:00'),
    usedAt: undefined,
    template: {
      id: 'tpl-coupon-4',
      centerId: undefined,
      name: '1주년 쿠폰',
      discountPoints: 0,
      discountPercentage: 50,
      expiresAt: new Date('2026-12-31T23:59:59'),
      createdAt: new Date('2026-01-01T00:00:00'),
    },
  },
];

export function markCouponAsUsed(couponId: string): void {
  const coupon = MOCK_USER_COUPONS.find((c) => c.id === couponId);
  if (coupon && !coupon.usedAt) {
    coupon.usedAt = new Date();
  }
}
