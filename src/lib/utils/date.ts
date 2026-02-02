import { format, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';

/**
 * 시간을 HH:mm 형식으로 포맷팅합니다.
 * @param dateString ISO 형식의 날짜 문자열
 * @returns HH:mm 형식의 시간 문자열
 */
export function formatTime(dateString: string): string {
  return format(parseISO(dateString), 'HH:mm');
}

/**
 * 날짜를 yyyy.M 형식으로 포맷팅합니다.
 * @param date 날짜 객체
 * @returns yyyy.M 형식의 날짜 문자열
 */
export function formatDateCaption(date: Date): string {
  return format(date, 'yyyy.M');
}

/**
 * 날짜를 yyyy-MM-dd 형식으로 포맷팅합니다.
 * @param date 날짜 객체
 * @returns yyyy-MM-dd 형식의 날짜 문자열
 */
export function formatDate(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

/**
 * 날짜를 MM월 dd일(E) 형식으로 포맷팅합니다.
 * @param date 날짜 객체
 * @returns MM월 dd일(E) 형식의 날짜 문자열
 */
export function formatDateWithDay(date: Date): string {
  return format(date, 'MM월 dd일(E)', { locale: ko });
}
