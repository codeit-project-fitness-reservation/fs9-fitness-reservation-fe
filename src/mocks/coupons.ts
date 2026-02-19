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

/**
 * Customer 쿠폰함용 UserCoupon 목록
 */
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
