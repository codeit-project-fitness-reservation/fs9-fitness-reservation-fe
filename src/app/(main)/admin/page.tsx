'use client';

import { useEffect, useState, useCallback } from 'react';
import ClassList from './classes/_components/ClassList';
import ReservationList from './reservations/_components/ReservationList';
import { classApi, ClassItem } from '@/lib/api/class';
import { reservationApi } from '@/lib/api/reservation';
import { Reservation } from '@/types';
import { calculateDateRange } from '@/lib/utils/filterDate';

export default function AdminHomePage() {
  const [pendingClasses, setPendingClasses] = useState<ClassItem[]>([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [classesLoading, setClassesLoading] = useState(true);

  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [reservationsLoading, setReservationsLoading] = useState(false);
  const [totalReservationCount, setTotalReservationCount] = useState(0);

  const PREVIEW_LIMIT = 5;

  const fetchPendingClasses = useCallback(async () => {
    try {
      setClassesLoading(true);
      const response = await classApi.getClasses({
        status: 'PENDING',
        page: 1,
        limit: PREVIEW_LIMIT,
      });
      setPendingClasses(response.data);
      setPendingCount(response.total);
    } catch (error) {
      console.error('클래스 조회 실패:', error);
    } finally {
      setClassesLoading(false);
    }
  }, []);

  const fetchReservations = useCallback(async () => {
    setReservationsLoading(true);
    try {
      const { startDate, endDate } = calculateDateRange('전체기간');

      const response = await reservationApi.getAdminReservations({
        // page: 1,
        // limit: PREVIEW_LIMIT,
        startDate,
        endDate,
      });

      const res = response as { data?: Reservation[]; total?: number; totalCount?: number };
      const list = (res?.data ?? []).slice(0, PREVIEW_LIMIT);
      const total = res?.total ?? res?.totalCount ?? list.length;

      setReservations(list);
      setTotalReservationCount(total);
    } catch (error) {
      console.error('예약 조회 실패:', error);
    } finally {
      setReservationsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPendingClasses();
    fetchReservations();
  }, [fetchPendingClasses, fetchReservations]);

  return (
    <div className="space-y-8">
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">승인이 필요한 신규 클래스</h2>
            <p className="text-sm text-gray-500">총 {pendingCount.toLocaleString()}개</p>
          </div>
        </div>
        <ClassList
          classes={pendingClasses}
          loading={classesLoading}
          onRefresh={fetchPendingClasses}
          noCard
          columnVariant="approval"
        />
      </div>

      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">최근 예약</h2>
            <p className="text-sm text-gray-500">총 {totalReservationCount.toLocaleString()}개</p>
          </div>
        </div>
        <ReservationList
          reservations={reservations}
          loading={reservationsLoading}
          onRefresh={fetchReservations}
          noCard
        />
      </div>
    </div>
  );
}
