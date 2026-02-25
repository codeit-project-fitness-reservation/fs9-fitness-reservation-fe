import { ClassSlot, ScheduleEvent } from '@/types';
import { ClassItem } from '@/types';
import { SlotItem, SlotItemResponse } from '@/lib/api/class';

export const DAY_MAP: Record<string, string> = {
  월: 'monday',
  화: 'tuesday',
  수: 'wednesday',
  목: 'thursday',
  금: 'friday',
  토: 'saturday',
  일: 'sunday',
};

export const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토'];

export const ENGLISH_TO_KOREAN_DAY: Record<string, string> = {
  monday: '월',
  tuesday: '화',
  wednesday: '수',
  thursday: '목',
  friday: '금',
  saturday: '토',
  sunday: '일',
};

export const KOREAN_TO_ENGLISH_DAY: Record<string, string> = {
  월: 'monday',
  화: 'tuesday',
  수: 'wednesday',
  목: 'thursday',
  금: 'friday',
  토: 'saturday',
  일: 'sunday',
};

export function parseDayGroup(dayGroup: string): string[] {
  const days: string[] = [];
  const lowerDayGroup = dayGroup.toLowerCase();

  if (ENGLISH_TO_KOREAN_DAY[lowerDayGroup]) {
    return [ENGLISH_TO_KOREAN_DAY[lowerDayGroup]];
  }

  if (dayGroup.includes('월')) days.push('월');
  if (dayGroup.includes('화')) days.push('화');
  if (dayGroup.includes('수') || dayGroup.includes('주')) days.push('수');
  if (dayGroup.includes('목')) days.push('목');
  if (dayGroup.includes('금')) days.push('금');
  if (dayGroup.includes('토')) days.push('토');
  if (dayGroup.includes('일')) days.push('일');

  return days;
}

export function formatDateStr(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseSchedule(
  schedule: string | Record<string, string> | null | undefined,
): Record<string, string> | null {
  if (!schedule) return null;

  try {
    const scheduleData = typeof schedule === 'string' ? JSON.parse(schedule) : schedule;

    if (scheduleData && typeof scheduleData === 'object' && Object.keys(scheduleData).length > 0) {
      const normalizedSchedule: Record<string, string> = {};
      Object.entries(scheduleData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          normalizedSchedule[key] = String(value);
        }
      });
      return normalizedSchedule;
    }
  } catch {
    return null;
  }

  return null;
}

export function generateTimeSlotsFromSchedule(
  selectedDate: Date,
  classSchedule: Record<string, string>,
  classData: ClassItem,
): ClassSlot[] {
  const date = new Date(selectedDate);
  const selectedDateStr = formatDateStr(date);
  const selectedDay = date.getDay();
  const selectedDayName = DAY_NAMES[selectedDay];

  const slots: ClassSlot[] = [];

  Object.entries(classSchedule).forEach(([dayGroup, timeStr]) => {
    if (!timeStr || typeof timeStr !== 'string') {
      return;
    }

    const days = parseDayGroup(dayGroup);

    if (!days.includes(selectedDayName)) return;

    const times = timeStr
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);
    times.forEach((time) => {
      const [hours, minutes] = time.split(':').map(Number);
      if (isNaN(hours) || isNaN(minutes)) {
        return;
      }

      const startAt = new Date(date);
      startAt.setHours(hours, minutes, 0, 0);

      const endAt = new Date(startAt);
      endAt.setHours(hours + 1, minutes, 0, 0);

      slots.push({
        id: `schedule-${selectedDayName}-${time}-${selectedDateStr}`,
        classId: classData.id,
        startAt: startAt.toISOString(),
        endAt: endAt.toISOString(),
        capacity: classData.capacity,
        currentReservation: 0,
        isOpen: true,
        createdAt: new Date().toISOString(),
      });
    });
  });

  return slots;
}

