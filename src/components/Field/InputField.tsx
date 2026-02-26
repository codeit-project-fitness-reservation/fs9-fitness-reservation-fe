'use client';

import { ReactNode, useState, useId, forwardRef, InputHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';
import Image from 'next/image';

import eyeOn from '@/assets/images/eyeon.svg';
import eyeOff from '@/assets/images/eyeoff.svg';

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  required?: boolean;
  rightElement?: ReactNode;
  showPasswordToggle?: boolean;
  density?: 'md' | 'sm';
  className?: string;
  containerClassName?: string;
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  (
    {
      label,
      type = 'text',
      placeholder,
      error,
      className = '',
      containerClassName = '',
      required = false,
      rightElement,
      showPasswordToggle = true,
      density = 'md',
      ...props
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const generatedId = useId();
    const id = props.id || generatedId;
    const errorId = `${id}-error`;
    const isDisabled = Boolean(props.disabled);
    const ariaDescribedBy =
      [props['aria-describedby'], error ? errorId : undefined].filter(Boolean).join(' ') ||
      undefined;

    const isPassword = type === 'password';
    const resolvedType = isPassword && showPassword ? 'text' : type;

    const inputClasses = twMerge(
      `w-full flex-1 bg-transparent outline-none text-[16px] font-normal leading-6 text-[#181D27] placeholder:text-gray-400 disabled:cursor-not-allowed disabled:text-[#A4A7AE] disabled:placeholder:text-[#A4A7AE]`,
      className,
    );

    const paddingClasses =
      density === 'sm' ? 'px-[12px] py-[6px] min-h-[38px]' : 'px-[12px] py-[10px] min-h-[46px]';

    const wrapperClasses = twMerge(
      `flex w-full items-center gap-2 rounded-[8px] border bg-white ${paddingClasses} transition-colors focus-within:ring-1`,
      isDisabled ? 'cursor-not-allowed bg-[#F9FAFB] border-[#E9EAEB] focus-within:ring-0' : '',
      error
        ? `border-[#FDA29B] focus-within:ring-[rgba(253,162,155,0.35)]`
        : `border-[#D5D7DA] focus-within:border-[#2970FF] focus-within:ring-[rgba(41,112,255,0.25)]`,
      containerClassName,
    );

    return (
      <div className="flex w-full flex-col gap-1.5">
        {label && (
          <label
            htmlFor={id}
            className="cursor-pointer text-[14px] leading-5 font-medium text-[#252B37]"
          >
            <span>{label}</span>
            {required && <span className="text-[#2970FF]"> *</span>}
          </label>
        )}
        <div className={wrapperClasses}>
          <input
            id={id}
            ref={ref}
            type={resolvedType}
            placeholder={placeholder}
            className={inputClasses}
            aria-invalid={Boolean(error) || undefined}
            aria-describedby={ariaDescribedBy}
            {...props}
          />

          {rightElement}

          {isPassword && showPasswordToggle && !rightElement && (
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="shrink-0 p-1"
              aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
            >
              <Image src={showPassword ? eyeOn : eyeOff} alt="" width={24} height={24} />
            </button>
          )}
        </div>
        {error && (
          <p id={errorId} className="text-[14px] leading-5 text-[#D92D20]">
            {error}
          </p>
        )}
      </div>
    );
  },
);

InputField.displayName = 'InputField';

export default InputField;
