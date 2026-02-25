'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ScheduleCalendar } from '@/components/common';
import QuickActionCard from '@/components/common/QuickActionCard';
import { reservationApi } from '@/lib/api/reservation';
import { centerApi } from '@/lib/api/center';
import type { ReservationDetail } from '@/lib/api/reservation';
import type { ScheduleEvent } from '@/types';
import type { CenterItem } from '@/lib/api/center';
import icMarkerPin from '@/assets/images/marker-pin.svg';
import icCalendar from '@/assets/images/calendar.svg';
import icCoins from '@/assets/images/coins-stacked-01.svg';

function reservationToScheduleEvent(r: ReservationDetail): ScheduleEvent {
  const start = r.slot?.startAt ?? r.slotStartAt;
  const end = r.slot?.endAt ?? start;
  return {
    id: r.id,
    classId: r.classId,
    slotId: r.slotId,
    title: r.class?.title ?? '예약',
    start: typeof start === 'string' ? start : new Date(start).toISOString(),
    end: typeof end === 'string' ? end : new Date(end).toISOString(),
    resource: {
      className: r.class?.title ?? '',
      category: '',
      level: '',
      capacity: r.slot?.capacity ?? 0,
      currentReservations: r.slot?._count?.reservations ?? 0,
      maxCapacity: r.slot?.capacity ?? 0,
      isOpen: true,
    },
  };
}

export default function CustomerMainPage() {
  const [scheduleEvents, setScheduleEvents] = useState<ScheduleEvent[]>([]);
  const [centers, setCenters] = useState<CenterItem[]>([]);
  const [scheduleLoading, setScheduleLoading] = useState(true);
  const [centersLoading, setCentersLoading] = useState(true);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setScheduleLoading(true);
        const res = await reservationApi.getMyReservations({
          status: 'BOOKED',
          limit: 100,
        });
        const list = res?.data ?? [];
        setScheduleEvents(list.map(reservationToScheduleEvent));
      } catch {
        setScheduleEvents([]);
      } finally {
        setScheduleLoading(false);
      }
    };
    void fetchReservations();
  }, []);

  useEffect(() => {
    const fetchCenters = async () => {
      try {
        setCentersLoading(true);
        const res = await centerApi.getCenters({ limit: 6 });
        setCenters(res?.data ?? []);
      } catch {
        setCenters([]);
      } finally {
        setCentersLoading(false);
      }
    };
    void fetchCenters();
  }, []);

  return (
    <div className="flex flex-col gap-10 px-4 pt-6 pb-10 md:px-8">
      {/* 퀵 액션 카드 3개: 내 주변 센터, 클래스 목록, 포인트 충전 */}
      <section className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        <QuickActionCard
          icon={<Image src={icMarkerPin} alt="" width={28} height={28} />}
          label="내 주변 센터"
          href="/centers"
        />
        <QuickActionCard
          icon={<Image src={icCalendar} alt="" width={28} height={28} />}
          label="클래스 목록"
          href="/classes"
        />
        <QuickActionCard
          icon={<Image src={icCoins} alt="" width={28} height={28} />}
          label="포인트 충전"
          href="/point-charge"
        />
      </section>

      {/* 주간 일정표 */}
      <section className="flex flex-col gap-2">
        <h2 className="text-xl font-bold text-gray-800">주간 일정표</h2>
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          {scheduleLoading ? (
            <div className="flex h-[400px] items-center justify-center text-gray-500">
              로딩 중...
            </div>
          ) : (
            <ScheduleCalendar
              events={scheduleEvents}
              onEventClick={() => {}}
              title=""
              showViewToggle={false}
              initialView="timeGridWeek"
            />
          )}
        </div>
      </section>

      {/* 내 주변 센터 */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">내 주변 센터</h2>
          <Link href="/centers" className="text-sm font-medium text-blue-600 hover:underline">
            지도에서 보기
          </Link>
        </div>
        {centersLoading ? (
          <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-gray-500">
            로딩 중...
          </div>
        ) : centers.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-8 text-center text-gray-500">
            주변 센터를 불러올 수 없습니다.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {centers.slice(0, 6).map((center) => (
              <Link
                key={center.id}
                href={`/centers/${center.id}`}
                className="flex gap-4 rounded-xl border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md"
              >
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-200" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-gray-900">{center.name}</p>
                  <p className="mt-1 truncate text-sm text-gray-500">{center.address1}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
