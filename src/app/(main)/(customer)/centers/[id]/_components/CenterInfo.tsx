'use client';

import Image from 'next/image';
import { Center } from '@/types';
import mapPinIcon from '@/assets/images/map-pin.svg';
import clockIcon from '@/assets/images/clock.svg';

interface CenterInfoProps {
  centerData: Center;
}

export default function CenterInfo({ centerData }: CenterInfoProps) {
  const formatBusinessHours = (businessHours?: Record<string, unknown>) => {
    if (!businessHours) return null;

    const weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
    const weekdayHours = weekdays
      .map((day) => businessHours[day])
      .filter(Boolean)
      .map((hours) => String(hours));

    if (weekdayHours.length === 0) return null;

    const uniqueHours = [...new Set(weekdayHours)];
    if (uniqueHours.length === 1) {
      const saturday = businessHours.saturday ? String(businessHours.saturday) : null;
      const sunday = businessHours.sunday ? String(businessHours.sunday) : null;

      if (saturday && sunday && saturday === sunday) {
        return `평일 ${uniqueHours[0]} / 주말 ${saturday}`;
      }
      if (saturday || sunday) {
        return `평일 ${uniqueHours[0]}${saturday ? ` / 토 ${saturday}` : ''}${sunday ? ` / 일 ${sunday}` : ''}`;
      }
      return `평일 ${uniqueHours[0]}`;
    }

    return `평일 ${uniqueHours[0]}`;
  };

  const businessHoursText = formatBusinessHours(centerData.businessHours);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-gray-900 max-[768px]:text-xl">{centerData.name}</h1>

      <div className="flex items-start gap-2">
        <Image src={mapPinIcon} alt="위치" width={20} height={20} className="mt-0.5 shrink-0" />
        <p className="text-base text-gray-700">
          {centerData.address1} {centerData.address2 || ''}
        </p>
      </div>
      {businessHoursText && (
        <div className="flex items-start gap-2">
          <Image
            src={clockIcon}
            alt="운영시간"
            width={20}
            height={20}
            className="mt-0.5 shrink-0"
          />
          <p className="text-base text-gray-700">{businessHoursText}</p>
        </div>
      )}

      {centerData.introduction && (
        <p className="text-base text-gray-600">{centerData.introduction}</p>
      )}
    </div>
  );
}
