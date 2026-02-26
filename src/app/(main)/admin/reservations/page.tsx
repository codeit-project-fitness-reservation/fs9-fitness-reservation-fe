'use client';

import React, { useState, useEffect, useCallback } from 'react';
import AdminFilter, { reservationFilterConfigs, FilterValues } from '../_components/AdminFilter';
import ReservationList from './_components/ReservationList';
import { reservationApi } from '@/lib/api/reservation';
import { Reservation, ReservationStatus } from '@/types';

import { calculateDateRange } from '@/lib/utils/filterDate';
import Pagination from '@/components/Pagination';

const RESERVATION_STATUSES: ReservationStatus[] = [
  'PENDING',
  'CONFIRMED',
  'CANCELED',
  'COMPLETED',
  'BOOKED',
];

function isReservationStatus(s: string): s is ReservationStatus {
  return RESERVATION_STATUSES.includes(s as ReservationStatus);
}

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<FilterValues>({
    period: '전체기간',
    status: '전체',
    searchType: 'User',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  const [totalPages, setTotalPages] = useState(0);

  const [stats, setStats] = useState({
    totalReservations: 0,
    statusBreakdown: {
      BOOKED: 0,
      CANCELED: 0,
      COMPLETED: 0,
    },
  });

  const fetchStats = async () => {
    try {
      const response = await reservationApi.getStats();
      if (response) {
        setStats(response);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const [totalCount, setTotalCount] = useState(0);

  const fetchReservations = useCallback(async (page: number, currentFilters: FilterValues) => {
    setIsLoading(true);
    try {
      const { startDate, endDate } = calculateDateRange(currentFilters.period || '전체기간');

      const take = ITEMS_PER_PAGE;

      const response = await reservationApi.getAdminReservations({
        startDate,
        endDate,
        status:
          currentFilters.status !== '전체' && isReservationStatus(currentFilters.status)
            ? currentFilters.status
            : undefined,
        keyword: currentFilters.search,
        searchType: currentFilters.search ? currentFilters.searchType : undefined,
      });

      const list = response.data ?? [];
      const total = response.total ?? list.length;

      setReservations(list);
      setTotalCount(total);
      setTotalPages(response.totalPages ?? Math.ceil(total / ITEMS_PER_PAGE) ?? 1);
    } catch (error) {
      console.error('예약 조회 실패:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReservations(currentPage, filters);
  }, [currentPage, filters, fetchReservations]);

  const handleFilterChange = (newFilters: FilterValues) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-6">
      {/* 요약 카드 */}
      <div className="grid grid-cols-4 gap-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-medium text-gray-600">전체</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            {stats.totalReservations.toLocaleString()} 건
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-medium text-gray-600">예약중</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            {stats.statusBreakdown.BOOKED.toLocaleString()} 건
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-medium text-gray-600">취소됨</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            {stats.statusBreakdown.CANCELED.toLocaleString()} 건
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-medium text-gray-600">완료됨</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            {stats.statusBreakdown.COMPLETED.toLocaleString()} 건
          </p>
        </div>
      </div>

      <div>
        <div className="mb-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">예약 현황 조회</h2>
              <p className="mt-0.5 text-sm text-gray-500">총 {totalCount.toLocaleString()}개</p>
            </div>
            <AdminFilter
              inline
              configs={reservationFilterConfigs}
              onFilterChange={handleFilterChange}
            />
          </div>
        </div>

        <ReservationList
          reservations={reservations}
          loading={isLoading}
          onRefresh={() => fetchReservations(currentPage, filters)}
        />
      </div>

      <div className="mt-4 flex justify-center">
        {reservations.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
}
