'use client';

import { useState, useRef, useEffect } from 'react';

interface DateFilterProps {
  selectedYear: string;
  selectedMonth: string;
  onYearChange?: (year: string) => void;
  onMonthChange?: (month: string) => void;
}

export default function DateFilter({
  selectedYear,
  selectedMonth,
  onYearChange,
  onMonthChange,
}: DateFilterProps) {
  const currentYear = new Date().getFullYear();

  const [isYearOpen, setIsYearOpen] = useState(false);
  const [isMonthOpen, setIsMonthOpen] = useState(false);

  const yearRef = useRef<HTMLDivElement>(null);
  const monthRef = useRef<HTMLDivElement>(null);

  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  const handleYearChange = (year: string) => {
    setIsYearOpen(false);
    onYearChange?.(year);
  };

  const handleMonthChange = (month: string) => {
    setIsMonthOpen(false);
    onMonthChange?.(month);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (yearRef.current && !yearRef.current.contains(event.target as Node)) {
        setIsYearOpen(false);
      }
      if (monthRef.current && !monthRef.current.contains(event.target as Node)) {
        setIsMonthOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="mb-4 grid grid-cols-2 gap-2">
      {/* 년도 선택 드롭다운 */}
      <div ref={yearRef} className="relative">
        <button
          type="button"
          onClick={() => setIsYearOpen(!isYearOpen)}
          className={`w-full rounded-lg border bg-white px-3 py-3 text-sm transition-colors outline-none ${
            isYearOpen ? 'border-blue-500' : 'border-gray-200'
          } ${!selectedYear ? 'text-gray-400' : 'text-gray-900'} flex items-center justify-between`}
        >
          <span>{selectedYear ? `${selectedYear}년` : '년도 선택'}</span>
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isYearOpen && (
          <div className="absolute z-10 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg">
            <div className="dropdown-scroll max-h-64 overflow-y-auto py-1">
              {years.map((year) => (
                <button
                  key={year}
                  type="button"
                  onClick={() => handleYearChange(String(year))}
                  className="w-full px-3 py-2 text-left text-sm text-gray-900 transition-colors hover:bg-gray-50"
                >
                  {year}년
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 월 선택 드롭다운 */}
      <div ref={monthRef} className="relative">
        <button
          type="button"
          onClick={() => setIsMonthOpen(!isMonthOpen)}
          className={`w-full rounded-lg border bg-white px-3 py-3 text-sm transition-colors outline-none ${
            isMonthOpen ? 'border-blue-500' : 'border-gray-200'
          } ${!selectedMonth ? 'text-gray-400' : 'text-gray-900'} flex items-center justify-between`}
        >
          <span>{selectedMonth ? `${selectedMonth}월` : '월 선택'}</span>
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isMonthOpen && (
          <div className="absolute z-10 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg">
            <div className="dropdown-scroll max-h-64 overflow-y-auto py-1">
              {months.map((month) => (
                <button
                  key={month}
                  type="button"
                  onClick={() => handleMonthChange(String(month))}
                  className="w-full px-3 py-2 text-left text-sm text-gray-900 transition-colors hover:bg-gray-50"
                >
                  {month}월
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
