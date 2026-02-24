import { z } from 'zod';

export const couponFormSchema = z
  .object({
    name: z.string().min(1, '쿠폰 이름을 입력해주세요.'),
    discountType: z.enum(['amount', 'percentage']),
    discountPoints: z.number().optional(),
    discountPercentage: z.number().max(100, '할인 비율은 100%를 초과할 수 없습니다.').optional(),
    expiresAt: z.date().optional(),
  })
  .refine(
    (data) => {
      // 할인 금액/비율이 입력된 경우에만 유효성 검사 (입력되지 않아도 됨)
      if (data.discountType === 'amount' && data.discountPoints !== undefined) {
        return data.discountPoints > 0;
      }
      if (data.discountType === 'percentage' && data.discountPercentage !== undefined) {
        return data.discountPercentage > 0;
      }
      // 입력되지 않은 경우는 허용 (선택사항)
      return true;
    },
    {
      message: '할인 금액 또는 비율을 올바르게 입력해주세요.',
      path: ['discountPoints'],
    },
  )
  .refine((data) => data.expiresAt !== undefined, {
    message: '만료일을 선택해주세요.',
    path: ['expiresAt'],
  });

export type CouponFormInput = z.infer<typeof couponFormSchema>;
