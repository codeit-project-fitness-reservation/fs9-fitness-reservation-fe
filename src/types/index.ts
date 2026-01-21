export type UserRole = 'USER' | 'ADMIN' | 'SELLER';

export interface User {
  email: string;
  nickname: string;
  role: UserRole;
  password?: string;
}

export interface NotificationItem {
  id: number;
  message: string;
  date: string;
  isRead?: boolean;
}
