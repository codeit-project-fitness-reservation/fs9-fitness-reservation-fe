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
}

export default function ScheduleTab({
  classId,
  selectedDate,
  onDateSelect,
  onTimeSlotSelect,
  selectedTimeSlot,
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
    setTimeSlots(getMockClassSlotsForDate({ classId, date: selectedDate }));
  }, [classId, selectedDate]);

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
