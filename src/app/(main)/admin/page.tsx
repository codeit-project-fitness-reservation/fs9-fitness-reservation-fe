'use client';

import { useEffect, useState, useCallback } from 'react';
import ClassList from './classes/_components/ClassList';
import ReservationList from './reservations/_components/ReservationList';
import { classApi, ClassItem } from '@/lib/api/class';
import { reservationApi } from '@/lib/api/reservation';
import { Reservation } from '@/types';

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

  type ReservationListPayload = {
    data?: Reservation[] | { data?: Reservation[]; total?: number; totalCount?: number };
    content?: Reservation[];
    reservations?: Reservation[];
    total?: number;
    totalCount?: number;
    totalElements?: number;
  };

  const fetchReservations = useCallback(async () => {
    setReservationsLoading(true);
    try {
      const response = await reservationApi.getAdminReservations({
        skip: '0',
        take: PREVIEW_LIMIT.toString(),
      });

      const raw = response as ReservationListPayload | Reservation[];
      let list: Reservation[] = [];
      let total = 0;

      if (Array.isArray(raw)) {
        list = raw;
        total = list.length;
      } else {
        const res = raw;
        if (
          res?.data &&
          !Array.isArray(res.data) &&
          Array.isArray((res.data as { data?: Reservation[] }).data)
        ) {
          const d = res.data as { data: Reservation[]; total?: number; totalCount?: number };
          list = d.data;
          total = d.total ?? d.totalCount ?? 0;
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
