'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import DatePicker from './DatePicker';
import TimeSlotList from './TimeSlotList';
import { ClassSlot } from '@/types/class';

interface ScheduleTabProps {
  selectedDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
  onTimeSlotSelect: (slot: ClassSlot) => void;
  selectedTimeSlot: ClassSlot | null;
}

export default function ScheduleTab({
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
    // 선택한 날짜의 시작 시간을 기준으로 슬롯 생성
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const mockTimeSlots: ClassSlot[] = [
      {
        id: 'slot-1',
        classId: 'class-1',
        startAt: `${dateStr}T13:00:00.000Z`,
        endAt: `${dateStr}T14:00:00.000Z`,
        capacity: 10,
        currentReservation: 8,
        isOpen: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'slot-2',
        classId: 'class-1',
        startAt: `${dateStr}T14:00:00.000Z`,
        endAt: `${dateStr}T15:00:00.000Z`,
        capacity: 10,
        currentReservation: 8,
        isOpen: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'slot-3',
        classId: 'class-1',
        startAt: `${dateStr}T15:00:00.000Z`,
        endAt: `${dateStr}T16:00:00.000Z`,
        capacity: 10,
        currentReservation: 8,
        isOpen: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'slot-4',
        classId: 'class-1',
        startAt: `${dateStr}T16:00:00.000Z`,
        endAt: `${dateStr}T17:00:00.000Z`,
        capacity: 10,
        currentReservation: 10,
        isOpen: false,
        createdAt: new Date().toISOString(),
      },
    ];

    setTimeSlots(mockTimeSlots);
  }, [selectedDate]);

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
