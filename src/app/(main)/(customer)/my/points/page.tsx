'use client';

import { useState, useEffect } from 'react';
import SimpleHeader from '@/components/layout/SimpleHeader/SimpleHeader';
import { pointApi } from '@/lib/api/point';
import { format } from 'date-fns';

interface PointHistoryItem {
  id: string;
  type: 'CHARGE' | 'USE' | 'REFUND' | 'ADMIN';
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  reservationId?: string | null;
  orderId?: string | null;
  paymentKey?: string | null;
  memo?: string | null;
  createdAt: string;
}

export default function PointsPage() {
  const [history, setHistory] = useState<PointHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setIsLoading(true);
        const response = await pointApi.getMyHistory({
          page: currentPage,
          limit: itemsPerPage,
        });

        if (currentPage === 1) {
          setHistory(response.data);
        } else {
          setHistory((prev) => [...prev, ...response.data]);
        }

        setHasMore(response.data.length === itemsPerPage);
      } catch (error) {
        console.error('포인트 내역 조회 실패:', error);
        alert('포인트 내역을 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    void fetchHistory();
  }, [currentPage]);

  const handleLoadMore = () => {
    if (hasMore && !isLoading) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const getTypeLabel = (type: PointHistoryItem['type']) => {
    switch (type) {
      case 'CHARGE':
        return '충전';
      case 'USE':
        return '사용';
      case 'REFUND':
        return '환불';
      case 'ADMIN':
        return '관리자';
      default:
        return type;
    }
  };

  const getTypeColor = (type: PointHistoryItem['type']) => {
    switch (type) {
      case 'CHARGE':
        return 'text-blue-600';
      case 'USE':
        return 'text-red-600';
      case 'REFUND':
        return 'text-green-600';
      case 'ADMIN':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
    }
  };

  if (isLoading && history.length === 0) {
    return (
      <div className="flex min-h-[calc(100vh-56px)] items-center justify-center">
        <p className="text-base font-medium text-gray-400">로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-56px)] flex-col bg-gray-50">
      <SimpleHeader title="포인트 내역" />

      <div className="flex flex-1 flex-col gap-4 px-4 py-6">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-12">
            <p className="text-base text-gray-500">포인트 내역이 없습니다.</p>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-3">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-2 rounded-lg border border-gray-200 bg-white p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-semibold ${getTypeColor(item.type)}`}>
                          {getTypeLabel(item.type)}
                        </span>
                        {item.memo && <span className="text-xs text-gray-500">{item.memo}</span>}
                      </div>
                      <span className="text-xs text-gray-500">
                        {format(new Date(item.createdAt), 'yyyy.MM.dd HH:mm')}
                      </span>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span
                        className={`text-base font-bold ${
                          item.type === 'CHARGE' || item.type === 'REFUND'
                            ? 'text-blue-600'
                            : 'text-red-600'
                        }`}
                      >
                        {item.type === 'CHARGE' || item.type === 'REFUND' ? '+' : '-'}
                        {Math.abs(item.amount).toLocaleString()}P
                      </span>
                      <span className="text-xs text-gray-500">
                        잔액: {item.balanceAfter.toLocaleString()}P
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {hasMore && (
              <button
                onClick={handleLoadMore}
                disabled={isLoading}
                className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                {isLoading ? '로딩 중...' : '더보기'}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
