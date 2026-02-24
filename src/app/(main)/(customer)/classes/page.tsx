'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import SearchBar from './_components/SearchBar';
import ClassCard from './_components/ClassCard';
import Pagination from '@/components/Pagination';
import FilterModal, { FilterState } from './_components/FilterModal';
import FilterBadge from './_components/FilterBadge';
import SortModal, { SortOption } from './_components/SortModal';
import { Class } from '@/types/class';
import { classApi } from '@/lib/api/class';
import filterLinesIcon from '@/assets/images/filter-lines.svg';
import filterIcon from '@/assets/images/filter.svg';

export default function ClassesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sortDropdownRef = useRef<HTMLDivElement>(null);
  const filterDropdownRef = useRef<HTMLDivElement>(null);

  // URL 파라미터에서 검색어 읽기
  const searchFromUrl = searchParams.get('search') || '';
  const [searchQuery, setSearchQuery] = useState(searchFromUrl);
  const [appliedSearchQuery, setAppliedSearchQuery] = useState(searchFromUrl);
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
  const [classes, setClasses] = useState<Class[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
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

  // URL 파라미터 변경 시 검색어 동기화
  useEffect(() => {
    const urlSearch = searchParams.get('search') || '';
    if (urlSearch !== appliedSearchQuery) {
      setSearchQuery(urlSearch);
      setAppliedSearchQuery(urlSearch);
      setCurrentPage(1);
    }
  }, [searchParams]);

  // API 호출
  useEffect(() => {
    const loadClasses = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const params: Record<string, string> = {
          page: String(currentPage),
          limit: String(itemsPerPage),
        };

        if (appliedSearchQuery.trim()) {
          params.search = appliedSearchQuery.trim();

          // 디버깅: 검색어가 제대로 전달되는지 확인
          if (process.env.NODE_ENV === 'development') {
            console.log('검색어 전달:', appliedSearchQuery.trim());
            console.log('API 파라미터:', params);
          }
        }

        if (filters.programTypes.length > 0) {
          params.category = filters.programTypes.join(',');
        }

        if (filters.difficulty.length > 0) {
          params.level = filters.difficulty.join(',');
        }

        const response = await classApi.getClasses(params);
        let filteredClasses: Class[] = response.data.map((item) => ({
          id: item.id,
          centerId: item.center.id,
          title: item.title,
          category: item.category,
          level: item.level,
          description: item.description ?? null,
          notice: item.notice ?? null,
          pricePoints: item.pricePoints,
          capacity: item.capacity,
          bannerUrl: item.bannerUrl ?? null,
          imgUrls: item.imgUrls || [],
          status: item.status,
          rejectReason: null,
          createdAt: item.createdAt,
          updatedAt: item.createdAt,
          currentReservation: 0,
          rating: item.rating ?? 0,
          reviewCount: item.reviewCount ?? 0,
        }));

        // 필터 적용 (클라이언트 사이드)
        if (filters.reservationStatus === 'available') {
          filteredClasses = filteredClasses.filter(
            (classItem) => (classItem.currentReservation || 0) < classItem.capacity,
          );
        }

        // 정렬 (클라이언트 사이드)
        switch (selectedSort) {
          case 'recommended':
            // 추천순 (기본값, rating 높은 순)
            filteredClasses.sort((a, b) => (b.rating || 0) - (a.rating || 0));
            break;
          case 'distance':
            // 거리순 (현재는 정렬 없음, 추후 거리 정보 추가 시 구현)
            break;
          case 'priceLow':
            // 가격 낮은 순
            filteredClasses.sort((a, b) => a.pricePoints - b.pricePoints);
            break;
          default:
            break;
        }

        setClasses(filteredClasses);
        setTotalCount(response.total);
      } catch (err) {
        setError(err instanceof Error ? err.message : '클래스를 불러오는데 실패했습니다.');
        setClasses([]);
        setTotalCount(0);
      } finally {
        setIsLoading(false);
      }
    };

    loadClasses();
  }, [appliedSearchQuery, filters, selectedSort, currentPage, itemsPerPage]);

  const handleSearch = (query: string) => {
    const trimmedQuery = query.trim();
    setAppliedSearchQuery(trimmedQuery);
    setCurrentPage(1);

    // URL 파라미터 업데이트
    const newSearchParams = new URLSearchParams(searchParams.toString());
    if (trimmedQuery) {
      newSearchParams.set('search', trimmedQuery);
    } else {
      newSearchParams.delete('search');
    }
    router.push(`/classes?${newSearchParams.toString()}`, { scroll: false });
  };

  const handleApplyFilters = (newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage);

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
      <div className="mx-auto flex min-h-[calc(100vh-56px)] max-w-[960px] flex-col items-center gap-8 px-8 py-6 max-[1200px]:gap-6 max-[1200px]:px-6 max-[768px]:gap-4 max-[768px]:px-4 max-[768px]:py-4">
        <div className="flex w-full flex-col items-start gap-6 max-[1200px]:gap-5 max-[768px]:gap-4">
          <div className="flex w-full flex-col gap-3 max-[768px]:gap-2">
            <div className="flex w-full items-center gap-4 max-[768px]:flex-col max-[768px]:gap-3">
              <div className="flex shrink-0 items-center gap-4 max-[768px]:w-full max-[768px]:justify-between">
                <div className="relative" ref={sortDropdownRef}>
                  <button
                    onClick={handleSortClick}
                    className="flex shrink-0 items-center justify-center rounded-lg border border-gray-300 bg-white p-3.5 transition-colors hover:bg-gray-50"
                    aria-label="정렬"
                  >
                    <Image src={filterLinesIcon} alt="정렬" width={20} height={20} />
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
                    <Image src={filterIcon} alt="필터" width={20} height={20} />
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
                className="min-w-0 flex-1 max-[768px]:w-full"
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

          <div className="flex w-full flex-col items-start gap-3 rounded-lg bg-gray-50 p-6 max-[1200px]:p-5 max-[768px]:gap-2 max-[768px]:p-4">
            {isLoading ? (
              <div className="flex w-full items-center justify-center py-12">
                <p className="text-base font-medium text-gray-400">로딩 중...</p>
              </div>
            ) : error ? (
              <div className="flex w-full items-center justify-center py-12">
                <p className="text-base font-medium text-red-500">{error}</p>
              </div>
            ) : classes.length > 0 ? (
              classes.map((classItem) => (
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
