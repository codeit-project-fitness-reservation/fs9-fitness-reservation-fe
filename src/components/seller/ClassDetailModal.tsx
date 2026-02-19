'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { ClassItem } from '@/types';
import { ReservationItem, classApi, SlotItemResponse } from '@/lib/api/class';
import { useModal } from '@/providers/ModalProvider';
import ReservationDetailModal from './ReservationDetailModal';
import icClock from '@/assets/images/clock.svg';
import icXClose from '@/assets/images/x-close.svg';
import icUser02 from '@/assets/images/user-02.svg';

interface ClassDetailModalProps {
  onClose: () => void;
  classItem: ClassItem | null;
  slotStartAt?: Date;
  slotEndAt?: Date;
}

export default function ClassDetailModal({
  onClose,
  classItem,
  slotStartAt,
  slotEndAt,
}: ClassDetailModalProps) {
  const { openModal, closeModal } = useModal();
  const [participants, setParticipants] = useState<ReservationItem[]>([]);
  const [slotInfo, setSlotInfo] = useState<SlotItemResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const slotStartAtTimestamp = useMemo(() => slotStartAt?.getTime(), [slotStartAt]);

  useEffect(() => {
    if (!classItem?.id || !slotStartAt) {
      setParticipants([]);
      setSlotInfo(null);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const start = new Date(slotStartAt);
        start.setHours(0, 0, 0, 0);
        const end = new Date(slotStartAt);
        end.setHours(23, 59, 59, 999);

        const toLocalISO = (d: Date) =>
          new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString();

        const startDate = toLocalISO(start);
        const endDate = toLocalISO(end);

        const slotRes = await classApi.getSellerSlots({
          classId: String(classItem.id),
          startDate,
          endDate,
        });

        if (!slotRes || slotRes.length === 0) {
          setSlotInfo(null);
          setParticipants([]);
          return;
        }

        const target = slotRes.find(
          (s) => new Date(s.startAt).getTime() === new Date(slotStartAt).getTime(),
        );

        const selectedSlot = target || slotRes[0];
        setSlotInfo(selectedSlot);

        const reservationRes = await classApi.getSellerReservations({
          classId: String(classItem.id),
          slotId: String(selectedSlot.id),
        });

        setParticipants(reservationRes.data || []);
      } catch (error) {
        console.error('데이터 로드 실패:', error);
        setParticipants([]);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchData();
  }, [classItem?.id, slotStartAt, slotStartAtTimestamp]);

  if (!classItem) return null;

  const capacity = slotInfo?.capacity ?? classItem.capacity;
  const activeParticipants = participants.filter((p) => p.status !== 'CANCELED');
  const currentCount = activeParticipants.length;

  const formatDateTime = (start?: Date, end?: Date) => {
    if (!start) return '';
    const startDate = new Date(start);
    const endDate = end ? new Date(end) : new Date(startDate.getTime() + 60 * 60 * 1000);

    const f = (n: number) => String(n).padStart(2, '0');
    return `${startDate.getFullYear()}.${f(startDate.getMonth() + 1)}.${f(startDate.getDate())}. ${f(startDate.getHours())}:${f(startDate.getMinutes())}-${f(endDate.getHours())}:${f(endDate.getMinutes())}`;
  };

  return (
    <div className="relative flex h-117.5 w-85.75 flex-col overflow-hidden rounded-3xl bg-white shadow-xl md:h-147.5 md:w-140">
      <div className="flex shrink-0 items-center justify-between px-6 py-4">
        <h2 className="text-lg font-semibold text-gray-900">클래스 상세</h2>
        <button onClick={onClose} className="hover:opacity-70">
          <Image src={icXClose} alt="닫기" width={24} height={24} />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-4 overflow-hidden px-6 pt-2 pb-6">
        <div className="flex shrink-0 flex-col gap-2 rounded-xl border border-gray-200 bg-white p-4">
          <h3 className="text-lg font-semibold text-gray-900">{classItem.title}</h3>
          {slotStartAt && (
            <div className="flex items-center gap-2 text-[16px] font-normal text-gray-500">
              <Image src={icClock} alt="시간" width={20} height={20} />
              <span className="font-medium">{formatDateTime(slotStartAt, slotEndAt)}</span>
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-3 overflow-hidden rounded-2xl border border-gray-200 bg-white p-4">
          <div className="flex shrink-0 items-center justify-between px-1">
            <h4 className="text-[16px] font-semibold text-gray-900">참여자 명단</h4>
            <div className="flex items-center gap-1.5">
              <Image src={icUser02} alt="참여자" width={16} height={16} />
              <span className="text-sm font-medium text-gray-500">
                {currentCount}/{capacity}
              </span>
            </div>
          </div>

          <div className="flex-1 overflow-hidden rounded-xl bg-gray-50">
            {isLoading ? (
              <div className="flex h-full items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-blue-500" />
              </div>
            ) : (
              <div className="custom-scrollbar h-full overflow-y-auto p-4">
                <div className="flex flex-col gap-4">
                  {participants.length === 0 ? (
                    <div className="flex h-full items-center justify-center text-sm text-gray-400">
                      참여자가 없습니다.
                    </div>
                  ) : (
                    participants.map((p) => (
                      <div
                        key={p.id}
                        className="flex cursor-pointer items-center gap-3 hover:opacity-70"
                        onClick={() =>
                          openModal(ReservationDetailModal, {
                            reservationId: p.id,
                            onClose: closeModal,
                          })
                        }
                      >
                        <div className="relative h-10 w-10 overflow-hidden rounded-full bg-blue-100">
                          {p.user?.profileImgUrl ? (
                            <Image
                              src={p.user.profileImgUrl}
                              alt={p.user?.nickname || p.user?.name || 'User'}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center font-bold text-blue-600">
                              {(p.user?.nickname || p.user?.name)?.charAt(0) || '?'}
                            </div>
                          )}
                        </div>
                        <span className="text-[16px] font-medium text-gray-800">
                          {p.user?.nickname || p.user?.name || 'Unknown'}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
