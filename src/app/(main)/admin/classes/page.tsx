'use client';

import AdminFilter, { classFilterConfigs, FilterValues } from '../_components/adminFilter';

export default function AdminClassesPage() {
  const handleFilterChange = (filters: FilterValues) => {
    console.log('클래스 필터 변경:', filters);
    // 차후 데이터 가져오는 로직 추가
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">클래스 관리</h1>
      <AdminFilter configs={classFilterConfigs} onFilterChange={handleFilterChange} />
      {/* 클래스 목록 테이블 */}
    </div>
  );
}
