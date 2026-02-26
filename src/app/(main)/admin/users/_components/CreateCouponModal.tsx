import { useState, useRef, useEffect } from 'react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { DayPicker } from 'react-day-picker';
import { couponApi, CreateCouponInput } from '@/lib/api/coupon';
import { cn } from '@/lib/utils';
import 'react-day-picker/dist/style.css';

// --- Icons (Replaced from Figma URLs to SVG) ---
const IconClose = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M15 5L5 15M5 5L15 15"
      stroke="currentColor"
      strokeWidth="1.66667"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconChevronDown = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M5 7.5L10 12.5L15 7.5"
      stroke="currentColor"
      strokeWidth="1.66667"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconCheck = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M10 3L4.5 8.5L2 6"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// --- Styled Components ---

function Checkbox({
  checked,
  onClick,
  label,
}: {
  checked: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <div className="flex cursor-pointer items-center gap-[6px]" onClick={onClick}>
      <div
        className={cn(
          'relative flex h-[20px] w-[20px] items-center justify-center rounded-full border transition-all',
          checked
            ? 'border-blue-600 bg-blue-600'
            : 'border-gray-200 bg-white hover:border-gray-300',
        )}
      >
        {checked && <div className="h-[8px] w-[8px] rounded-full bg-white" />}
        {/* Figma Design uses a radio-like appearance for this checkbox logic */}
      </div>
      <span className="text-[14px] leading-[20px] font-medium text-gray-800">{label}</span>
    </div>
  );
}

interface CreateCouponModalProps {
  onClose: () => void;
  onCreated: () => void;
}

