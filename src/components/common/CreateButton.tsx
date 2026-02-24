//페이지에 수정하기 ,쿠폰 만들기 버튼 컴포넌트
'use client';

interface CreateButtonProps {
  onClick?: () => void;
  label?: string;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit';
  form?: string;
}
export default function CreateButton({
  onClick,
  label = '만들기',
  className = '',
  disabled = false,
  type = 'button',
  form,
}: CreateButtonProps) {
  return (
    <div className="pointer-events-none fixed right-0 bottom-0 left-0 z-50 flex justify-center">
      <div className="pointer-events-auto flex w-full max-w-240 items-center justify-center border-t border-gray-200 bg-white px-4 py-4">
        <button
          type={type}
          form={form}
          onClick={onClick}
          disabled={disabled}
          className={`flex w-full items-center justify-center rounded-lg border border-gray-200 px-4.5 py-3 text-base leading-6 font-semibold transition-all ${
            disabled
              ? 'cursor-not-allowed bg-gray-100 text-[#D0D5DD]'
              : 'border-2 border-white/10 bg-[#2970FF] text-white'
          } ${className}`}
        >
          {label}
        </button>
      </div>
    </div>
  );
}
