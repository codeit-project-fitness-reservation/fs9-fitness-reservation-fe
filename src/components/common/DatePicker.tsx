'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { DayPicker, useDayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import icChevronLeft from '@/assets/images/chevron-left.svg';
import icChevronRight from '@/assets/images/chevron-right.svg';

interface DatePickerProps {
  selected?: Date;
  onSelect: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
  onOpenChange?: (open: boolean) => void;
}

/** 년/월 옆에 < > 네비게이션 배치 (피그마 디자인) */
function CustomMonthCaption(props: React.ComponentProps<'div'> & { children?: React.ReactNode }) {
  const {
    children,
    calendarMonth: _calendarMonth,
    displayIndex: _displayIndex,
    ...rest
  } = props as typeof props & {
    calendarMonth?: unknown;
    displayIndex?: unknown;
  };
  void _calendarMonth;
  void _displayIndex;
  const { previousMonth, nextMonth, goToMonth } = useDayPicker();
  const handlePrev = () => previousMonth && goToMonth(previousMonth);
  const handleNext = () => nextMonth && goToMonth(nextMonth);

  return (
    <div {...rest} className="mb-4 flex w-full items-center justify-between">
      <span className="text-sm font-semibold text-[#353A40]">{children}</span>
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={handlePrev}
          disabled={!previousMonth}
          aria-label="이전 달"
          className="flex h-5 w-5 items-center justify-center p-0 opacity-50 transition-opacity hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-30"
        >
          <Image src={icChevronLeft} alt="" width={20} height={20} className="h-5 w-5 shrink-0" />
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={!nextMonth}
          aria-label="다음 달"
          className="flex h-5 w-5 items-center justify-center p-0 opacity-50 transition-opacity hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-30"
        >
          <Image src={icChevronRight} alt="" width={20} height={20} className="h-5 w-5 shrink-0" />
        </button>
      </div>
    </div>
  );
}

export default function DatePicker({
  selected,
  onSelect,
  placeholder = '날짜를 선택해주세요.',
  className = '',
  onOpenChange,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempSelected, setTempSelected] = useState<Date | undefined>(selected);
  const [dropdownPosition, setDropdownPosition] = useState<{
    top?: number;
    bottom?: number;
    left: number;
    width: number;
  } | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const formatDate = (date: Date | undefined): string => {
    if (!date) return '';
    return format(date, 'yyyy. MM. dd', { locale: ko });
  };

  const handleOpen = () => {
    setTempSelected(selected);
    const rect = triggerRef.current?.getBoundingClientRect();
    if (rect && typeof window !== 'undefined') {
      const isMobile = window.innerWidth < 768;
      const width = isMobile ? Math.min(299, rect.width) : Math.min(315, rect.width);
      const padding = 16;
      const left = Math.max(padding, Math.min(rect.left, window.innerWidth - width - padding));
      if (isMobile) {
        setDropdownPosition({ bottom: window.innerHeight - rect.top + 8, left, width });
      } else {
        setDropdownPosition({ top: rect.bottom + 8, left, width });
      }
    }
    setIsOpen(true);
    onOpenChange?.(true);
  };

  const handleConfirm = () => {
    onSelect(tempSelected);
    setIsOpen(false);
    setDropdownPosition(null);
    onOpenChange?.(false);
  };

  const handleCancel = () => {
    setTempSelected(selected);
    setIsOpen(false);
    setDropdownPosition(null);
    onOpenChange?.(false);
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <div className={`relative ${className}`}>
      <button
        ref={triggerRef}
        type="button"
        onClick={handleOpen}
        className={`flex w-full items-center justify-between gap-2 rounded-lg border bg-white px-3 py-2.5 text-left text-base transition-colors ${
          isOpen ? 'border-[#2970FF]' : 'border-gray-300 focus:border-[#2970FF] focus:outline-none'
        }`}
      >
        <span
          className={`flex-1 overflow-hidden text-ellipsis whitespace-nowrap ${
            selected ? 'text-gray-900' : 'text-gray-500'
          }`}
        >
          {selected ? formatDate(selected) : placeholder}
        </span>
        <svg
          className="h-4 w-4 shrink-0 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen &&
        dropdownPosition &&
        typeof document !== 'undefined' &&
        createPortal(
          <>
            <div className="fixed inset-0 z-9998" onClick={handleCancel} aria-hidden="true" />
            <div
              className="fixed z-9999 flex flex-col gap-4 rounded-2xl border border-[#E9EAEB] bg-white p-4 shadow-[0px_1px_8px_0px_rgba(0,0,0,0.06)]"
              style={{
                ...(dropdownPosition.top !== undefined
                  ? { top: dropdownPosition.top }
                  : { bottom: dropdownPosition.bottom }),
                left: dropdownPosition.left,
                width: dropdownPosition.width,
                maxWidth: 'calc(100vw - 2rem)',
              }}
            >
              <DayPicker
                mode="single"
                selected={tempSelected}
                onSelect={(date) => setTempSelected(date)}
                locale={ko}
                hideNavigation
                disabled={{ before: new Date() }}
                components={{ MonthCaption: CustomMonthCaption }}
                formatters={{ formatCaption: (date) => format(date, 'yyyy년 M월', { locale: ko }) }}
                classNames={{
                  months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
                  month: 'space-y-4',
                  month_grid: 'w-full border-collapse',
                  weekdays: 'flex mb-1',
                  weekday:
                    'w-10 h-10 text-center text-sm font-normal text-[#414651] flex items-center justify-center',
                  weeks: 'flex flex-col',
                  week: 'flex w-full mb-1',
                  day: 'h-10 w-10 p-0 font-normal rounded-full text-sm',
                  day_button: 'h-10 w-10 p-0 rounded-full flex items-center justify-center text-sm',
                  selected:
                    'bg-[#2970FF] text-white font-medium hover:bg-[#2970FF] hover:text-white focus:bg-[#2970FF] focus:text-white',
                  today: 'bg-gray-100 text-[#414651]',
                  outside: 'text-[#717680] opacity-50',
                  disabled: 'text-[#717680] opacity-50',
                  hidden: 'invisible',
                }}
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  className="flex-1 rounded-lg border-2 border-white/12 bg-blue-500 px-3.5 py-2.5 text-sm font-semibold text-white hover:bg-[#155EEF]"
                >
                  확인
                </button>
              </div>
            </div>
          </>,
          document.body,
        )}
    </div>
  );
}
