'use client';

import React, { useState } from 'react';

export type FilterStatus = '전체' | '승인' | '대기중' | '반려됨';
export type FilterCategory = '전체' | '헬스' | '요가' | '필라테스' | '스쿼시' | '복싱';
export type FilterDifficulty = '전체' | '입문' | '초급' | '중급' | '고급';

export interface FilterValues {
  status: FilterStatus;
  category: FilterCategory;
  difficulty: FilterDifficulty;
  search: string;
}

interface FilterProps {
  onFilterChange?: (filters: FilterValues) => void;
  initialValues?: Partial<FilterValues>;
}

export default function Filter({ onFilterChange, initialValues }: FilterProps) {
  const [filters, setFilters] = useState<FilterValues>({
    status: initialValues?.status || '전체',
    category: initialValues?.category || '전체',
    difficulty: initialValues?.difficulty || '전체',
    search: initialValues?.search || '',
  });

  const handleChange = (key: keyof FilterValues, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="flex flex-row flex-nowrap items-center gap-4 overflow-x-auto">
        {/* 상태 필터 */}
        <div className="flex flex-shrink-0 flex-row items-center gap-2">
          <label htmlFor="status" className="text-sm font-medium whitespace-nowrap text-gray-700">
            상태
          </label>
          <select
            id="status"
            value={filters.status}
            onChange={(e) => handleChange('status', e.target.value as FilterStatus)}
            className="min-w-[100px] rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
          >
            <option value="전체">전체</option>
            <option value="승인">승인</option>
            <option value="대기중">대기중</option>
            <option value="반려됨">반려됨</option>
          </select>
        </div>

        {/* 카테고리 필터 */}
        <div className="flex flex-shrink-0 flex-row items-center gap-2">
          <label htmlFor="category" className="text-sm font-medium whitespace-nowrap text-gray-700">
            카테고리
          </label>
          <select
            id="category"
            value={filters.category}
            onChange={(e) => handleChange('category', e.target.value as FilterCategory)}
            className="min-w-[100px] rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
          >
            <option value="전체">전체</option>
            <option value="헬스">헬스</option>
            <option value="요가">요가</option>
            <option value="필라테스">필라테스</option>
            <option value="스쿼시">스쿼시</option>
            <option value="복싱">복싱</option>
          </select>
        </div>

        {/* 난이도 필터 */}
        <div className="flex flex-shrink-0 flex-row items-center gap-2">
          <label
            htmlFor="difficulty"
            className="text-sm font-medium whitespace-nowrap text-gray-700"
          >
            난이도
          </label>
          <select
            id="difficulty"
            value={filters.difficulty}
            onChange={(e) => handleChange('difficulty', e.target.value as FilterDifficulty)}
            className="min-w-[100px] rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
          >
            <option value="전체">전체</option>
            <option value="입문">입문</option>
            <option value="초급">초급</option>
            <option value="중급">중급</option>
            <option value="고급">고급</option>
          </select>
        </div>

        {/* 검색 필터 */}
        <div className="flex min-w-[200px] flex-1 flex-row items-center gap-2">
          <label htmlFor="search" className="text-sm font-medium whitespace-nowrap text-gray-700">
            검색 (클래스명/센터명)
          </label>
          <input
            type="text"
            id="search"
            value={filters.search}
            onChange={(e) => handleChange('search', e.target.value)}
            placeholder="클래스명 또는 센터명 검색"
            className="min-w-[150px] flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}
