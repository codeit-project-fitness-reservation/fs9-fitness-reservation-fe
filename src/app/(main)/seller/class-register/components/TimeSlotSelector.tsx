import { useState, useEffect, useRef } from 'react';
import { Control, Controller } from 'react-hook-form';
import { ClassFormInput, DayOfWeek, dayLabels } from '../classschema';

interface TimeSlotSelectorProps {
  control: Control<ClassFormInput>;
}
const generateTimeSlots = () => {
  const slots: string[] = [];
  for (let hour = 9; hour <= 23; hour++) {
    const hourStr = hour.toString().padStart(2, '0');
    slots.push(`${hourStr}:00`);
  }
  return slots;
};

const timeSlots = generateTimeSlots();

const getTimeRangeLabel = (time: string, index: number): string => {
  if (index === timeSlots.length - 1) {
    return `${time} ~ 익일 00:00`;
  }
  const nextHour = timeSlots[index + 1];
  return `${time} ~ ${nextHour}`;
};

const getFirstTimeLabel = (selectedTimes: string[]): string => {
  const sortedTimes = [...selectedTimes].sort();
  const firstTime = sortedTimes[0];
  return getTimeRangeLabel(firstTime, timeSlots.indexOf(firstTime));
};

export function TimeSlotSelector({ control }: TimeSlotSelectorProps) {
  const [openDropdown, setOpenDropdown] = useState<DayOfWeek | null>(null);
  const dropdownRefs = useRef<{ [key in DayOfWeek]?: HTMLDivElement }>({});

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openDropdown) {
        const dropdownElement = dropdownRefs.current[openDropdown];
        if (dropdownElement && !dropdownElement.contains(event.target as Node)) {
          setOpenDropdown(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdown]);

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-medium text-gray-800">시간 선택</h3>
      <section className="flex flex-col gap-3 rounded-lg bg-gray-100 p-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4 lg:grid-cols-3">
          {(Object.keys(dayLabels) as DayOfWeek[]).map((day) => (
            <Controller
              key={day}
              name={`schedule.${day}`}
              control={control}
              render={({ field }) => {
                const selectedTimes = field.value || [];
                const isOpen = openDropdown === day;

                return (
                  <div
                    ref={(el) => {
                      if (el) dropdownRefs.current[day] = el;
                    }}
                    className="relative flex flex-col gap-1.5"
                  >
                    <label className="text-sm font-medium text-gray-700">{dayLabels[day]}</label>

                    <button
                      type="button"
                      onClick={() => setOpenDropdown(isOpen ? null : day)}
                      className={`w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 py-3 pr-10 text-left text-sm transition-all outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${
                        selectedTimes.length > 0 ? 'text-gray-900' : 'text-gray-500'
                      }`}
                    >
                      {selectedTimes.length > 0
                        ? getFirstTimeLabel(selectedTimes)
                        : '원하는 시간대를 선택해주세요'}
                    </button>
                    <svg
                      className={`pointer-events-none absolute top-10.5 right-4 h-4 w-4 text-gray-400 transition-transform ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>

                    {/* 드롭다운 옵션 리스트 */}
                    {isOpen && (
                      <div className="absolute top-full left-0 z-10 mt-1 max-h-64 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
                        <div className="py-1">
                          {timeSlots.map((time, index) => {
                            const isSelected = selectedTimes.includes(time);
                            return (
                              <button
                                key={time}
                                type="button"
                                onClick={() => {
                                  if (isSelected) {
                                    field.onChange(selectedTimes.filter((t) => t !== time));
                                  } else {
                                    field.onChange([...selectedTimes, time]);
                                  }
                                }}
                                className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                                  isSelected
                                    ? 'bg-blue-100 font-medium text-blue-700'
                                    : 'text-gray-700 hover:bg-gray-50'
                                }`}
                              >
                                {getTimeRangeLabel(time, index)}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
