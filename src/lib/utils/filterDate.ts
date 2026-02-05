import { subMinutes, subHours, subDays, subWeeks, subMonths, format } from 'date-fns';

export function calculateDateRange(period: string): { startDate?: string; endDate?: string } {
  const now = new Date();
  let startDate = now;

  switch (period) {
    case '10분':
      startDate = subMinutes(now, 10);
      break;
    case '1시간':
      startDate = subHours(now, 1);
      break;
    case '6시간':
      startDate = subHours(now, 6);
      break;
    case '1일':
      startDate = subDays(now, 1);
      break;
    case '1주일':
      startDate = subWeeks(now, 1);
      break;
    case '1개월':
      startDate = subMonths(now, 1);
      break;
    case '전체기간':
      // 백엔드 기본값이 '오늘'일 수 있으므로, 명시적으로 넓은 범위를 지정
      return { startDate: '2020-01-01', endDate: '2100-12-31' };
    default:
      // 기본값: 1일
      startDate = subDays(now, 1);
  }

  // API 포맷에 맞게 변환
  return {
    startDate: format(startDate, 'yyyy-MM-dd HH:mm:ss'),
    endDate: format(now, 'yyyy-MM-dd HH:mm:ss'),
  };
}
