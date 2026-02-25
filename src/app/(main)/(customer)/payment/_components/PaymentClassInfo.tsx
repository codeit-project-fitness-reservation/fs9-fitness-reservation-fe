'use client';

import Image from 'next/image';
import { Class } from '@/types/class';
import { Center } from '@/types';
import { ClassSlot } from '@/types/class';
import mapPinIcon from '@/assets/images/map-pin.svg';
import clockIcon from '@/assets/images/clock.svg';
import { format } from 'date-fns';

interface PaymentClassInfoProps {
  classData: Class;
  centerData: Center;
  slotData: ClassSlot;
}

export default function PaymentClassInfo({
  classData,
  centerData,
  slotData,
}: PaymentClassInfoProps) {
  const startDate =
    typeof slotData.startAt === 'string' ? new Date(slotData.startAt) : slotData.startAt;
  const endDate = typeof slotData.endAt === 'string' ? new Date(slotData.endAt) : slotData.endAt;

  const dateStr = format(startDate, 'yyyy.MM.dd.');
  const timeStr = `${format(startDate, 'HH:mm')}-${format(endDate, 'HH:mm')}`;

  return (
    <div className="w-full overflow-hidden rounded-xl border border-gray-200 bg-white p-6">
      <div className="flex flex-col gap-2">
        <p className="text-lg leading-7 font-bold text-gray-900">{classData.title}</p>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <Image src={mapPinIcon} alt="" width={16} height={16} className="shrink-0" />
            <p className="text-sm leading-5 font-normal text-gray-500">
              {centerData.address1} {centerData.address2 || ''}
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <Image src={clockIcon} alt="" width={16} height={16} className="shrink-0" />
            <p className="text-sm leading-5 font-normal text-gray-500">
              {dateStr} {timeStr}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
