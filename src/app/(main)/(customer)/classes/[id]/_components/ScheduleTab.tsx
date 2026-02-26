'use client';

import { useState, useEffect } from 'react';
import DatePicker from './DatePicker';
import TimeSlotList from './TimeSlotList';
import { ClassSlot } from '@/types/class';
import { classApi } from '@/lib/api/class';

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
  const [allSlots, setAllSlots] = useState<ClassSlot[]>([]);

  // 클래스 상세 조회하여 슬롯 정보 가져오기
  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const response = await classApi.getClassDetail(classId);
        if (response.slots) {
          const mappedSlots: ClassSlot[] = response.slots.map((slot) => ({
            id: slot.id,
            classId: classId,
            startAt:
              typeof slot.startAt === 'string'
                ? slot.startAt
                : new Date(slot.startAt).toISOString(),
            endAt: typeof slot.endAt === 'string' ? slot.endAt : new Date(slot.endAt).toISOString(),
            capacity: slot.capacity,
            currentReservation: slot.currentReservation ?? slot.currentReservations ?? 0,
            isOpen: slot.isOpen ?? true,
            createdAt: slot.createdAt
              ? typeof slot.createdAt === 'string'
                ? slot.createdAt
                : new Date(slot.createdAt).toISOString()
              : new Date().toISOString(),
          }));
          setAllSlots(mappedSlots);
        }
      } catch (error) {
        console.error('슬롯 정보 조회 실패:', error);
      }
    };

    void fetchSlots();
  }, [classId]);

  // 선택된 날짜에 해당하는 슬롯 필터링
  useEffect(() => {
    if (!selectedDate || allSlots.length === 0) {
      setTimeSlots([]);
      return;
    }

    const selectedDateStr = selectedDate.toISOString().split('T')[0];
    const filteredSlots = allSlots.filter((slot) => {
      const slotDateStr = new Date(slot.startAt).toISOString().split('T')[0];
      return slotDateStr === selectedDateStr;
    });

    setTimeSlots(filteredSlots);
  }, [selectedDate, allSlots]);

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
