'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  classApi,
  SellerSettlementResponse,
  SellerTransactionResponse,
  SettlementTransactionItem,
  SettlementByClass,
} from '@/lib/api/class';
import { SalesTransaction } from '@/types';
import DateFilter from './components/DateFilter';
import SalesSummaryCard from './components/SalesSummaryCard';
import ClassSalesSection from './components/ClassSalesSection';
import TransactionList from './components/TransactionList';

export default function SalesPage() {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [selectedMonth, setSelectedMonth] = useState(currentMonth.toString());

  const [settlementData, setSettlementData] = useState<SellerSettlementResponse | null>(null);
  const [transactions, setTransactions] = useState<SalesTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSalesData = useCallback(async () => {
    setIsLoading(true);
    try {
      const year = parseInt(selectedYear);
      const month = parseInt(selectedMonth);

      const [settlementRes, transactionRes] = await Promise.all([
        classApi.getSellerSettlement({ year, month }),
        classApi.getSellerTransactions({ year, month, page: 1, limit: 100 }),
      ]);

      setSettlementData(settlementRes);

      const transactionResponse = transactionRes as SellerTransactionResponse;
      const transactionItems: SettlementTransactionItem[] = transactionResponse?.data || [];

      const convertedTransactions: SalesTransaction[] = transactionItems.map(
        (item: SettlementTransactionItem) => {
          const date = new Date(item.createdAt);
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          const hours = String(date.getHours()).padStart(2, '0');
          const minutes = String(date.getMinutes()).padStart(2, '0');

          const isUse = item.type === 'USE';

          return {
            id: item.id,
            classId: item.reservation.class.id,
            className: item.reservation.class.title,
            status: isUse ? 'BOOKED' : 'CANCELED',
            statusLabel: isUse ? '완료' : '환불',
            dateTime: `${year}.${month}.${day}. ${hours}:${minutes}`,
            amount: isUse ? item.amount : -item.amount,
            createdAt: item.createdAt,
          };
        },
      );

      setTransactions(convertedTransactions);
    } catch (error) {
      console.error('매출 데이터를 가져오는데 실패했습니다:', error);
      alert('데이터 로드 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedYear, selectedMonth]);

  // 3. 날짜 변경 시마다 API 재호출
  useEffect(() => {
    fetchSalesData();
  }, [fetchSalesData]);

  if (!settlementData && isLoading)
    return <div className="py-10 text-center">데이터를 불러오는 중...</div>;

  return (
    <div className="py-6">
      <DateFilter onYearChange={setSelectedYear} onMonthChange={setSelectedMonth} />

      {settlementData && (
        <>
          {/* 요약 카드 (총 매출, 쿠폰, 환불, 순매출) */}
          <SalesSummaryCard summary={settlementData.summary} />

          <ClassSalesSection
            classSales={settlementData.byClass.map((item: SettlementByClass) => ({
              id: item.classId,
              title: item.classTitle,
              revenue: item.totalRevenue,
              imgUrl: item.bannerUrl || '',
            }))}
          />
        </>
      )}

      {/* 상세 거래 내역 리스트 */}
      <TransactionList transactions={transactions} />
    </div>
  );
}
