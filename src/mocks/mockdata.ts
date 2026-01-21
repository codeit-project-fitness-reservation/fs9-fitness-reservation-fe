import { User, NotificationItem } from '@/types';

export const MOCK_ACCOUNTS: Record<string, User & { password?: string }> = {
  'user@test.com': {
    email: 'user@test.com',
    nickname: '홍길동',
    role: 'USER',
    password: 'password123',
  },
  'seller@test.com': {
    email: 'seller@test.com',
    nickname: '김강사',
    role: 'SELLER',
    password: 'sellerpassword',
  },
  'admin@test.com': {
    email: 'admin@test.com',
    nickname: '최고관리자',
    role: 'ADMIN',
    password: 'adminpassword',
  },
};

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  { id: 1, message: '새로운 예약이 신청되었습니다.', date: '2026.01.19' },
  { id: 2, message: '시스템 점검 안내입니다.', date: '2026.01.18' },
];
