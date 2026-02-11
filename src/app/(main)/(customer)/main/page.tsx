'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ScheduleCalendar } from '@/components/common';
import { ScheduleEvent } from '@/types';
import Map from '../centers/_components/Map';
import QuickActionCard from '@/components/common/QuickActionCard';

import icMarkerPin from '@/assets/images/marker-pin.svg';
import icCalendar from '@/assets/images/calendar.svg';
import icCoins from '@/assets/images/coins-stacked-01.svg';
import Fitmatch from '@/assets/images/FITMATCH.svg';

const MOCK_SCHEDULES: ScheduleEvent[] = [
  {
    id: '1',
    classId: 'class-1',
    slotId: 'slot-1',
    title: '필라테스 기초',
    start: new Date(new Date().setHours(10, 0, 0, 0)),
    end: new Date(new Date().setHours(11, 0, 0, 0)),
  },
  {
    id: '2',
    classId: 'class-2',
    slotId: 'slot-2',
    title: '요가 중급',
    start: new Date(new Date().setDate(new Date().getDate() + 1)),
    end: new Date(new Date().setDate(new Date().getDate() + 1)),
  },
];

const MOCK_NEARBY_CENTERS = [
  {
    id: '1',
    name: '에이원 필라테스',
    address: '경기 성남시 분당구 123-869',
    distance: '0.5km',
  },
  {
    id: '2',
    name: '울룰루 요가',
    address: '경기 성남시 분당구 123-869',
    distance: '1.3km',
  },
  {
    id: '3',
    name: '파워 짐 성남',
    address: '경기 성남시 분당구 123-869',
    distance: '1.2km',
  },
];

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
