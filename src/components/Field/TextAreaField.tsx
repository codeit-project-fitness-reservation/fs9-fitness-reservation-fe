'use client';

import { forwardRef, useId, TextareaHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

interface TextAreaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  className?: string;
}

const TextAreaField = forwardRef<HTMLTextAreaElement, TextAreaFieldProps>(
  ({ label, placeholder, error, className = '', ...props }, ref) => {
    const id = useId();

    const baseClasses = `
      w-full px-4 py-3.5 border rounded-lg outline-none transition-colors text-[16px] placeholder-gray-400
      h-48 resize-none align-top
      ${error ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'}
    `;

    const combinedClasses = twMerge(baseClasses, className);

    return (
      <div className="flex w-full flex-col gap-2">
        {label && (
          <label htmlFor={id} className="cursor-pointer text-[16px] font-normal text-gray-900">
            {label}
          </label>
        )}

        <textarea
          id={id}
          ref={ref}
          placeholder={placeholder}
          className={combinedClasses}
          {...props}
        />

        {error && <p className="mt-1 pl-1 text-xs text-red-500">{error}</p>}
      </div>
    );
  },
);

TextAreaField.displayName = 'TextAreaField';
export default TextAreaField;
