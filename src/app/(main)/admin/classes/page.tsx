'use client';

import { useEffect, useState, useCallback } from 'react';
import AdminFilter, { classFilterConfigs, FilterValues } from '../_components/AdminFilter';
import ClassList from './_components/ClassList';
import { classApi, ClassStats, ClassItem } from '@/lib/api/class';
import Pagination from '@/components/Pagination';

export default function AdminClassesPage() {
  const [stats, setStats] = useState<ClassStats>({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
  });
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState<FilterValues>({});
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const fetchStats = async () => {
    try {
      const response = await classApi.getStats();
      setStats(response);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const fetchClasses = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        ...filters,
        level: filters.difficulty,
        page: currentPage,
        limit: ITEMS_PER_PAGE,
      };

      const cleanParams = Object.fromEntries(
        Object.entries(params).filter(([_, v]) => v != null && String(v) !== '' && v !== '전체'),
      );

      const response = await classApi.getClasses(cleanParams);
      setClasses(response.data);
      setTotalCount(response.total);
    } catch (error) {
      console.error('Failed to fetch classes:', error);
    } finally {
      setLoading(false);
    }
  }, [filters, currentPage]);

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  const handleFilterChange = (newFilters: FilterValues) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE) || 1;

  return (
    <div className="space-y-6">
      {/* 요약 카드 */}
      <div className="grid grid-cols-4 gap-4">
        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-600">전체</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{stats.total.toLocaleString()} 건</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-600">승인됨</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            {stats.approved.toLocaleString()} 건
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-600">대기중</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            {stats.pending.toLocaleString()} 건
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-600">반려됨</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            {stats.rejected.toLocaleString()} 건
          </p>
        </div>
      </div>

      {/* 클래스 목록 - Figma: 필터+테이블 통합 카드 */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">클래스</h2>
              <p className="text-sm text-gray-500">총 {totalCount.toLocaleString()}개</p>
            </div>
            <AdminFilter configs={classFilterConfigs} onFilterChange={handleFilterChange} inline />
          </div>
        </div>
        <ClassList classes={classes} loading={loading} onRefresh={fetchClasses} noCard />
      </div>

      {classes.length > 0 && (
        <div className="mt-4 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}
