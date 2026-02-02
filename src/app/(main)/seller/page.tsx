'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ScheduleCalendar } from '@/components/common';
import ClassCard from '@/components/seller/ClassCard';
import QuickActionCard from '@/components/common/QuickActionCard';
import { MOCK_SELLER_SCHEDULES } from '@/mocks/mockdata';
import { ScheduleEvent, ClassItem } from '@/types';

import icPlus from '@/assets/images/plus.svg';
import icCalendar from '@/assets/images/calendar.svg';
import icCoins from '@/assets/images/coins-stacked-01.svg';

export default function SellerPage() {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 로컬 스토리지에서 클래스 목록 불러오기
    const loadClasses = () => {
      try {
        const storedClasses = localStorage.getItem('myClasses');

        if (storedClasses) {
          const parsedClasses = JSON.parse(storedClasses);
          setClasses(parsedClasses);
        } else {
          setClasses([]);
        }
      } catch (error) {
        console.error('클래스 목록 로드 중 에러:', error);
        setClasses([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadClasses();

    window.addEventListener('storage', loadClasses);
    return () => window.removeEventListener('storage', loadClasses);
  }, []);

  const handleEventClick = (event: ScheduleEvent) => {
    void event;
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">로딩 중...</p>
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
          label="내 예약 관리"
          href="/seller/reservations"
        />
        <QuickActionCard
          icon={<Image src={icCoins} alt="" width={24} height={24} />}
          label="매출 정산"
          href="/seller/sales"
        />
      </div>

      {/* 내 클래스 목록 */}
      <section className="mb-6">
        <h2 className="mb-2 text-base font-semibold text-gray-800">내 클래스 목록</h2>
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
        <ScheduleCalendar events={MOCK_SELLER_SCHEDULES} onEventClick={handleEventClick} />
      </section>
    </div>
  );
}
