import { ScheduleEvent } from '@/types';

export const MOCK_SCHEDULES: ScheduleEvent[] = [
  {
    id: 'schedule-1',
    classId: 'class-1',
    slotId: 'slot-class-1-20260124-1000',
    title: '필라테스 기초',
    start: new Date(new Date().setHours(10, 0, 0, 0)).toISOString(),
    end: new Date(new Date().setHours(11, 0, 0, 0)).toISOString(),
  },
  {
    id: 'schedule-2',
    classId: 'class-2',
    slotId: 'slot-class-2-20260125-1400',
    title: '요가 중급',
    start: (() => {
      const d = new Date();
      d.setDate(d.getDate() + 1);
      return d.toISOString();
    })(),
    end: (() => {
      const d = new Date();
      d.setDate(d.getDate() + 1);
      return d.toISOString();
    })(),
  },
];

export const MOCK_NEARBY_CENTERS = [
  {
    id: 'center-1',
    name: '에이원 필라테스',
    address: '경기 성남시 분당구 123-869',
    distance: '0.5km',
  },
  {
    id: 'center-2',
    name: '울룰루 요가',
    address: '경기 성남시 분당구 123-869',
    distance: '1.3km',
  },
  {
    id: 'center-3',
    name: '파워 짐 성남',
    address: '경기 성남시 분당구 123-869',
    distance: '1.2km',
  },
];
