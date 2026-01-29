'use client';

import { useId, forwardRef, TextareaHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

interface TextAreaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  className?: string;
  required?: boolean;
}

const TextAreaField = forwardRef<HTMLTextAreaElement, TextAreaFieldProps>(
  ({ label, placeholder, error, className = '', required = false, ...props }, ref) => {
    const generatedId = useId();
    const id = props.id || generatedId;

    const baseClasses = `
    w-full px-4 py-3 border rounded-lg outline-none transition-colors text-base placeholder-gray-400
    h-48 resize-none align-top
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

        <textarea
          id={id}
          ref={ref}
          placeholder={placeholder}
          className={combinedClasses}
          {...props}
        />

        {error && <p className="pl-1 text-xs text-red-500">{error}</p>}
      </div>
    );
  },
);

TextAreaField.displayName = 'TextAreaField';

export default TextAreaField;