export default function CreateCouponModal({ onClose, onCreated }: CreateCouponModalProps) {
  const [name, setName] = useState('');
  const [discountType, setDiscountType] = useState<'AMOUNT' | 'PERCENTAGE'>('AMOUNT');
  const [usageValue, setUsageValue] = useState<string>('');
  const [expiresAt, setExpiresAt] = useState<Date | undefined>(undefined);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const datePickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setIsDatePickerOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSubmit = async () => {
    if (!name.trim() || !usageValue || !expiresAt) return;

    const numValue = Number(usageValue);
    if (isNaN(numValue) || numValue < 0) {
      alert('올바른 값을 입력해주세요.');
      return;
    }
    if (discountType === 'PERCENTAGE' && numValue > 100) {
      alert('할인율은 100%를 넘을 수 없습니다.');
      return;
    }

    try {
      setLoading(true);
      await couponApi.createCouponTemplate({
        name,
        discountType,
        usageValue: numValue,
        expiresAt: expiresAt.toISOString(),
      });
      alert('쿠폰이 생성되었습니다.');
      onCreated();
      onClose();
    } catch (error) {
      console.error(error);
      alert('쿠폰 생성 실패');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = name.trim() && usageValue && expiresAt;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="flex w-[520px] flex-col gap-[48px] rounded-[24px] bg-white p-[24px] shadow-xl">
        {/* Header */}
        <div className="flex flex-col gap-[24px]">
          <div className="flex items-center justify-between">
            <h2 className="text-[18px] leading-[28px] font-semibold text-gray-900">쿠폰 만들기</h2>
            <button
              onClick={onClose}
              className="flex items-center justify-center rounded-[8px] p-[8px] text-gray-400 transition-colors hover:bg-gray-100"
            >
              <IconClose />
            </button>
          </div>

          <div className="flex flex-col gap-[16px]">
            {/* 1. 쿠폰 이름 */}
            <div className="flex flex-col gap-[6px]">
              <div className="flex items-center gap-[2px]">
                <span className="text-[14px] leading-[20px] font-medium text-gray-800">
                  쿠폰 이름
                </span>
                <span className="text-[14px] leading-[20px] font-medium text-blue-500">*</span>
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="쿠폰 이름을 입력해주세요"
                className="h-[44px] w-full rounded-[8px] border border-gray-300 px-[12px] py-[10px] text-[16px] text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* 2. 금액 할인 */}
            <div className="flex flex-col gap-[6px]">
              <Checkbox
                label="금액 할인"
                checked={discountType === 'AMOUNT'}
                onClick={() => {
                  setDiscountType('AMOUNT');
                  setUsageValue('');
                }}
              />
              <div
                className={cn(
                  'flex h-[44px] w-full items-center rounded-[8px] border px-[12px] py-[10px] transition-colors',
                  discountType === 'AMOUNT'
                    ? 'border-gray-300 bg-white'
                    : 'border-gray-200 bg-gray-50 opacity-60',
                )}
              >
                <input
                  type="number"
                  value={discountType === 'AMOUNT' ? usageValue : ''}
                  onChange={(e) => setUsageValue(e.target.value)}
                  disabled={discountType !== 'AMOUNT'}
                  placeholder="숫자만 입력해주세요"
                  className="flex-1 bg-transparent text-[16px] text-gray-900 placeholder:text-gray-500 focus:outline-none disabled:cursor-not-allowed"
                />
                <span className="text-[16px] font-medium text-gray-700">P</span>
              </div>
            </div>

            {/* 3. 비율 할인 */}
            <div className="flex flex-col gap-[6px]">
              <Checkbox
                label="비율 할인"
                checked={discountType === 'PERCENTAGE'}
                onClick={() => {
                  setDiscountType('PERCENTAGE');
                  setUsageValue('');
                }}
              />
              <div
                className={cn(
                  'flex h-[44px] w-full items-center rounded-[8px] border px-[12px] py-[10px] transition-colors',
                  discountType === 'PERCENTAGE'
                    ? 'border-gray-300 bg-white'
                    : 'border-gray-200 bg-gray-50 opacity-60',
                )}
              >
                <input
                  type="number"
                  value={discountType === 'PERCENTAGE' ? usageValue : ''}
                  onChange={(e) => setUsageValue(e.target.value)}
                  disabled={discountType !== 'PERCENTAGE'}
                  placeholder="숫자만 입력해주세요"
                  className="flex-1 bg-transparent text-[16px] text-gray-900 placeholder:text-gray-500 focus:outline-none disabled:cursor-not-allowed"
                />
                <span className="text-[16px] font-medium text-gray-700">%</span>
              </div>
            </div>

            {/* 4. 만료일 */}
            <div className="flex flex-col gap-[6px]" ref={datePickerRef}>
              <div className="flex items-center gap-[2px]">
                <span className="text-[14px] leading-[20px] font-medium text-gray-800">만료일</span>
                <span className="text-[14px] leading-[20px] font-medium text-blue-500">*</span>
              </div>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                  className="flex h-[44px] w-full items-center justify-between rounded-[8px] border border-gray-300 bg-white px-[12px] py-[10px] transition-colors hover:bg-gray-50 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <span
                    className={cn(
                      'text-[16px] leading-[24px]',
                      expiresAt ? 'text-gray-900' : 'text-gray-500',
                    )}
                  >
                    {expiresAt ? format(expiresAt, 'yyyy. MM. dd') : '날짜를 선택해주세요.'}
                  </span>
                  <div className="text-gray-500">
                    <IconChevronDown />
                  </div>
                </button>

                {isDatePickerOpen && (
                  <div className="absolute top-full left-0 z-10 mt-2 rounded-xl border border-gray-100 bg-white p-4 shadow-xl">
                    <DayPicker
                      mode="single"
                      selected={expiresAt}
                      onSelect={(date) => {
                        setExpiresAt(date);
                        setIsDatePickerOpen(false);
                      }}
                      locale={ko}
                      fromDate={new Date()}
                      className="border-0 bg-white"
                      classNames={{
                        head_cell: 'text-gray-400 font-medium text-sm pb-2',
                        day: 'h-9 w-9 p-0 font-medium',
                        day_selected:
                          'bg-blue-600 text-white rounded-full hover:bg-blue-700 hover:text-white',
                        day_today: 'text-blue-600 font-bold',
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex gap-[8px]">
          <button
            onClick={onClose}
            className="flex-1 rounded-[8px] border border-gray-300 bg-white px-[18px] py-[12px] text-[16px] font-semibold text-gray-700 transition-colors hover:bg-gray-50"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isFormValid || loading}
            className={cn(
              'flex-1 rounded-[8px] border border-transparent px-[18px] py-[12px] text-[16px] font-semibold text-white transition-colors',
              !isFormValid || loading
                ? 'cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400'
                : 'bg-[#181D27] hover:bg-gray-800',
            )}
          >
            {loading ? '등록 중...' : '등록'}
          </button>
        </div>
      </div>
    </div>
  );
}
