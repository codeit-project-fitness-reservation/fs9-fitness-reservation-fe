'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ScheduleCalendar } from '@/components/common';
import { ScheduleEvent } from '@/types';
import Map from '../centers/_components/Map';
import QuickActionCard from '@/components/common/QuickActionCard';
import { MOCK_SCHEDULES, MOCK_NEARBY_CENTERS } from '@/mocks/schedules';

import icMarkerPin from '@/assets/images/marker-pin.svg';
import icCalendar from '@/assets/images/calendar.svg';
import icCoins from '@/assets/images/coins-stacked-01.svg';
import Fitmatch from '@/assets/images/FITMATCH.svg';

export default function CustomerMainPage() {
  const handleEventClick = (event: ScheduleEvent) => {
    console.log('Event clicked:', event);
  };

  return (
    <div className="flex w-full flex-col gap-6 bg-[#FAFAFA] pb-10">
      <div className="mb-6 grid grid-cols-3 gap-2">
        <QuickActionCard
          icon={<Image src={icMarkerPin} alt="" width={24} height={24} />}
          label="내 주변 센터"
          href="/centers"
        />
        <QuickActionCard
          icon={<Image src={icCalendar} alt="" width={24} height={24} />}
          label="클래스 목록"
          href="/classes"
        />
        <QuickActionCard
          icon={<Image src={icCoins} alt="" width={24} height={24} />}
          label="포인트 충전"
          href="/point-charge"
        />
      </div>

      <section className="flex flex-col gap-2 px-4">
        <ScheduleCalendar events={MOCK_SCHEDULES} onEventClick={handleEventClick} />
      </section>

      <section className="flex flex-col gap-3 px-4">
        <h2 className="text-base font-bold text-gray-900">내 주변 센터</h2>
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="relative h-[220px] w-full">
            <Map />
          </div>
          <ul className="divide-y divide-gray-100">
            {MOCK_NEARBY_CENTERS.map((center) => (
              <li key={center.id}>
                <Link
                  href={`/centers/${center.id}`}
                  className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-gray-50"
                >
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                    <Image
                      src={Fitmatch}
                      alt="Fitmatch"
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-gray-900">{center.name}</p>
                    <p className="truncate text-xs text-gray-500">{center.address}</p>
                  </div>
                  <span className="shrink-0 text-xs font-medium text-gray-500">
                    {center.distance}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <Link
          href="/centers"
          className="text-center text-sm font-medium text-blue-600 hover:underline"
        >
          전체 지도 보기
        </Link>
      </section>
    </div>
  );
}
