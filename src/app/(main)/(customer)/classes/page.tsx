'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import SearchBar from '@/components/SearchBar';
import ClassCard from '@/components/ClassCard';
import Pagination from '@/components/Pagination';
import FilterModal, { FilterState } from '@/components/FilterModal';
import FilterBadge from '@/components/FilterBadge';
import SortModal, { SortOption } from '@/components/SortModal';
import { Class, ClassStatus } from '@/types/class';

// 임시 데이터 - 실제로는 API에서 가져올 데이터
const mockClasses: Class[] = [
  {
    id: '1',
    centerId: 'center-1',
    title: '베이직 웨이트 트레이닝',
    category: '헬스',
    level: '입문',
    description: null,
    notice: null,
    pricePoints: 5000,
    capacity: 20,
    bannerUrl: 'https://www.figma.com/api/mcp/asset/f8d4d4c7-33b2-44b7-a205-29792a2a1e80',
    imgUrls: [],
    status: ClassStatus.APPROVED,
    rejectReason: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    rating: 4.8,
    reviewCount: 156,
  },
  {
    id: '2',
    centerId: 'center-1',
    title: '필라테스 입문 클래스',
    category: '필라테스',
    level: '입문',
    description: null,
    notice: null,
    pricePoints: 6000,
    capacity: 15,
    bannerUrl: 'https://www.figma.com/api/mcp/asset/1d0581a8-398d-44a9-b44f-84e788dfb729',
    imgUrls: [],
    status: ClassStatus.APPROVED,
    rejectReason: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    rating: 4.8,
    reviewCount: 156,
  },
  {
    id: '3',
    centerId: 'center-1',
    title: '스트레스를 날리는 복싱 기초 클래스',
    category: '복싱',
    level: '입문',
    description: null,
    notice: null,
    pricePoints: 7000,
    capacity: 10,
    bannerUrl: 'https://www.figma.com/api/mcp/asset/b9a37c96-cbd6-484f-89b7-c9532566037d',
    imgUrls: [],
    status: ClassStatus.APPROVED,
    rejectReason: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    rating: 4.8,
    reviewCount: 156,
  },
  {
    id: '4',
    centerId: 'center-1',
    title: '릴렉스 요가',
    category: '요가',
    level: '입문',
    description: null,
    notice: null,
    pricePoints: 5500,
    capacity: 25,
    bannerUrl: 'https://www.figma.com/api/mcp/asset/d22b14a7-7b83-43ae-8dc9-4f4a3317f63d',
    imgUrls: [],
    status: ClassStatus.APPROVED,
    rejectReason: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    rating: 4.8,
    reviewCount: 156,
  },
  {
    id: '5',
    centerId: 'center-1',
    title: '실전 스쿼시 클래스',
    category: '스쿼시',
    level: '입문',
    description: null,
    notice: null,
    pricePoints: 8000,
    capacity: 8,
    bannerUrl: 'https://www.figma.com/api/mcp/asset/59ce9e72-0bc2-454f-9202-f44df0a6699f',
    imgUrls: [],
    status: ClassStatus.APPROVED,
    rejectReason: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    rating: 4.8,
    reviewCount: 156,
  },
  {
    id: '6',
    centerId: 'center-1',
    title: '30분 순환 근력 운동',
    category: '헬스',
    level: '초급',
    description: null,
    notice: null,
    pricePoints: 4500,
    capacity: 30,
    bannerUrl: 'https://www.figma.com/api/mcp/asset/6e87b31a-f51a-4f5e-b404-112d98b0abfd',
    imgUrls: [],
    status: ClassStatus.APPROVED,
    rejectReason: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    rating: 4.8,
    reviewCount: 156,
  },
  {
    id: '7',
    centerId: 'center-1',
    title: '자세 교정을 위한 소도구 필라테스',
    category: '필라테스',
    level: '중급',
    description: null,
    notice: null,
    pricePoints: 6500,
    capacity: 12,
    bannerUrl: 'https://www.figma.com/api/mcp/asset/33660e76-e9bb-4c2d-abcf-08044b6070ad',
    imgUrls: [],
    status: ClassStatus.APPROVED,
    rejectReason: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    rating: 4.8,
    reviewCount: 156,
  },
];

