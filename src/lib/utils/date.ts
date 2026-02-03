import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

export function formatTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'HH:mm');
}

export function formatDateCaption(date: Date): string {
  return format(date, 'yyyy.M');
}

export function formatDate(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

export function formatDateWithDay(date: Date): string {
  return format(date, 'MM월 dd일(E)', { locale: ko });
}
