'use client';

import AdminFilter, { reservationFilterConfigs, FilterValues } from '../_components/AdminFilter';

export default function AdminReservationsPage() {
  const handleFilterChange = (filters: FilterValues) => {
    console.log('예약 필터 변경:', filters);
    // 차후 데이터 가져오는 로직 추가
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">예약 관리</h1>
      <AdminFilter configs={reservationFilterConfigs} onFilterChange={handleFilterChange} />
      {/* 예약 목록 테이블 */}
    </div>
  );
}
