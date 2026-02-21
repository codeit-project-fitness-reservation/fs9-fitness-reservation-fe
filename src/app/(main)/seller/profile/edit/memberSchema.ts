import { z } from 'zod';

export const memberFormSchema = z
  .object({
    nickname: z.string().min(2, '닉네임은 2글자 이상 입력해주세요.'),
    companyName: z.string().min(1, '업체명을 입력해주세요.'),
    contact: z.string().regex(/^010-\d{4}-\d{4}$/, '010-0000-0000 형식으로 입력해주세요.'),
    roadAddress: z.string().min(1, '도로명 주소를 입력해주세요.'),
    detailAddress: z.string().min(1, '상세 주소를 입력해주세요.'),
    description: z.string().min(5, '소개글을 5자 이상 작성해주세요.'),

    password: z
      .union([z.string().min(8, '비밀번호는 8자 이상이어야 합니다.'), z.literal('')])
      .optional(),
    passwordConfirm: z.union([z.string(), z.literal('')]).optional(),
  })
  .refine((data) => !data.password || data.password === data.passwordConfirm, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['passwordConfirm'],
  });

export type MemberFormInput = z.infer<typeof memberFormSchema>;
