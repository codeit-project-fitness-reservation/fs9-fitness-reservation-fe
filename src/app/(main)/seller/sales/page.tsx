'use client';

import { useState, useMemo, useEffect } from 'react';
import { MOCK_SALES_TRANSACTIONS, MOCK_SELLER_CLASSES } from '@/mocks/mockdata';
import { ClassItem } from '@/types';
import DateFilter from './components/DateFilter';
import SalesSummaryCard from './components/SalesSummaryCard';
import ClassSalesSection from './components/ClassSalesSection';
import TransactionList from './components/TransactionList';

export default function SalesPage() {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [selectedMonth, setSelectedMonth] = useState(currentMonth.toString());
  const [classes, setClasses] = useState<ClassItem[]>(MOCK_SELLER_CLASSES);

  useEffect(() => {
    const loadClasses = () => {
      try {
        const storedClasses = localStorage.getItem('myClasses');
        if (storedClasses) {
          const parsedClasses = JSON.parse(storedClasses);
          setClasses([...MOCK_SELLER_CLASSES, ...parsedClasses]);
        }
      } catch (error) {
        console.error('클래스 목록 로드 중 에러:', error);
      }
    };

    loadClasses();
    window.addEventListener('storage', loadClasses);
    return () => window.removeEventListener('storage', loadClasses);
  }, []);

  // 거래 내역 필터링
  const filteredTransactions = useMemo(() => {
    return MOCK_SALES_TRANSACTIONS.filter((transaction) => {
      const transactionDate = transaction.createdAt;
      return (
        transactionDate.getFullYear() === parseInt(selectedYear) &&
        transactionDate.getMonth() + 1 === parseInt(selectedMonth)
      );
    });
  }, [selectedYear, selectedMonth]);

  // 클래스별 매출 계산
  const classSales = useMemo(() => {
    const salesByClass: Record<string, { title: string; revenue: number; imgUrl?: string }> = {};

    // 초기화
    classes.forEach((classItem) => {
      salesByClass[classItem.id] = {
        title: classItem.title,
        revenue: 0,
        imgUrl: classItem.imgUrls?.[0],
      };
    });

    // 합산
    filteredTransactions.forEach((transaction) => {
      if (salesByClass[transaction.classId]) {
        salesByClass[transaction.classId].revenue += transaction.amount;
      } else {
        const classItem = classes.find((c) => c.id === transaction.classId);
        salesByClass[transaction.classId] = {
          title: transaction.className,
          revenue: transaction.amount,
          imgUrl: classItem?.imgUrls?.[0],
        };
      }
    });

    return Object.entries(salesByClass)
      .map(([classId, data]) => ({
        id: classId,
        classId,
        title: data.title,
        revenue: data.revenue,
        imgUrl: data.imgUrl,
      }))
      .filter((item) => item.revenue !== 0);
  }, [filteredTransactions, classes]);

  // 총 매출 요약 계산
  const salesSummary = useMemo(() => {
    const totalRevenue = filteredTransactions
      .filter((t) => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);

    const refundAmount = Math.abs(
      filteredTransactions.filter((t) => t.amount < 0).reduce((sum, t) => sum + t.amount, 0),
    );

    const hasTransactions = filteredTransactions.length > 0;
    const couponDiscount = hasTransactions ? 10000 : 0;
    const netRevenue = totalRevenue - refundAmount - couponDiscount;

    return {
      totalRevenue,
      couponDiscount,
      refundAmount,
      netRevenue,
    };
  }, [filteredTransactions]);

  return (
    <div className="py-6">
      <DateFilter onYearChange={setSelectedYear} onMonthChange={setSelectedMonth} />
      <SalesSummaryCard summary={salesSummary} />
      <ClassSalesSection classSales={classSales} />
      <TransactionList transactions={filteredTransactions} />
    </div>
  );
}
