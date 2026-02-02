import { format, parseISO } from 'date-fns';
import { ClassSlot } from '@/types/class';

interface TimeSlotListProps {
  timeSlots: ClassSlot[];
  selectedTimeSlot: ClassSlot | null;
  onSelect: (slot: ClassSlot) => void;
}

export default function TimeSlotList({ timeSlots, selectedTimeSlot, onSelect }: TimeSlotListProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {timeSlots.map((slot) => {
        const isSelected = selectedTimeSlot?.id === slot.id;
        const remaining = slot.capacity - slot.currentReservation;
        const isFull = remaining === 0 || !slot.isOpen;
        const startTime = format(parseISO(slot.startAt), 'HH:mm');
        const endTime = format(parseISO(slot.endAt), 'HH:mm');

        return (
          <button
            key={slot.id}
            onClick={() => !isFull && onSelect(slot)}
            disabled={isFull}
            className={`flex items-center justify-between rounded-lg border-2 p-4 text-left transition-colors ${
              isSelected
                ? 'border-blue-500 bg-blue-50'
                : isFull
                  ? 'border-gray-200 bg-gray-50 opacity-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`h-5 w-5 rounded-full border-2 ${
                  isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300 bg-white'
                }`}
              >
                {isSelected && (
                  <div className="flex h-full w-full items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-white" />
                  </div>
                )}
              </div>
              <div>
                <p className="text-base font-medium text-gray-900">
                  {startTime} ~ {endTime}
                </p>
                <p className="text-sm text-gray-500">
                  {slot.currentReservation}/{slot.capacity}
                </p>
              </div>
            </div>
            {!isFull && <p className="text-sm font-medium text-blue-600">{remaining}명 남음</p>}
            {isFull && <p className="text-sm font-medium text-gray-400">마감</p>}
          </button>
        );
      })}
    </div>
  );
}
