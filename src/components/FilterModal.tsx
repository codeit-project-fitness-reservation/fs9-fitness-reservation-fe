import React from 'react';

export type FilterState = {
  reservationStatus: 'all' | 'available';
  programTypes: string[];
  difficulty: string[];
  time: string[];
};

type FilterModalProps = {
  isOpen: boolean;
  filters: FilterState;
  onClose: () => void;
  onApply: (filters: FilterState) => void;
  onReset: () => void;
};

const PROGRAM_TYPES = ['헬스', '요가', '필라테스', '복싱', '스쿼시'];
const DIFFICULTY_LEVELS = ['입문', '초급', '중급', '고급'];

// 시간대 생성 (09:00 ~ 22:59)
const TIME_SLOTS = Array.from({ length: 14 }, (_, i) => {
  const hour = i + 9;
  return `${hour.toString().padStart(2, '0')}:00 ~ ${hour.toString().padStart(2, '0')}:59`;
});

export default function FilterModal({
  isOpen,
  filters,
  onClose,
  onApply,
  onReset,
}: FilterModalProps) {
  const [localFilters, setLocalFilters] = React.useState<FilterState>(filters);
  const [isTimeDropdownOpen, setIsTimeDropdownOpen] = React.useState(false);

  React.useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  React.useEffect(() => {
    if (!isOpen) {
      setIsTimeDropdownOpen(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleProgramTypeToggle = (type: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      programTypes: prev.programTypes.includes(type)
        ? prev.programTypes.filter((t) => t !== type)
        : [...prev.programTypes, type],
    }));
  };

  const handleDifficultyToggle = (level: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      difficulty: prev.difficulty.includes(level)
        ? prev.difficulty.filter((d) => d !== level)
        : [...prev.difficulty, level],
    }));
  };

  const handleTimeToggle = (timeSlot: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      time: prev.time.includes(timeSlot)
        ? prev.time.filter((t) => t !== timeSlot)
        : [...prev.time, timeSlot],
    }));
  };

  const handleReset = () => {
    const resetFilters: FilterState = {
      reservationStatus: 'all',
      programTypes: [],
      difficulty: [],
      time: [],
    };
    setLocalFilters(resetFilters);
    onReset();
  };

  const handleApply = () => {
    onApply(localFilters);
    onClose();
  };

  return (
    <div className="absolute top-full right-0 z-50 mt-2 w-[343px] rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">필터</h2>
        <button
          onClick={onClose}
          className="flex items-center justify-center rounded-lg p-2 transition-colors hover:bg-gray-100"
          aria-label="닫기"
        >
          <img
            src="/icons/x-close.svg"
            alt="닫기"
            width={18}
            height={18}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/x-close.svg'; // fallback to public root
            }}
          />
        </button>
      </div>

      <div className="flex flex-col gap-5">
        {/* 예약 상태 */}
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-gray-900">예약 상태</p>
          <div className="flex gap-1">
            <button
              onClick={() => setLocalFilters((prev) => ({ ...prev, reservationStatus: 'all' }))}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                localFilters.reservationStatus === 'all'
                  ? 'border border-blue-500 bg-blue-50 text-blue-500'
                  : 'border border-gray-200 bg-white text-gray-700'
              }`}
            >
              전체보기
            </button>
            <button
              onClick={() =>
                setLocalFilters((prev) => ({ ...prev, reservationStatus: 'available' }))
              }
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                localFilters.reservationStatus === 'available'
                  ? 'border border-blue-500 bg-blue-50 text-blue-500'
                  : 'border border-gray-200 bg-white text-gray-700'
              }`}
            >
              예약 가능
            </button>
          </div>
        </div>

        {/* 프로그램 종류 */}
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-gray-900">프로그램 종류</p>
          <div className="flex flex-col gap-1">
            <div className="flex flex-wrap gap-1">
              {PROGRAM_TYPES.slice(0, 4).map((type) => (
                <button
                  key={type}
                  onClick={() => handleProgramTypeToggle(type)}
                  className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                    localFilters.programTypes.includes(type)
                      ? 'border border-blue-500 bg-blue-50 text-blue-500'
                      : 'border border-gray-200 bg-white text-gray-700'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
            <div className="flex gap-1">
              {PROGRAM_TYPES.slice(4).map((type) => (
                <button
                  key={type}
                  onClick={() => handleProgramTypeToggle(type)}
                  className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                    localFilters.programTypes.includes(type)
                      ? 'border border-blue-500 bg-blue-50 text-blue-500'
                      : 'border border-gray-200 bg-white text-gray-700'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 난이도 */}
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-gray-900">난이도</p>
          <div className="flex gap-2">
            {DIFFICULTY_LEVELS.map((level) => (
              <button
                key={level}
                onClick={() => handleDifficultyToggle(level)}
                className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                  localFilters.difficulty.includes(level)
                    ? 'border border-blue-500 bg-blue-50 text-blue-500'
                    : 'border border-gray-200 bg-white text-gray-700'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* 시간 */}
        <div className="relative flex flex-col gap-1.5">
          <p className="text-sm font-medium text-gray-800">시간</p>
          <button
            onClick={() => setIsTimeDropdownOpen(!isTimeDropdownOpen)}
            className="flex w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-3 py-2.5"
          >
            <span className="text-base font-normal text-gray-500">
              {localFilters.time.length > 0
                ? localFilters.time.length === 1
                  ? localFilters.time[0]
                  : `${localFilters.time[0]} 외 ${localFilters.time.length - 1}개`
                : '원하는 시간을 선택해주세요.'}
            </span>
            <svg
              width="17"
              height="17"
              viewBox="0 0 17 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={`transition-transform ${isTimeDropdownOpen ? 'rotate-180' : ''}`}
            >
              <path
                d="M4.25 6.375L8.5 10.625L12.75 6.375"
                stroke="#414651"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          {isTimeDropdownOpen && (
            <div className="absolute top-full z-10 mt-1 max-h-[200px] w-full overflow-y-auto rounded-lg border border-gray-300 bg-white shadow-lg">
              {TIME_SLOTS.map((timeSlot) => (
                <button
                  key={timeSlot}
                  onClick={() => handleTimeToggle(timeSlot)}
                  className={`w-full px-3 py-2.5 text-left text-base font-normal transition-colors ${
                    localFilters.time.includes(timeSlot)
                      ? 'bg-gray-200 text-gray-900'
                      : 'bg-white text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {timeSlot}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 버튼 */}
      <div className="mt-5 flex gap-2">
        <button
          onClick={handleReset}
          className="flex-1 rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
        >
          초기화
        </button>
        <button
          onClick={handleApply}
          className="flex-1 rounded-lg border-2 border-white/12 bg-blue-500 px-3.5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-600"
        >
          적용하기
        </button>
      </div>
    </div>
  );
}
