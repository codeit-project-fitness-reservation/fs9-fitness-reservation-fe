'use client';

import { DayPicker } from 'react-day-picker';
import { ko } from 'date-fns/locale';
import { format } from 'date-fns';
import 'react-day-picker/dist/style.css';
import chevronLeftIcon from '@/assets/images/chevron-left.svg';
import chevronRightIcon from '@/assets/images/chevron-right.svg';

interface DatePickerProps {
  selectedDate: Date | undefined;
  onSelect: (date: Date | undefined) => void;
}

export default function DatePicker({ selectedDate, onSelect }: DatePickerProps) {
  // Next.js에서 import한 이미지 경로를 문자열로 변환
  const chevronLeftUrl =
    typeof chevronLeftIcon === 'string' ? chevronLeftIcon : chevronLeftIcon.src || chevronLeftIcon;
  const chevronRightUrl =
    typeof chevronRightIcon === 'string'
      ? chevronRightIcon
      : chevronRightIcon.src || chevronRightIcon;

  return (
    <div className="flex justify-center rounded-lg border border-gray-200 bg-white p-4">
      <style>{`
        .rdp-day.rdp-day_selected {
          background: #2970ff;
          color: white;
        }
        .rdp-button_previous svg,
        .rdp-button_next svg {
          display: none;
        }
        .rdp-button_previous::before {
          content: '';
          display: inline-block;
          width: 24px;
          height: 24px;
          background-image: url(${chevronLeftUrl});
          background-size: contain;
          background-repeat: no-repeat;
          background-position: center;
        }
        .rdp-button_next::before {
          content: '';
          display: inline-block;
          width: 24px;
          height: 24px;
          background-image: url(${chevronRightUrl});
          background-size: contain;
          background-repeat: no-repeat;
          background-position: center;
        }
      `}</style>
      <DayPicker
        mode="single"
        selected={selectedDate}
        onSelect={onSelect}
        locale={ko}
        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
        formatters={{
          formatCaption: (date) => format(date, 'yyyy.M', { locale: ko }),
        }}
        showOutsideDays={false}
      />
    </div>
  );
}
