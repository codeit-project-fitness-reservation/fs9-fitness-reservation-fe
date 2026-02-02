import { z } from 'zod';

export const categoryOptions = ['헬스', '요가', '필라테스', '복싱', '스쿼시'] as const;
export const levelOptions = ['입문', '초급', '중급', '고급'] as const;

export const daysOfWeek = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const;
export type DayOfWeek = (typeof daysOfWeek)[number];

export const dayLabels: Record<DayOfWeek, string> = {
  monday: '월요일',
  tuesday: '화요일',
  wednesday: '수요일',
  thursday: '목요일',
  friday: '금요일',
  saturday: '토요일',
  sunday: '일요일',
};

// - 각 필드 독립적으로 검증
export const classFormSchema = z.object({
  title: z.string().min(3, '클래스명을 3글자 이상 입력해주세요.'),

  // category와 level
  category: z
    .string()
    .min(1, '카테고리를 선택해주세요.')
    .refine((val) => (categoryOptions as readonly string[]).includes(val), {
      message: '유효한 카테고리를 선택해주세요.',
    }),
  level: z
    .string()
    .min(1, '난이도를 선택해주세요.')
    .refine((val) => (levelOptions as readonly string[]).includes(val), {
      message: '유효한 난이도를 선택해주세요.',
    }),

  pricePoints: z
    .string()
    .min(1, '가격을 입력해주세요.')
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: '올바른 가격을 입력해주세요.',
    }),

  capacity: z
    .string()
    .min(1, '인원을 입력해주세요.')
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: '올바른 인원을 입력해주세요.',
    }),

  description: z.string().min(3, '상세 소개를 3글자 이상 입력해주세요.'),

  precautions: z.string().min(3, '주의사항을 3글자 이상 입력해주세요.'),

  schedule: z.object({
    monday: z.array(z.string()),
    tuesday: z.array(z.string()),
    wednesday: z.array(z.string()),
    thursday: z.array(z.string()),
    friday: z.array(z.string()),
    saturday: z.array(z.string()),
    sunday: z.array(z.string()),
  }),
});

export type ClassFormInput = z.infer<typeof classFormSchema>;

export type ClassFormData = Omit<ClassFormInput, 'pricePoints' | 'capacity'> & {
  pricePoints: number;
  capacity: number;
};

export type NumericFieldConfig = {
  label: string;
  name: 'pricePoints' | 'capacity';
  unit: string;
  placeholder: string;
};

export const numericFields: NumericFieldConfig[] = [
  { label: '가격', name: 'pricePoints', unit: 'P', placeholder: '숫자만 입력' },
  { label: '인원', name: 'capacity', unit: '명', placeholder: '숫자만 입력' },
];
