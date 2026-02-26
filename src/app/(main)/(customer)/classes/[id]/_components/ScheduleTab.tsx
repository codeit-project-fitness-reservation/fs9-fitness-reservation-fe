'use client';

import { useState, useEffect } from 'react';
import DatePicker from './DatePicker';
import TimeSlotList from './TimeSlotList';
import { ClassSlot } from '@/types/class';
import { classApi, type SlotItemResponse } from '@/lib/api/class';

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
  const [slotsLoading, setSlotsLoading] = useState(true);
  const [slotsError, setSlotsError] = useState(false);

  // 클래스 상세 조회
  useEffect(() => {
    const fetchSlots = async () => {
      setSlotsError(false);
      setSlotsLoading(true);
      try {
        const response = await classApi.getClassDetail(classId);
        const rawSlots = response.slots ?? [];
        const mappedSlots: ClassSlot[] = rawSlots.map((slot: SlotItemResponse) => ({
          id: slot.id,
          classId: classId,
          startAt:
            typeof slot.startAt === 'string' ? slot.startAt : new Date(slot.startAt).toISOString(),
          endAt: typeof slot.endAt === 'string' ? slot.endAt : new Date(slot.endAt).toISOString(),
          capacity: slot.capacity,
          currentReservation:
            slot.currentReservation ?? slot.currentReservations ?? slot._count?.reservations ?? 0,
          isOpen: slot.isOpen ?? true,
          createdAt: slot.createdAt
            ? typeof slot.createdAt === 'string'
              ? slot.createdAt
              : new Date(slot.createdAt).toISOString()
            : new Date().toISOString(),
        }));
        setAllSlots(mappedSlots);
      } catch (error) {
        console.error('슬롯 정보 조회 실패:', error);
        setSlotsError(true);
        setAllSlots([]);
      } finally {
        setSlotsLoading(false);
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
