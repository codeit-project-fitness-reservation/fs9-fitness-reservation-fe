'use client';

import React, { useState, useEffect, useCallback } from 'react';
import AdminFilter, { reservationFilterConfigs, FilterValues } from '../_components/AdminFilter';
import ReservationList from './_components/ReservationList';
import { reservationApi } from '@/lib/api/reservation';
import { Reservation } from '@/types';

import { calculateDateRange } from '@/lib/utils/filterDate';
import Pagination from '@/components/Pagination';

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<FilterValues>({});
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
      if (response?.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const [totalCount, setTotalCount] = useState(0);

  type ReservationListPayload = {
    data?: Reservation[] | { data?: Reservation[]; total?: number; totalCount?: number };
    content?: Reservation[];
    reservations?: Reservation[];
    total?: number;
    totalCount?: number;
    totalElements?: number;
  };

  const fetchReservations = useCallback(async (page: number, currentFilters: FilterValues) => {
    setIsLoading(true);
    try {
      const { startDate, endDate } = calculateDateRange(currentFilters.period || '전체기간');

      const take = ITEMS_PER_PAGE;
      const skip = (page - 1) * take;

      const response = await reservationApi.getAdminReservations({
        startDate,
        endDate,
        status: currentFilters.status !== '전체' ? currentFilters.status : undefined,
        keyword: currentFilters.search,
        searchType: currentFilters.searchType,
        skip: skip.toString(),
        take: take.toString(),
      });

      console.log('API Response:', response);

      const raw = response as ReservationListPayload | Reservation[];
      let list: Reservation[] = [];
      let total = 0;

      if (Array.isArray(raw)) {
        list = raw;
        total = list.length;
      } else {
        const res = raw;
        if (res?.data && !Array.isArray(res.data) && Array.isArray(res.data.data)) {
          list = res.data.data;
          total = res.data.total ?? res.data.totalCount ?? 0;
        } else if (res?.data && Array.isArray(res.data)) {
          list = res.data;
          total = res.total ?? res.totalCount ?? list.length;
        } else if (res?.content && Array.isArray(res.content)) {
          list = res.content;
          total = res.totalElements ?? res.total ?? 0;
        } else if (res?.reservations && Array.isArray(res.reservations)) {
          list = res.reservations;
          total = res.totalCount ?? 0;
        }
      }

      console.log('Parsed List:', list);
      console.log('Parsed Total:', total);

      setReservations(list);
      setTotalCount(total);

      if (total === list.length && list.length === ITEMS_PER_PAGE) {
        setTotalPages(page + 1);
      } else {
        setTotalPages(Math.ceil(total / ITEMS_PER_PAGE) || 1);
      }
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
    console.log('예약 필터 변경:', newFilters);
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
          <h2 className="text-lg font-bold text-gray-900">예약 현황 조회</h2>
          <p className="mt-0.5 text-sm text-gray-500">총 {totalCount.toLocaleString()}개</p>
          <div className="mt-4">
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
