'use client';

import { DayPicker } from 'react-day-picker';
import { ko } from 'date-fns/locale';
import 'react-day-picker/dist/style.css';
import { formatDateCaption } from '@/lib/utils/date';
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
        .rdp-caption {
          display: flex;
          justify-content: space-between;
          align-items: center;
          align-self: stretch;
          position: relative;
          margin-bottom: 0;
        }
        .rdp-month {
          padding: 0;
        }
        .rdp-table {
          margin: 0;
          width: 100%;
        }
        .rdp-cell,
        .rdp-head_cell {
          padding: 0.5rem;
        }
        .rdp-caption_label {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
        }
        .rdp-nav {
          display: flex;
          width: 100%;
          justify-content: space-between;
          position: absolute;
          left: 0;
          right: 0;
          pointer-events: none;
        }
        .rdp-button_previous,
        .rdp-button_next {
          pointer-events: auto;
          padding: 0;
          margin: 0;
          display: flex;
          align-items: center;
        }
        .rdp-button_previous {
          margin-left: 0.5rem;
        }
        .rdp-button_next {
          margin-right: 0.5rem;
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
        /* react-day-picker selected day overrides (moved from react-day-picker.css) */
        .rdp-selected {
          font-weight: normal;
        }
        .rdp-selected .rdp-day_button {
          border: none;
          border-radius: 9999px;
          background: #2970ff !important;
          color: #fff !important;
        }
        .rdp-selected .rdp-day_button:hover {
          background: #2970ff !important;
        }
      `}</style>
      <DayPicker
        mode="single"
        selected={selectedDate}
        onSelect={onSelect}
        locale={ko}
        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
        formatters={{
          formatCaption: formatDateCaption,
        }}
        showOutsideDays={false}
      />
    </div>
  );
}
