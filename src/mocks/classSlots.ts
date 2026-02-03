import { ClassSlot } from '@/types/class';

function pad2(n: number) {
  return String(n).padStart(2, '0');
}

function toLocalDateKey(date: Date) {
  const y = date.getFullYear();
  const m = pad2(date.getMonth() + 1);
  const d = pad2(date.getDate());
  return `${y}${m}${d}`;
}

function atTime(baseDate: Date, hour: number, minute = 0) {
  const d = new Date(baseDate);
  d.setHours(hour, minute, 0, 0);
  return d;
}

export function getMockClassSlotsForDate(params: { classId: string; date: Date }): ClassSlot[] {
  const { classId, date } = params;
  const dateKey = toLocalDateKey(date);

  return [
    {
      id: `slot-${classId}-${dateKey}-1300`,
      classId,
      startAt: atTime(date, 13, 0),
      endAt: atTime(date, 14, 0),
      capacity: 10,
      currentReservation: 8,
      isOpen: true,
      createdAt: new Date(),
    },
    {
      id: `slot-${classId}-${dateKey}-1400`,
      classId,
      startAt: atTime(date, 14, 0),
      endAt: atTime(date, 15, 0),
      capacity: 10,
      currentReservation: 8,
      isOpen: true,
      createdAt: new Date(),
    },
    {
      id: `slot-${classId}-${dateKey}-1500`,
      classId,
      startAt: atTime(date, 15, 0),
      endAt: atTime(date, 16, 0),
      capacity: 10,
      currentReservation: 3,
      isOpen: true,
      createdAt: new Date(),
    },
    {
      id: `slot-${classId}-${dateKey}-1600`,
      classId,
      startAt: atTime(date, 16, 0),
      endAt: atTime(date, 17, 0),
      capacity: 10,
      currentReservation: 10,
      isOpen: false,
      createdAt: new Date(),
    },
  ];
}
