'use client';

// 1. dynamic 임포트 추가
import dynamic from 'next/dynamic';
import Image from 'next/image';
import ClassCard from '@/components/seller/ClassCard';
import QuickActionCard from '@/components/common/QuickActionCard';
import { MOCK_SELLER_SCHEDULES, MOCK_SELLER_CLASSES } from '@/mocks/mockdata';
import { ScheduleEvent } from '@/types';

import icPlus from '@/assets/images/plus.svg';
import icCalendar from '@/assets/images/calendar.svg';
import icCoins from '@/assets/images/coins-stacked-01.svg';

// 2. ScheduleCalendar를 클라이언트 사이드에서만 로드하도록 설정
const ScheduleCalendar = dynamic(
  () => import('@/components/common').then((mod) => mod.ScheduleCalendar),
  { ssr: false },
);

export default function SellerPage() {
  // mounted 상태가 더 이상 필요하지 않아 제거합니다.

  // Mock 데이터 정렬 로직
  const sortedClasses = [...MOCK_SELLER_CLASSES].sort((a, b) => {
    if (a.status === 'APPROVED' && b.status !== 'APPROVED') return -1;
    if (a.status !== 'APPROVED' && b.status === 'APPROVED') return 1;
    return 0;
  });

  const handleEventClick = (event: ScheduleEvent) => {
    void event;
  };

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
          {sortedClasses.length === 0 ? (
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-8 text-center">
              <p className="text-sm text-gray-500">등록된 클래스가 없습니다.</p>
              <p className="mt-1 text-sm text-gray-400">새 클래스를 등록해보세요!</p>
            </div>
          ) : (
            sortedClasses.map((classItem) => <ClassCard key={classItem.id} {...classItem} />)
          )}
        </div>
      </section>

      {/* 3. mounted 체크 없이 바로 사용 가능 */}
      <section>
        <ScheduleCalendar events={MOCK_SELLER_SCHEDULES} onEventClick={handleEventClick} />
      </section>
    </div>
  );
}
