import { CouponTemplate, UserCoupon } from '@/types';

const DAY_MS = 24 * 60 * 60 * 1000;
const now = new Date();
const addDays = (days: number) => new Date(now.getTime() + days * DAY_MS);

const MOCK_COUPON_TEMPLATES: Record<string, CouponTemplate> = {
  'tpl-class-1-5000': {
    id: 'tpl-class-1-5000',
    centerId: 'center-1',
    name: 'class-1 전용 5,000P 할인',
    discountPoints: 5000,
    discountPercentage: 0,
    expiresAt: addDays(30),
    createdAt: now,
  },
  'tpl-class-1-3000': {
    id: 'tpl-class-1-3000',
    centerId: 'center-1',
    name: 'class-1 전용 3,000P 할인',
    discountPoints: 3000,
    discountPercentage: 0,
    expiresAt: addDays(7),
    createdAt: now,
  },
  'tpl-class-2-2000': {
    id: 'tpl-class-2-2000',
    centerId: 'center-1',
    name: 'class-2 전용 2,000P 할인',
    discountPoints: 2000,
    discountPercentage: 0,
    expiresAt: addDays(14),
    createdAt: now,
  },
};

export const MOCK_USER_COUPONS_BY_CLASS: Record<string, UserCoupon[]> = {
  'class-1': [
    {
      id: 'usercoupon-class-1-1',
      userId: 'user-1',
      templateId: 'tpl-class-1-5000',
      issuedAt: addDays(-3),
      usedAt: undefined,
      template: MOCK_COUPON_TEMPLATES['tpl-class-1-5000'],
    },
    {
      id: 'usercoupon-class-1-2',
      userId: 'user-1',
      templateId: 'tpl-class-1-3000',
      issuedAt: addDays(-1),
      usedAt: undefined,
      template: MOCK_COUPON_TEMPLATES['tpl-class-1-3000'],
    },
  ],
  'class-2': [
    {
      id: 'usercoupon-class-2-1',
      userId: 'user-1',
      templateId: 'tpl-class-2-2000',
      issuedAt: addDays(-2),
      usedAt: undefined,
      template: MOCK_COUPON_TEMPLATES['tpl-class-2-2000'],
    },
  ],
};

export function getMockUserCouponsForClass(params: {
  classId: string;
  userId: string;
}): UserCoupon[] {
  const { classId, userId } = params;
  const coupons = MOCK_USER_COUPONS_BY_CLASS[classId] ?? [];
  return coupons.map((c) => ({
    ...c,
    userId,
    template: c.template ?? MOCK_COUPON_TEMPLATES[c.templateId],
  }));
}
