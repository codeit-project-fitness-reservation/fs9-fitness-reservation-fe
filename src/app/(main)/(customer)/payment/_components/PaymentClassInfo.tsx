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
    <div className="flex flex-col gap-3 rounded-lg bg-white p-4">
      <h2 className="text-xl font-bold text-gray-900">{classData.title}</h2>

      <div className="flex items-start gap-2">
        <Image src={mapPinIcon} alt="위치" width={20} height={20} className="mt-0.5 shrink-0" />
        <p className="text-base text-gray-700">
          {centerData.address1} {centerData.address2 || ''}
        </p>
      </div>

      <div className="flex items-start gap-2">
        <Image src={clockIcon} alt="시간" width={20} height={20} className="mt-0.5 shrink-0" />
        <p className="text-base text-gray-700">
          {dateStr} {timeStr}
        </p>
      </div>
    </div>
  );
}
