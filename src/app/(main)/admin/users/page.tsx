'use client';

import AdminFilter, { userFilterConfigs, FilterValues } from '../_components/adminFilter';

export default function AdminUsersPage() {
  const handleFilterChange = (filters: FilterValues) => {
    console.log('회원 필터 변경:', filters);
    // 차후 데이터 가져오는 로직 추가
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">회원 관리</h1>
      <AdminFilter configs={userFilterConfigs} onFilterChange={handleFilterChange} />
      {/* 회원 목록 테이블 */}
    </div>
  );
}