export default function ClassesPage() {
  const router = useRouter();
  const sortDropdownRef = useRef<HTMLDivElement>(null);
  const filterDropdownRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedSearchQuery, setAppliedSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState<SortOption>('recommended');
  const [filters, setFilters] = useState<FilterState>({
    reservationStatus: 'all',
    programTypes: [],
    difficulty: [],
    time: [],
  });
  const itemsPerPage = 7;

  const handleClassClick = (classId: string) => {
    router.push(`/classes/${classId}`);
  };

  const handleFilterClick = () => {
    setIsSortOpen(false);
    setIsFilterOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    };

    if (isSortOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSortOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };

    if (isFilterOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFilterOpen]);

  const handleSortClick = () => {
    setIsFilterOpen(false);
    setIsSortOpen((prev) => !prev);
  };

  const handleSortSelect = (sort: SortOption) => {
    setSelectedSort(sort);
  };

  const handleSearch = (query: string) => {
    setAppliedSearchQuery(query);
    setCurrentPage(1); // 검색 시 첫 페이지로 이동
  };

  const handleApplyFilters = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  // 검색어와 필터에 따라 클래스 필터링
  const filteredClasses = mockClasses.filter((classItem) => {
    // 검색어 필터링
    if (appliedSearchQuery.trim()) {
      const query = appliedSearchQuery.toLowerCase();
      const matchesSearch =
        classItem.title.toLowerCase().includes(query) ||
        classItem.category.toLowerCase().includes(query) ||
        classItem.level.toLowerCase().includes(query) ||
        (classItem.description && classItem.description.toLowerCase().includes(query));

      if (!matchesSearch) return false;
    }

    // 프로그램 종류 필터링
    if (filters.programTypes.length > 0 && !filters.programTypes.includes(classItem.category)) {
      return false;
    }

    // 난이도 필터링
    if (filters.difficulty.length > 0 && !filters.difficulty.includes(classItem.level)) {
      return false;
    }

    // 예약 상태 필터링 (현재는 mock 데이터이므로 모든 클래스가 available로 간주)
    // 실제로는 ClassSlot의 isOpen을 확인해야 함

    return true;
  });

  // 정렬 적용
  const sortedClasses = [...filteredClasses].sort((a, b) => {
    switch (selectedSort) {
      case 'recommended':
        // 추천순은 기본 정렬 (생성일 기준 최신순)
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'distance':
        // 거리순은 현재 구현 불가 (위치 정보 필요)
        return 0;
      case 'priceLow':
        // 가격낮은순
        return a.pricePoints - b.pricePoints;
      default:
        return 0;
    }
  });

  const totalPages = Math.ceil(sortedClasses.length / itemsPerPage);
  const paginatedClasses = sortedClasses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleResetFilters = () => {
    const resetFilters: FilterState = {
      reservationStatus: 'all',
      programTypes: [],
      difficulty: [],
      time: [],
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
    } else if (type === 'time' && value) {
      setFilters((prev) => ({
        ...prev,
        time: prev.time.filter((t) => t !== value),
      }));
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

    filters.time.forEach((timeSlot) => {
      activeFilters.push({ type: 'time', label: timeSlot, value: timeSlot });
    });

    return activeFilters;
  };

  const activeFilters = getActiveFilters();

  return (
    <>
      <div className="mx-auto flex min-h-[calc(100vh-56px)] max-w-[960px] flex-col items-center gap-8 px-8 py-6">
        <div className="flex w-full flex-col items-start gap-6">
          <div className="flex w-full flex-col gap-3">
            <div className="flex w-full items-center gap-4">
              <div className="flex shrink-0 items-center gap-4">
                <div className="relative" ref={sortDropdownRef}>
                  <button
                    onClick={handleSortClick}
                    className="flex shrink-0 items-center justify-center rounded-lg border border-gray-300 bg-white p-3.5 transition-colors hover:bg-gray-50"
                    aria-label="정렬"
                  >
                    <img src="/filter-lines.svg" alt="정렬" width={20} height={20} />
                  </button>
                  <SortModal
                    isOpen={isSortOpen}
                    selectedSort={selectedSort}
                    onClose={() => setIsSortOpen(false)}
                    onSelect={handleSortSelect}
                  />
                </div>
                <div className="relative" ref={filterDropdownRef}>
                  <button
                    onClick={handleFilterClick}
                    className={`flex shrink-0 items-center justify-center rounded-lg p-3.5 transition-colors ${
                      activeFilters.length > 0
                        ? 'border border-blue-300 bg-blue-50'
                        : 'border border-gray-300 bg-white hover:bg-gray-50'
                    }`}
                    aria-label="필터"
                  >
                    <img src="/filter.svg" alt="필터" width={20} height={20} />
                  </button>

                  <FilterModal
                    isOpen={isFilterOpen}
                    filters={filters}
                    onClose={() => setIsFilterOpen(false)}
                    onApply={handleApplyFilters}
                    onReset={handleResetFilters}
                  />
                </div>
              </div>
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                onSearch={handleSearch}
                className="min-w-0 flex-1"
              />
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

          <div className="flex w-full flex-col items-start gap-3 rounded-lg bg-gray-50 p-6">
            {paginatedClasses.length > 0 ? (
              paginatedClasses.map((classItem) => (
                <ClassCard
                  key={classItem.id}
                  classData={classItem}
                  onClick={() => handleClassClick(classItem.id)}
                />
              ))
            ) : (
              <div className="flex w-full items-center justify-center py-12">
                <p className="text-base font-medium text-gray-400">검색 결과가 없습니다.</p>
              </div>
            )}
          </div>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </>
  );
}
