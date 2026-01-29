import { Control, Controller } from 'react-hook-form';
import { ClassFormInput, DayOfWeek, dayLabels } from '../classschema';

interface TimeSlotSelectorProps {
  control: Control<ClassFormInput>;
}

// 09:00 ~ 23:00 시간대 생성 (1시간 단위)
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

export function TimeSlotSelector({ control }: TimeSlotSelectorProps) {
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
              render={({ field }) => (
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700">{dayLabels[day]}</label>
                  <div className="relative">
                    <select
                      {...field}
                      value={field.value || ''}
                      onChange={(e) => field.onChange(e.target.value || null)}
                      className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 py-3 pr-10 text-sm text-gray-500 transition-all outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="">원하는 시간대를 선택해주세요</option>
                      {timeSlots.map((time, index) => (
                        <option key={time} value={time}>
                          {getTimeRangeLabel(time, index)}
                        </option>
                      ))}
                    </select>
                    <svg
                      className="pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 text-gray-400"
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
                  </div>
                </div>
              )}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
