'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  pointApi,
  SellerSettlementResponse,
  SettlementByClass,
  SettlementTransactionItem,
} from '@/lib/api/point';
import { SalesTransaction } from '@/types';
import DateFilter from './components/DateFilter';
import SalesSummaryCard from './components/SalesSummaryCard';
import ClassSalesSection from './components/ClassSalesSection';
import TransactionList from './components/TransactionList';

export default function SalesPage() {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const [selectedYear, setSelectedYear] = useState<string>(currentYear.toString());
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonth.toString());

  const [settlementData, setSettlementData] = useState<SellerSettlementResponse | null>(null);
  const [transactions, setTransactions] = useState<SalesTransaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchSalesData = useCallback(async () => {
    const year = parseInt(selectedYear, 10);
    const month = parseInt(selectedMonth, 10);

    if (isNaN(year) || isNaN(month) || year < 2020 || year > 2100 || month < 1 || month > 12) {
      return;
    }

    setIsLoading(true);
    try {
      // 1. 매출 정산 요약 데이터 호출
      // apiClient.get은 이미 json.data를 추출해서 반환하므로 직접 사용합니다.
      const settlementData = await pointApi.getSellerSettlement({ year, month });

      if (!settlementData?.summary) {
        throw new Error('정산 요약 데이터를 불러오는 데 실패했습니다.');
      }
      setSettlementData(settlementData);

      // 2. 상세 거래 내역 호출
      try {
        const transactionRes = await pointApi.getSellerTransactions({
          year,
          month,
          page: 1,
          limit: 100,
        });

        // SellerTransactionResponse 내부에 실제 목록 배열인 data가 있음
        const transactionItems = transactionRes?.data || [];

        const convertedTransactions: SalesTransaction[] = transactionItems
          .filter((item: SettlementTransactionItem) => item?.reservation?.class)
          .map((item: SettlementTransactionItem) => {
            const date = new Date(item.createdAt);
            const isUse = item.type === 'USE';

            return {
              id: item.id,
              classId: item.reservation.class.id,
              className: item.reservation.class.title || '제목 없음',
              status: isUse ? 'BOOKED' : 'CANCELED',
              statusLabel: isUse ? '완료' : '환불',
              dateTime: isNaN(date.getTime())
                ? '날짜 정보 없음'
                : `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`,
              amount: isUse ? item.amount : -item.amount,
              createdAt: date,
            };
          });

        setTransactions(convertedTransactions);
      } catch (transError) {
        console.error('거래 내역 로드 실패:', transError);
        setTransactions([]);
      }
    } catch (error: unknown) {
      let errorMessage = '데이터를 불러오는 중 오류가 발생했습니다.';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      alert(errorMessage);
      setSettlementData(null);
    } finally {
      setIsLoading(false);
    }
  }, [selectedYear, selectedMonth]);

  useEffect(() => {
    fetchSalesData();
  }, [fetchSalesData]);

  if (isLoading) {
    return <div className="py-20 text-center text-gray-500">데이터를 불러오는 중...</div>;
  }

  return (
    <div className="space-y-8 py-6">
      <DateFilter
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
        onYearChange={setSelectedYear}
        onMonthChange={setSelectedMonth}
      />

      {!settlementData ? (
        <div className="rounded-lg bg-gray-50 py-20 text-center text-gray-500">
          정산 데이터가 없습니다.
        </div>
      ) : (
        <>
          <SalesSummaryCard summary={settlementData.summary} />

          <ClassSalesSection
            classSales={settlementData.byClass.map((item: SettlementByClass) => ({
              id: item.classId,
              title: item.classTitle,
              revenue: item.totalRevenue,
              imgUrl: item.bannerUrl || undefined,
            }))}
          />

          <TransactionList transactions={transactions} />
        </>
      )}
    </div>
  );
}
