'use client';

import { useState, useEffect, useMemo } from 'react';
import DatePicker from './DatePicker';
import TimeSlotList from './TimeSlotList';
import { ClassSlot } from '@/types/class';
import type { SlotItemResponse } from '@/lib/api/class';

interface ScheduleTabProps {
  classId: string;
  /** page에서 getClassDetail 한 번 호출해서 받은 slots (그대로 내려줌) */
  slots?: SlotItemResponse[];
  selectedDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
  onTimeSlotSelect: (slot: ClassSlot) => void;
  selectedTimeSlot: ClassSlot | null;
  reservationSlotId?: string | null;
  reservationHour?: string | null;
}

function formatLocalDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function mapSlotToClassSlot(slot: SlotItemResponse, classId: string): ClassSlot {
  const startAt =
    typeof slot.startAt === 'string' ? slot.startAt : new Date(slot.startAt).toISOString();
  const endAt = typeof slot.endAt === 'string' ? slot.endAt : new Date(slot.endAt).toISOString();
  return {
    id: slot.id,
    classId,
    startAt,
    endAt,
    capacity: slot.capacity,
    currentReservation:
      slot.currentReservation ?? slot.currentReservations ?? slot._count?.reservations ?? 0,
    isOpen: slot.isOpen ?? true,
    createdAt: slot.createdAt
      ? typeof slot.createdAt === 'string'
        ? slot.createdAt
        : new Date(slot.createdAt).toISOString()
      : new Date().toISOString(),
  };
}

export default function ScheduleTab({
  classId,
  slots = [],
  selectedDate,
  onDateSelect,
  onTimeSlotSelect,
  selectedTimeSlot,
  reservationSlotId,
  reservationHour,
}: ScheduleTabProps) {
  const rawSlots = Array.isArray(slots) ? slots : [];
  const allSlots: ClassSlot[] = useMemo(
    () => rawSlots.map((s) => mapSlotToClassSlot(s, classId)),
    [rawSlots, classId],
  );
  const timeSlots = useMemo(() => {
    if (!selectedDate || allSlots.length === 0) return [];
    const selectedStr = formatLocalDate(selectedDate);
    return allSlots.filter((s) => formatLocalDate(new Date(s.startAt)) === selectedStr);
  }, [selectedDate, allSlots]);
  const slotsError = false;
  const slotsLoading = false;

  useEffect(() => {
    if (timeSlots.length === 0) return;
    if (!reservationSlotId && !reservationHour) return;
    if (selectedTimeSlot) {
      const isCorrectSlot = reservationSlotId
        ? selectedTimeSlot.id === reservationSlotId
        : reservationHour
          ? new Date(selectedTimeSlot.startAt).getHours() === parseInt(reservationHour, 10)
          : false;
      if (isCorrectSlot) return;
    }

    let slot: ClassSlot | undefined;
    if (reservationSlotId) {
      slot = timeSlots.find((s) => s.id === reservationSlotId);
    }

    if (!slot && reservationHour) {
      const targetHour = parseInt(reservationHour, 10);
      slot = timeSlots.find((s) => {
        const slotHour = new Date(s.startAt).getHours();
        return slotHour === targetHour;
      });
    }
    if (!slot && reservationSlotId) {
      const hourMatch = reservationSlotId.match(/(\d{2})00$/);
      if (hourMatch) {
        const targetHour = parseInt(hourMatch[1], 10);
        slot = timeSlots.find((s) => {
          const slotHour = new Date(s.startAt).getHours();
          return slotHour === targetHour;
        });
      }
    }

    if (slot) {
      onTimeSlotSelect(slot);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeSlots, reservationSlotId, reservationHour]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-gray-900">날짜 선택</h2>
        <DatePicker selectedDate={selectedDate} onSelect={onDateSelect} />
      </div>

      {selectedDate && (
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-gray-900">시간 선택</h2>
          {slotsLoading ? (
            <div className="flex items-center justify-center rounded-xl bg-gray-100 py-12">
              <p className="text-sm text-gray-500">시간표 불러오는 중...</p>
            </div>
          ) : slotsError ? (
            <div className="rounded-xl bg-red-50 py-8 text-center text-sm text-red-600">
              시간표를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
            </div>
          ) : timeSlots.length === 0 ? (
            <div className="rounded-xl bg-gray-100 py-8 text-center text-sm text-gray-500">
              예약 가능한 시간이 없습니다. 다른 날짜를 선택해 보세요.
            </div>
          ) : (
            <TimeSlotList
              timeSlots={timeSlots}
              selectedTimeSlot={selectedTimeSlot}
              onSelect={onTimeSlotSelect}
            />
          )}
        </div>
      )}
    </div>
  );
}
