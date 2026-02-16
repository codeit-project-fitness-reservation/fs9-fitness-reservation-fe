import Image from 'next/image';
import { ClassSlot } from '@/types/class';
import { formatTime } from '@/lib/utils/date';
import userIcon from '@/assets/images/user-02.svg';

interface TimeSlotListProps {
  timeSlots: ClassSlot[];
  selectedTimeSlot: ClassSlot | null;
  onSelect: (slot: ClassSlot) => void;
}

export default function TimeSlotList({ timeSlots, selectedTimeSlot, onSelect }: TimeSlotListProps) {
  return (
    <div className="flex flex-col gap-3">
      {timeSlots.map((slot) => {
        const isSelected = selectedTimeSlot?.id === slot.id;
        const remaining = slot.capacity - slot.currentReservation;
        const isFull = remaining === 0 || !slot.isOpen;
        const startTime = formatTime(slot.startAt);
        const endTime = formatTime(slot.endAt);

        return (
          <button
            key={slot.id}
            onClick={() => !isFull && onSelect(slot)}
            disabled={isFull && !isSelected}
            className={`flex items-center justify-between rounded-lg border-2 p-4 text-left transition-colors ${
              isSelected
                ? 'border-blue-500 bg-blue-50'
                : isFull
                  ? 'border-gray-500 bg-gray-100 opacity-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="flex flex-col gap-1">
              <p className="text-base font-medium text-gray-900">
                {startTime} ~ {endTime}
              </p>
              <div className="flex items-center gap-2">
                <Image src={userIcon} alt="예약 인원" width={16} height={16} />
                <p className="text-sm text-gray-500">
                  {slot.currentReservation}/{slot.capacity}
                </p>
                {!isFull && <p className="text-sm text-gray-500">{remaining}명 남음</p>}
                {isFull && <p className="text-sm text-gray-800">마감</p>}
              </div>
            </div>
            <div
              className={`h-5 w-5 shrink-0 rounded-full border-2 ${
                isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300 bg-white'
              }`}
            >
              {isSelected && (
                <div className="flex h-full w-full items-center justify-center">
                  <div className="h-2 w-2 rounded-full bg-white" />
                </div>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
