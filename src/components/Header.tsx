import React from 'react';

function Logo() {
  return (
    <div className="flex h-8 items-center justify-center">
      <p className="text-base font-semibold text-black">LOGO</p>
    </div>
  );
}

type HeaderProps = {
  className?: string;
};

export default function Header({ className = '' }: HeaderProps) {
  return (
    <div
      className={`flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 ${className}`}
    >
      <Logo />
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          <p className="text-sm font-normal text-gray-700">홍길동님</p>
          <div className="size-1.5 overflow-hidden">
            <svg
              width="6"
              height="6"
              viewBox="0 0 6 6"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 2L3 4L5 2"
                stroke="#A4A7AE"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
        <div className="relative size-6 overflow-hidden">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"
              stroke="#414651"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M13.73 21a2 2 0 0 1-3.46 0"
              stroke="#414651"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="bg-error-500 absolute top-[calc(50%-7.5px)] left-[58.33%] h-1.5 w-1.5 -translate-y-1/2 rounded-full border-2 border-white" />
        </div>
      </div>
    </div>
  );
}
