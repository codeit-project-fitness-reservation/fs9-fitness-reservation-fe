'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import SearchBar from '@/components/SearchBar';
import ClassCard from '@/components/ClassCard';
import Pagination from '@/components/Pagination';
import FilterModal, { FilterState } from '@/components/FilterModal';
import FilterBadge from '@/components/FilterBadge';

// 임시 데이터 - 실제로는 API에서 가져올 데이터
const mockClasses = [
  {
    id: '1',
    image: 'https://www.figma.com/api/mcp/asset/f8d4d4c7-33b2-44b7-a205-29792a2a1e80',
    category: '헬스',
    level: '입문',
    title: '베이직 웨이트 트레이닝',
    rating: 4.8,
    reviewCount: 156,
  },
  {
    id: '2',
    image: 'https://www.figma.com/api/mcp/asset/1d0581a8-398d-44a9-b44f-84e788dfb729',
    category: '헬스',
    level: '입문',
    title: '필라테스 입문 클래스',
    rating: 4.8,
    reviewCount: 156,
  },
  {
    id: '3',
    image: 'https://www.figma.com/api/mcp/asset/b9a37c96-cbd6-484f-89b7-c9532566037d',
    category: '헬스',
    level: '입문',
    title: '스트레스를 날리는 복싱 기초 클래스',
    rating: 4.8,
    reviewCount: 156,
  },
  {
    id: '4',
    image: 'https://www.figma.com/api/mcp/asset/d22b14a7-7b83-43ae-8dc9-4f4a3317f63d',
    category: '헬스',
    level: '입문',
    title: '릴렉스 요가',
    rating: 4.8,
    reviewCount: 156,
  },
  {
    id: '5',
    image: 'https://www.figma.com/api/mcp/asset/59ce9e72-0bc2-454f-9202-f44df0a6699f',
    category: '헬스',
    level: '입문',
    title: '실전 스쿼시 클래스',
    rating: 4.8,
    reviewCount: 156,
  },
  {
    id: '6',
    image: 'https://www.figma.com/api/mcp/asset/6e87b31a-f51a-4f5e-b404-112d98b0abfd',
    category: '헬스',
    level: '입문',
    title: '30분 순환 근력 운동',
    rating: 4.8,
    reviewCount: 156,
  },
  {
    id: '7',
    image: 'https://www.figma.com/api/mcp/asset/33660e76-e9bb-4c2d-abcf-08044b6070ad',
    category: '헬스',
    level: '입문',
    title: '자세 교정을 위한 소도구 필라테스',
    rating: 4.8,
    reviewCount: 156,
  },
];

export default function ClassesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    reservationStatus: 'all',
    programTypes: [],
    difficulty: [],
    time: null,
  });
  const itemsPerPage = 7;
  const totalPages = Math.ceil(mockClasses.length / itemsPerPage);

  const handleClassClick = (classId: string) => {
    router.push(`/classes/${classId}`);
  };

  const handleFilterClick = () => {
    setIsFilterOpen(true);
  };

  const handleSortClick = () => {
    // 정렬 모달 시안이 아직 없으므로 아무 동작도 하지 않음
  };

  const handleApplyFilters = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    const resetFilters: FilterState = {
      reservationStatus: 'all',
      programTypes: [],
      difficulty: [],
      time: null,
    };
    setFilters(resetFilters);
  };

  const handleRemoveFilter = (
    type: 'reservationStatus' | 'programTypes' | 'difficulty' | 'time',
    value?: string,
  ) => {
    if (type === 'reservationStatus') {
      setFilters((prev) => ({ ...prev, reservationStatus: 'all' }));
    } else if (type === 'programTypes' && value) {
      setFilters((prev) => ({
        ...prev,
        programTypes: prev.programTypes.filter((t) => t !== value),
      }));
    } else if (type === 'difficulty' && value) {
      setFilters((prev) => ({
        ...prev,
        difficulty: prev.difficulty.filter((d) => d !== value),
      }));
    } else if (type === 'time') {
      setFilters((prev) => ({ ...prev, time: null }));
    }
  };

  const getActiveFilters = () => {
    const activeFilters: Array<{ type: string; label: string; value?: string }> = [];

    if (filters.reservationStatus === 'available') {
      activeFilters.push({ type: 'reservationStatus', label: '예약가능' });
    }

    filters.programTypes.forEach((type) => {
      activeFilters.push({ type: 'programTypes', label: type, value: type });
    });

    filters.difficulty.forEach((level) => {
      activeFilters.push({ type: 'difficulty', label: level, value: level });
    });

    if (filters.time) {
      activeFilters.push({ type: 'time', label: filters.time });
    }

    return activeFilters;
  };

  const activeFilters = getActiveFilters();

  return (
    <div className="min-h-screen bg-gray-200">
      <Header className="sticky top-0 z-10" />
      <div className="mx-auto flex min-h-[calc(100vh-56px)] max-w-[960px] flex-col items-center gap-8 bg-gray-50 px-8 py-6">
        <div className="flex w-full flex-col items-start gap-6">
          <div className="flex w-full flex-col gap-3">
            <div className="flex w-full items-center gap-4">
              <div className="flex shrink-0 items-center gap-4">
                <button
                  onClick={handleSortClick}
                  className="flex shrink-0 items-center justify-center rounded-lg border border-gray-300 bg-white p-3.5 transition-colors hover:bg-gray-50"
                  aria-label="정렬"
                >
                  <img src="/filter-lines.svg" alt="정렬" width={20} height={20} />
                </button>
                <button
                  onClick={handleFilterClick}
                  className={`flex shrink-0 items-center justify-center rounded-lg p-3.5 transition-colors ${
                    activeFilters.length > 0
                      ? 'border border-blue-300 bg-blue-50'
                      : 'border border-gray-300 bg-white hover:bg-gray-50'
                  }`}
                  aria-label="필터"
                >
                  <img
                    src={activeFilters.length > 0 ? '/filter.svg' : '/filter.svg'}
                    alt="필터"
                    width={20}
                    height={20}
                  />
                </button>
              </div>
              <SearchBar value={searchQuery} onChange={setSearchQuery} className="min-w-0 flex-1" />
            </div>
            {activeFilters.length > 0 && (
              <div className="flex flex-wrap items-start gap-1">
                {activeFilters.map((filter, index) => (
                  <FilterBadge
                    key={`${filter.type}-${filter.value || index}`}
                    label={filter.label}
                    onRemove={() =>
                      handleRemoveFilter(
                        filter.type as 'reservationStatus' | 'programTypes' | 'difficulty' | 'time',
                        filter.value,
                      )
                    }
                  />
                ))}
              </div>
            )}
          </div>

          <div className="flex w-full flex-col items-start gap-3">
            {mockClasses.map((classItem) => (
              <ClassCard
                key={classItem.id}
                {...classItem}
                onClick={() => handleClassClick(classItem.id)}
              />
            ))}
          </div>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      <FilterModal
        isOpen={isFilterOpen}
        filters={filters}
        onClose={() => setIsFilterOpen(false)}
        onApply={handleApplyFilters}
        onReset={handleResetFilters}
      />
    </div>
  );
}
