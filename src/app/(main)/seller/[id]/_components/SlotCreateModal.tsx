'use client';

import { useState } from 'react';
import Image from 'next/image';
import Modal from '@/components/Modal';
import { classApi } from '@/lib/api/class';
import xCloseIcon from '@/assets/images/x-close.svg';

interface SlotCreateModalProps {
  classId: string;
  classCapacity: number;
  hasSchedule: boolean;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function SlotCreateModal({
  classId,
  classCapacity,
  hasSchedule,
  isOpen,
  onClose,
  onSuccess,
}: SlotCreateModalProps) {
  const [mode, setMode] = useState<'single' | 'batch'>('single');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 단일 슬롯
  const [date, setDate] = useState('');
  const [hour, setHour] = useState(10);
  const [capacity, setCapacity] = useState(classCapacity);

  // 스케줄 기반 일괄
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const today = new Date().toISOString().slice(0, 10);

  const handleSubmitSingle = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!date) {
      setError('날짜를 선택해 주세요.');
      return;
    }
    setSubmitting(true);
    try {
      await classApi.createSlot(classId, { date, hour, capacity, isOpen: true });
      onSuccess();
      onClose();
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message: string }).message)
          : '슬롯 생성에 실패했습니다.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!startDate || !endDate) {
      setError('시작일과 종료일을 입력해 주세요.');
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      setError('시작일이 종료일보다 늦을 수 없습니다.');
      return;
    }
    setSubmitting(true);
    try {
      await classApi.generateSlots(classId, { startDate, endDate });
      onSuccess();
      onClose();
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message: string }).message)
          : '슬롯 생성에 실패했습니다.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div
        className="w-full max-w-md rounded-xl border border-gray-200 bg-white shadow-xl"
        style={{ width: '440px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">클래스 슬롯 생성</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            aria-label="닫기"
          >
            <Image src={xCloseIcon} alt="닫기" width={20} height={20} />
          </button>
        </div>

        <div className="px-6 py-4">
          {hasSchedule && (
            <div className="mb-4 flex gap-2 rounded-lg bg-gray-50 p-1">
              <button
                type="button"
                onClick={() => setMode('single')}
                className={`flex-1 rounded-md py-2 text-sm font-medium ${mode === 'single' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'}`}
              >
                단일 슬롯
              </button>
              <button
                type="button"
                onClick={() => setMode('batch')}
                className={`flex-1 rounded-md py-2 text-sm font-medium ${mode === 'batch' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'}`}
              >
                스케줄 기반 일괄
              </button>
            </div>
          )}

          {error && (
            <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
          )}

          {!hasSchedule || mode === 'single' ? (
            <form onSubmit={handleSubmitSingle} className="flex flex-col gap-4">
              <div>
                <label htmlFor="slot-date" className="mb-1 block text-sm font-medium text-gray-700">
                  날짜
                </label>
                <input
                  id="slot-date"
                  type="date"
                  value={date}
                  min={today}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="slot-hour" className="mb-1 block text-sm font-medium text-gray-700">
                  시작 시 (0~23)
                </label>
                <input
                  id="slot-hour"
                  type="number"
                  min={0}
                  max={23}
                  value={hour}
                  onChange={(e) => setHour(Number(e.target.value))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="slot-capacity"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  정원 (1~{classCapacity}명)
                </label>
                <input
                  id="slot-capacity"
                  type="number"
                  min={1}
                  max={classCapacity}
                  value={capacity}
                  onChange={(e) => setCapacity(Number(e.target.value))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="mt-2 w-full rounded-lg bg-blue-600 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-70"
              >
                {submitting ? '생성 중...' : '슬롯 추가'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmitBatch} className="flex flex-col gap-4">
              <p className="text-sm text-gray-500">
                클래스에 등록된 요일별 스케줄에 따라 기간 내 슬롯을 자동 생성합니다. 이미 있는
                시간대는 건너뜁니다.
              </p>
              <div>
                <label
                  htmlFor="batch-start"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  시작일
                </label>
                <input
                  id="batch-start"
                  type="date"
                  value={startDate}
                  min={today}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="batch-end" className="mb-1 block text-sm font-medium text-gray-700">
                  종료일
                </label>
                <input
                  id="batch-end"
                  type="date"
                  value={endDate}
                  min={startDate || today}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="mt-2 w-full rounded-lg bg-blue-600 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-70"
              >
                {submitting ? '생성 중...' : '기간 슬롯 일괄 생성'}
              </button>
            </form>
          )}
        </div>
      </div>
    </Modal>
  );
}
