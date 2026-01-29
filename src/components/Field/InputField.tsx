'use client';

import { useState, useId, forwardRef, InputHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';
import Image from 'next/image';

import eyeOn from '@/assets/images/eyeon.svg';
import eyeOff from '@/assets/images/eyeoff.svg';

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  className?: string;
  required?: boolean;
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  (
    { label, type = 'text', placeholder, error, className = '', required = false, ...props },
    ref,
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const generatedId = useId();
    const id = props.id || generatedId;

    const isPassword = type === 'password';
    const resolvedType = isPassword && showPassword ? 'text' : type;

    const baseClasses = `
    w-full px-4 py-3 border rounded-lg outline-none transition-colors text-base placeholder-gray-400
    ${error ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500'}
  `;

    const combinedClasses = twMerge(baseClasses, className);

    return (
      <div className="flex w-full flex-col gap-2">
        {label && (
          <label htmlFor={id} className="cursor-pointer text-sm font-medium text-gray-900">
            {label}
            {required && <span className="text-blue-500"> *</span>}
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

        {error && <p className="pl-1 text-xs text-red-500">{error}</p>}
      </div>
    );
  },
);

InputField.displayName = 'InputField';

export default InputField;
