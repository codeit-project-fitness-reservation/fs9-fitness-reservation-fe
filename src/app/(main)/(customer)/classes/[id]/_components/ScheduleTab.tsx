'use client';

import { useState, useEffect } from 'react';
import DatePicker from './DatePicker';
import TimeSlotList from './TimeSlotList';
import { ClassSlot } from '@/types/class';
import { getMockClassSlotsForDate } from '@/mocks/classSlots';

interface ScheduleTabProps {
  classId: string;
  selectedDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
  onTimeSlotSelect: (slot: ClassSlot) => void;
  selectedTimeSlot: ClassSlot | null;
  reservationSlotId?: string | null;
  reservationHour?: string | null;
}

export default function ScheduleTab({
  classId,
  selectedDate,
  onDateSelect,
  onTimeSlotSelect,
  selectedTimeSlot,
  reservationSlotId,
  reservationHour,
}: ScheduleTabProps) {
  const [timeSlots, setTimeSlots] = useState<ClassSlot[]>([]);

  // 선택한 날짜에 따른 시간 슬롯 로드
  useEffect(() => {
    if (!selectedDate) {
      setTimeSlots([]);
      return;
    }

    // TODO: API 호출로 대체 - 선택한 날짜의 시간 슬롯 가져오기
    const slots = getMockClassSlotsForDate({ classId, date: selectedDate });
    setTimeSlots(slots);
  }, [classId, selectedDate]);

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
      {/* 날짜 선택 */}
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-gray-900">날짜 선택</h2>
        <DatePicker selectedDate={selectedDate} onSelect={onDateSelect} />
      </div>

      {/* 시간 선택 */}
      {selectedDate && (
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-gray-900">시간 선택</h2>
          <TimeSlotList
            timeSlots={timeSlots}
            selectedTimeSlot={selectedTimeSlot}
            onSelect={onTimeSlotSelect}
          />
        </div>
      )}
    </div>
  );
}
