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
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTimeSlots([]);
      return;
    }

    // TODO: API 호출로 대체 - 선택한 날짜의 시간 슬롯 가져오기
    const slots = getMockClassSlotsForDate({ classId, date: selectedDate });
    setTimeSlots(slots);
  }, [classId, selectedDate]);

  // 예약 정보가 있을 때 해당 시간 슬롯 자동 선택 (시간 슬롯이 로드된 후 실행)
  useEffect(() => {
    if (timeSlots.length === 0) return;

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
      if (!selectedTimeSlot || selectedTimeSlot.id !== slot.id) {
        onTimeSlotSelect(slot);
      }
    }
  }, [timeSlots, reservationSlotId, reservationHour, selectedTimeSlot, onTimeSlotSelect]);

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
