import { z } from 'zod';

export const memberFormSchema = z
  .object({
    nickname: z.string().min(2, '닉네임은 2글자 이상 입력해주세요.'),
    companyName: z.string().min(1, '업체명을 입력해주세요.'),
    contact: z
      .string()
      .refine((s) => /^\d{10,11}$/.test(s.replace(/\D/g, '')), '올바른 전화번호 형식이 아닙니다.'),
    roadAddress: z.string().min(1, '도로명 주소를 입력해주세요.'),
    detailAddress: z.union([z.string(), z.literal('')]).optional(),
    description: z.union([z.string(), z.literal('')]).optional(),

    password: z
      .union([z.string().min(8, '비밀번호는 8자 이상이어야 합니다.'), z.literal('')])
      .optional(),
    passwordConfirm: z.union([z.string(), z.literal('')]).optional(),
  })
  .refine((data) => !data.password || data.password === data.passwordConfirm, {
    error: '비밀번호가 일치하지 않습니다.',
    path: ['passwordConfirm'],
  });

export type MemberFormInput = z.infer<typeof memberFormSchema>;
