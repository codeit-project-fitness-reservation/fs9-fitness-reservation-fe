'use client';

import { useState, forwardRef, useId, InputHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';
import Image from 'next/image';

import eyeOn from '@/assets/eyeon.svg';
import eyeOff from '@/assets/eyeoff.svg';

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  className?: string;
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, type = 'text', placeholder, error, className = '', ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const id = useId();

    const isPassword = type === 'password';
    const resolvedType = isPassword && showPassword ? 'text' : type;

    const baseClasses = `
      w-full px-4 py-3.5 border rounded-2xl outline-none transition-colors text-[16px] placeholder-gray-400
      ${error ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white focus:border-black'}
    `;

    const combinedClasses = twMerge(baseClasses, className);

    return (
      <div className="flex w-full flex-col gap-2">
        {label && (
          <label htmlFor={id} className="cursor-pointer text-[14px] font-medium text-gray-900">
            {label}
          </label>
        )}

        <div className="relative">
          <input
            id={id}
            ref={ref}
            type={resolvedType}
            placeholder={placeholder}
            className={combinedClasses}
            {...props}
          />

          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute top-1/2 right-4 -translate-y-1/2 p-1"
              aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
            >
              <Image src={showPassword ? eyeOn : eyeOff} alt="" width={24} height={24} />
            </button>
          )}
        </div>

        {error && <p className="mt-1 pl-1 text-xs text-red-500">{error}</p>}
      </div>
    );
  },
);

InputField.displayName = 'InputField';
export default InputField;
