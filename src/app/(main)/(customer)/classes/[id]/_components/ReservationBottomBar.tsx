import Image from 'next/image';
import { format, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';
import { BaseButton } from '@/components/common/BaseButton';
import { ClassSlot } from '@/types/class';
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
  const startTime = format(parseISO(selectedTimeSlot.startAt), 'HH:mm');
  return (
    <div className="fixed right-0 bottom-0 left-0 z-50 border-t border-gray-200 bg-white px-4 py-4 shadow-lg max-[768px]:px-4">
      <div className="mx-auto flex max-w-[960px] items-center justify-between gap-4 max-[1200px]:max-w-full">
        <div className="flex items-center gap-2">
          <Image src={calendarIcon} alt="달력" width={20} height={20} />
          <p className="text-base font-medium text-gray-900">
            {format(selectedDate, 'MM월 dd일(E)', { locale: ko })} {startTime}
          </p>
        </div>
        <BaseButton variant="primary" onClick={onReservation} className="min-w-[120px]">
          예약하기
        </BaseButton>
      </div>
    </div>
  );
}
