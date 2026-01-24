'use client';

import { useState, useEffect, useRef } from 'react';

interface InputModalProps {
  onClose: () => void;
  onSubmit: (value: string) => void;
  title?: string;
  label?: string;
  placeholder?: string;
  submitButtonText?: string;
  itemName?: string;
  isLoading?: boolean;
}

export default function InputModal({
  onClose,
  onSubmit,
  title = '입력',
  label = '내용',
  placeholder = '내용을 입력해주세요',
  submitButtonText = '전송',
  itemName,
  isLoading = false,
}: InputModalProps) {
  const [inputValue, setInputValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 100);
  }, []);

  useEffect(() => {
    return () => {
      setInputValue('');
    };
  }, []);

  const handleSubmit = () => {
    const trimmedValue = inputValue.trim();

    if (!trimmedValue) {
      return;
    }

    onSubmit(trimmedValue);
  };

  const isSubmitDisabled = isLoading || !inputValue.trim();

  return (
    <div
      className="relative rounded-lg border border-gray-200 bg-white shadow-xl"
      style={{ width: '496px' }}
    >
      <div className="flex items-center justify-between px-6 pt-6 pb-5">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <button
          onClick={onClose}
          className="-mr-1 p-1 text-gray-400 transition-colors hover:text-gray-600"
          aria-label="모달 닫기"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div className="px-6 pb-6">
        {itemName && <p className="mb-4 text-sm text-gray-600">{itemName}</p>}

        <div>
          <label htmlFor="text-input" className="mb-2 block text-sm font-medium text-gray-900">
            {label}
          </label>
          <textarea
            id="text-input"
            ref={textareaRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={placeholder}
            rows={8}
            className="w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:ring-1 focus:ring-gray-400 focus:outline-none"
            aria-label={label}
            aria-required="true"
          />
        </div>
      </div>

      <div className="px-6 pb-6">
        <button
          onClick={handleSubmit}
          disabled={isSubmitDisabled}
          className="w-full rounded-lg bg-black py-3 font-medium text-white transition-colors hover:bg-gray-900 disabled:cursor-not-allowed disabled:bg-black disabled:text-white/70 disabled:hover:bg-black"
        >
          {isLoading ? '전송 중...' : submitButtonText}
        </button>
      </div>
    </div>
  );
}
