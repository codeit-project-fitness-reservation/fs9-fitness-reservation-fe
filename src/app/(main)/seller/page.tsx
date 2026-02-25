'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { ScheduleCalendar } from '@/components/common';
import ClassCard from '@/components/seller/ClassCard';
import QuickActionCard from '@/components/common/QuickActionCard';
import { ScheduleEvent, ClassItem } from '@/types';

import { classApi, ClassItem as ApiClassItem } from '@/lib/api/class';
import { generateWeekScheduleEvents, parseSchedule } from '@/lib/utils/schedule';

import icPlus from '@/assets/images/plus.svg';
import icCalendar from '@/assets/images/calendar.svg';
import icCoins from '@/assets/images/coins-stacked-01.svg';

export default function SellerPage() {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setIsLoading(true);

        const responseData = await classApi.getClasses({ limit: 100 });
        const apiClasses: ApiClassItem[] = responseData?.data || [];

        const uiClasses: ClassItem[] = apiClasses.map((apiClass) => ({
          id: apiClass.id,
          centerId: apiClass.center.id,
          title: apiClass.title,
          category: apiClass.category || '',
          level: apiClass.level || '',
          pricePoints: apiClass.pricePoints,
          capacity: apiClass.capacity,
          description: apiClass.description || '',
          notice: apiClass.notice || '',
          bannerUrl: apiClass.bannerUrl || undefined,
          imgUrls: apiClass.imgUrls || [],
          status: apiClass.status,
          rejectReason: undefined,
          schedule: apiClass.schedule,
          createdAt: apiClass.createdAt,
          updatedAt: apiClass.updatedAt ?? apiClass.createdAt,
          center: apiClass.center,
          _count: apiClass._count,
          displayCapacity:
            apiClass.status.toUpperCase() === 'APPROVED'
              ? `${apiClass._count?.reservations ?? 0}/${apiClass.capacity}`
              : undefined,
          statusLabel: undefined,
        }));

        const sortedClasses = uiClasses.sort((a, b) => {
          const statusOrder: Record<string, number> = {
            APPROVED: 0,
            PENDING: 1,
            REJECTED: 2,
          };
          const aOrder = statusOrder[a.status.toUpperCase()] ?? 999;
          const bOrder = statusOrder[b.status.toUpperCase()] ?? 999;
          return aOrder - bOrder;
        });

        setClasses(sortedClasses);
      } catch {
        setClasses([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClasses();
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  const weekScheduleEvents = useMemo((): ScheduleEvent[] => {
    if (!mounted) return [];
    const approvedClasses = classes.filter((c) => c.status.toUpperCase() === 'APPROVED');
    const allEvents: ScheduleEvent[] = [];

    approvedClasses.forEach((classItem) => {
      const schedule = (
        classItem as ClassItem & { schedule?: string | Record<string, string> | null }
      ).schedule;
      const parsedSchedule = parseSchedule(schedule);

      if (parsedSchedule) {
        const events = generateWeekScheduleEvents(classItem, parsedSchedule);
        allEvents.push(...events);
      }
    });

    return allEvents;
  }, [classes, mounted]);

  const handleEventClick = (event: ScheduleEvent) => {
    void event;
  };

  if (!mounted || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="font-medium text-gray-500">데이터를 불러오는 중입니다...</p>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="mb-6 grid grid-cols-3 gap-2">
        <QuickActionCard
          icon={<Image src={icPlus} alt="" width={24} height={24} />}
          label="새 클래스 등록"
          href="/seller/class-register"
        />
        <QuickActionCard
          icon={<Image src={icCalendar} alt="" width={24} height={24} />}
          label="내 클래스 관리"
          href="/seller/classes"
        />
        <QuickActionCard
          icon={<Image src={icCoins} alt="" width={24} height={24} />}
          label="매출 정산"
          href="/seller/sales"
        />
      </div>

      <section className="mb-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-800">내 클래스 목록</h2>
        </div>

        <div className="space-y-2">
          {classes.length === 0 ? (
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-8 text-center">
              <p className="text-sm text-gray-500">등록된 클래스가 없습니다.</p>
              <p className="mt-1 text-sm text-gray-400">새 클래스를 등록해보세요!</p>
            </div>
          ) : (
            classes.map((classItem) => <ClassCard key={classItem.id} {...classItem} />)
          )}
        </div>
      </section>

      <section>
        <ScheduleCalendar events={weekScheduleEvents} onEventClick={handleEventClick} />
      </section>
    </div>
  );
}