export function generateTodayScheduleEvents(
  classData: ClassItem,
  classSchedule: Record<string, string>,
): ScheduleEvent[] {
  const events: ScheduleEvent[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayDayName = DAY_NAMES[today.getDay()];

  Object.entries(classSchedule).forEach(([dayGroup, timeStr]) => {
    const days = parseDayGroup(dayGroup);

    if (!days.includes(todayDayName)) {
      return;
    }

    const times = timeStr.split(',').map((t) => t.trim());

    times.forEach((time) => {
      const [hours, minutes] = time.split(':').map(Number);
      if (isNaN(hours) || isNaN(minutes)) return;

      const eventDate = new Date(today);
      eventDate.setHours(hours, minutes, 0, 0);

      const endDate = new Date(eventDate);
      endDate.setHours(hours + 1, minutes, 0, 0);

      const dateKey = formatDateStr(eventDate);
      events.push({
        id: `schedule-${classData.id}-${todayDayName}-${time}-${dateKey}`,
        classId: classData.id,
        slotId: `schedule-${classData.id}-${todayDayName}-${time}-${dateKey}`,
        title: classData.title,
        start: eventDate.toISOString(),
        end: endDate.toISOString(),
        resource: {
          className: classData.title,
          category: classData.category || '',
          level: classData.level || '',
          capacity: classData.capacity,
          currentReservations: classData._count?.reservations ?? 0,
          maxCapacity: classData.capacity,
          isOpen: true,
        },
      });
    });
  });

  return events;
}

export function generateWeekScheduleEvents(
  classData: ClassItem,
  classSchedule: Record<string, string>,
): ScheduleEvent[] {
  const events: ScheduleEvent[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const { monday, sunday } = getWeekRange(today);

  Object.entries(classSchedule).forEach(([dayGroup, timeStr]) => {
    const days = parseDayGroup(dayGroup);
    const times = timeStr.split(',').map((t) => t.trim());

    days.forEach((day) => {
      times.forEach((time) => {
        const [hours, minutes] = time.split(':').map(Number);
        if (isNaN(hours) || isNaN(minutes)) return;

        const targetDay = DAY_MAP[day];
        const dayIndex = [
          'sunday',
          'monday',
          'tuesday',
          'wednesday',
          'thursday',
          'friday',
          'saturday',
        ].indexOf(targetDay);

        const mondayDay = monday.getDay();
        let daysToAdd = dayIndex - mondayDay;

        if (daysToAdd < 0) {
          daysToAdd += 7;
        }

        const eventDate = new Date(monday);
        eventDate.setDate(monday.getDate() + daysToAdd);
        eventDate.setHours(hours, minutes, 0, 0);

        if (eventDate > sunday) {
          return;
        }

        const endDate = new Date(eventDate);
        endDate.setHours(hours + 1, minutes, 0, 0);

        const dateKey = formatDateStr(eventDate);
        events.push({
          id: `schedule-${classData.id}-${day}-${time}-${dateKey}`,
          classId: classData.id,
          slotId: `schedule-${classData.id}-${day}-${time}-${dateKey}`,
          title: classData.title,
          start: eventDate.toISOString(),
          end: endDate.toISOString(),
          resource: {
            className: classData.title,
            category: classData.category || '',
            level: classData.level || '',
            capacity: classData.capacity,
            currentReservations: classData._count?.reservations ?? 0,
            maxCapacity: classData.capacity,
            isOpen: true,
          },
        });
      });
    });
  });

  return events;
}

export function generateRecurringScheduleEvents(
  classData: ClassItem,
  classSchedule: Record<string, string>,
  weeksAhead: number = 12,
): ScheduleEvent[] {
  const events: ScheduleEvent[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  Object.entries(classSchedule).forEach(([dayGroup, timeStr]) => {
    const days = parseDayGroup(dayGroup);
    const times = timeStr.split(',').map((t) => t.trim());

    days.forEach((day) => {
      times.forEach((time) => {
        const [hours, minutes] = time.split(':').map(Number);
        if (isNaN(hours) || isNaN(minutes)) return;

        for (let week = 0; week < weeksAhead; week++) {
          const eventDate = new Date(today);
          const targetDay = DAY_MAP[day];
          const dayIndex = [
            'sunday',
            'monday',
            'tuesday',
            'wednesday',
            'thursday',
            'friday',
            'saturday',
          ].indexOf(targetDay);

          const currentDay = eventDate.getDay();
          let daysToAdd = dayIndex - currentDay;

          if (week === 0) {
            if (daysToAdd < 0) {
              daysToAdd += 7;
            }
          } else {
            if (daysToAdd < 0) {
              daysToAdd += 7;
            }
            daysToAdd += week * 7;
          }

          eventDate.setDate(eventDate.getDate() + daysToAdd);
          eventDate.setHours(hours, minutes, 0, 0);

          const endDate = new Date(eventDate);
          endDate.setHours(hours + 1, minutes, 0, 0);

          events.push({
            id: `schedule-${day}-${time}-${week}`,
            classId: classData.id,
            slotId: `schedule-${day}-${time}-${week}`,
            title: classData.title,
            start: eventDate.toISOString(),
            end: endDate.toISOString(),
            resource: {
              className: classData.title,
              category: classData.category || '',
              level: classData.level || '',
              capacity: classData.capacity,
              currentReservations: classData._count?.reservations ?? 0,
              maxCapacity: classData.capacity,
              isOpen: true,
            },
          });
        }
      });
    });
  });

  return events;
}

export function getWeekRange(date: Date): { monday: Date; sunday: Date } {
  const dayOfWeek = date.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(date);
  monday.setDate(date.getDate() + mondayOffset);
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  return { monday, sunday };
}

export function convertSlotsToSlotItems(rawSlots: SlotItemResponse[]): SlotItem[] {
  return rawSlots
    .map((slot: SlotItemResponse) => {
      const startAt = typeof slot.startAt === 'string' ? new Date(slot.startAt) : slot.startAt;
      const endAt = typeof slot.endAt === 'string' ? new Date(slot.endAt) : slot.endAt;

      if (isNaN(startAt.getTime()) || isNaN(endAt.getTime())) {
        return null;
      }

      const year = startAt.getFullYear();
      const month = String(startAt.getMonth() + 1).padStart(2, '0');
      const day = String(startAt.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      const startHours = String(startAt.getHours()).padStart(2, '0');
      const startMinutes = String(startAt.getMinutes()).padStart(2, '0');
      const startTimeStr = `${startHours}:${startMinutes}`;

      const endHours = String(endAt.getHours()).padStart(2, '0');
      const endMinutes = String(endAt.getMinutes()).padStart(2, '0');
      const endTimeStr = `${endHours}:${endMinutes}`;

      return {
        id: slot.id,
        date: dateStr,
        startTime: startTimeStr,
        endTime: endTimeStr,
        capacity: slot.capacity,
        currentReservations: slot.currentReservations ?? slot.currentReservation ?? 0,
        isAvailable: slot.isAvailable ?? slot.isOpen ?? true,
        classId: slot.classId || slot.class?.classId || slot.class?.id || '',
      };
    })
    .filter((slot): slot is SlotItem => slot !== null);
}

export function convertSlotsToClassSlots(
  slotsData: SlotItem[],
  rawSlotsData: SlotItemResponse[],
  selectedDate: Date,
): ClassSlot[] {
  const selectedDateStr = formatDateStr(selectedDate);

  return slotsData
    .filter((slot: SlotItem) => {
      if (!slot.date) {
        return false;
      }

      const slotDateStr =
        typeof slot.date === 'string'
          ? slot.date.split('T')[0]
          : formatDateStr(new Date(slot.date));

      const matches = slotDateStr === selectedDateStr;

      const hasTime =
        slot.startTime &&
        slot.endTime &&
        typeof slot.startTime === 'string' &&
        typeof slot.endTime === 'string';

      return matches && hasTime;
    })
    .map((slot: SlotItem) => {
      const rawSlot = rawSlotsData.find((r) => r.id === slot.id);
      if (!rawSlot) {
        return null;
      }

      const startAt =
        typeof rawSlot.startAt === 'string' ? new Date(rawSlot.startAt) : rawSlot.startAt;
      const endAt = typeof rawSlot.endAt === 'string' ? new Date(rawSlot.endAt) : rawSlot.endAt;

      if (isNaN(startAt.getTime()) || isNaN(endAt.getTime())) {
        return null;
      }

      return {
        id: slot.id,
        classId: slot.classId,
        startAt: startAt.toISOString(),
        endAt: endAt.toISOString(),
        capacity: slot.capacity,
        currentReservation: slot.currentReservations,
        isOpen: slot.isAvailable,
        createdAt: new Date().toISOString(),
      };
    })
    .filter((s): s is ClassSlot => s !== null);
}

export function convertSlotsToScheduleEvents(
  rawSlotsData: SlotItemResponse[],
  classData: ClassItem,
): ScheduleEvent[] {
  return rawSlotsData
    .filter((slot: SlotItemResponse) => {
      return slot.startAt && slot.endAt;
    })
    .map((slot: SlotItemResponse) => {
      const startAt = typeof slot.startAt === 'string' ? new Date(slot.startAt) : slot.startAt;
      const endAt = typeof slot.endAt === 'string' ? new Date(slot.endAt) : slot.endAt;

      return {
        id: slot.id,
        classId: slot.classId || slot.class?.classId || slot.class?.id || '',
        slotId: slot.id,
        title: classData.title,
        start: typeof startAt === 'string' ? startAt : startAt.toISOString(),
        end: typeof endAt === 'string' ? endAt : endAt.toISOString(),
        resource: {
          className: classData.title,
          category: classData.category || '',
          level: classData.level || '',
          capacity: slot.capacity,
          currentReservations: slot.currentReservations ?? slot.currentReservation ?? 0,
          maxCapacity: slot.capacity,
          isOpen: slot.isAvailable ?? slot.isOpen ?? true,
        },
      };
    });
}
