'use client';

import Image from 'next/image';
import { BaseButton } from '@/components/common/BaseButton';
import { ClassSlot } from '@/types/class';
import { formatTime, formatDateWithDay } from '@/lib/utils/date';
import calendarIcon from '@/assets/images/calendar.svg';

interface ReservationBottomBarProps {
  selectedDate: Date;
  selectedTimeSlot: ClassSlot;
  onReservation: () => void;
}

export default function ReservationBottomBar({
  selectedDate,
  selectedTimeSlot,
  onReservation,
}: ReservationBottomBarProps) {
  const startTime = formatTime(selectedTimeSlot.startAt);

  return (
    <div className="fixed bottom-0 left-1/2 z-50 flex w-full max-w-240 -translate-x-1/2 justify-center border-t border-gray-200 bg-white">
      <div className="flex w-full max-w-240 flex-col px-4 pt-3 pb-4">
        <div className="mb-2.5 flex h-5 items-center gap-1 md:h-6 md:gap-1.5">
          <Image src={calendarIcon} alt="달력" width={16} height={16} className="md:h-5 md:w-5" />

          <p
            suppressHydrationWarning
            className="text-sm leading-5 font-medium text-gray-900 md:text-base md:leading-6"
          >
            {formatDateWithDay(selectedDate)} {startTime}
          </p>
        </div>

        <BaseButton variant="primary" onClick={onReservation} className="h-12 w-full">
          예약하기
        </BaseButton>
      </div>
    </div>
  );
}
