'use client';

import { DayPicker } from 'react-day-picker';
import { ko } from 'date-fns/locale';
import { format } from 'date-fns';
import 'react-day-picker/dist/style.css';

interface DatePickerProps {
  selectedDate: Date | undefined;
  onSelect: (date: Date | undefined) => void;
}

export default function DatePicker({ selectedDate, onSelect }: DatePickerProps) {
  return (
    <div className="flex justify-center rounded-lg border border-gray-200 bg-white p-4">
      <style>{`
        .rdp-caption {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }
        .rdp-cell {
          cursor: pointer;
          font-size: 0.875rem;
        }
        .rdp-head_cell {
          font-size: 0.875rem;
          font-weight: 500;
          color: #535862;
        }
        .rdp-day.rdp-day_selected {
          background: #2970ff;
          color: white;
        }
        .rdp-day:hover:not(.rdp-day_selected):not(.rdp-day_disabled):not(.rdp-day_outside) {
          background: #f5f5f5;
        }
        .rdp-day_outside {
          color: #a4a7ae;
          opacity: 0.5;
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
