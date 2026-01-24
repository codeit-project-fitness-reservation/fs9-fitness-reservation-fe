'use client';

import Image from 'next/image';
import { ScheduleCalendar } from '@/components/common';
import ClassCard from '@/components/seller/ClassCard';
import QuickActionCard from '@/components/common/QuickActionCard';
import { MOCK_SELLER_CLASSES, MOCK_SELLER_SCHEDULES } from '@/mocks/mockdata';
import { ScheduleEvent } from '@/types';

import icPlus from '@/assets/images/plus.svg';
import icCalendar from '@/assets/images/calendar.svg';
import icCoins from '@/assets/images/coins-stacked-01.svg';

export default function SellerPage() {
  const handleEventClick = (event: ScheduleEvent) => {
    console.log('클릭된 스케줄:', event);
  };

  return (
    <div className="py-6">
      <div className="mb-6 grid grid-cols-3 gap-2">
        <QuickActionCard
          icon={<Image src={icPlus} alt="" width={24} height={24} />}
          label="새 클래스 등록"
          href="/seller/items"
        />
        <QuickActionCard
          icon={<Image src={icCalendar} alt="" width={24} height={24} />}
          label="내 예약 관리"
          href="/seller/reservations"
        />
        <QuickActionCard
          icon={<Image src={icCoins} alt="" width={24} height={24} />}
          label="마이페이지"
          href="/seller/mypage"
        />
      </div>

      {/* 내 클래스 목록 */}
      <section className="mb-6">
        <h2 className="mb-2 text-base font-semibold text-gray-800">내 클래스 목록</h2>
        <div className="space-y-2">
          {MOCK_SELLER_CLASSES.map((classItem) => (
            <ClassCard key={classItem.id} {...classItem} />
          ))}
        </div>
      </section>

      <section>
        <ScheduleCalendar events={MOCK_SELLER_SCHEDULES} onEventClick={handleEventClick} />
      </section>
    </div>
  );
}
