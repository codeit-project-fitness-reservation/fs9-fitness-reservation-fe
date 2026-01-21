import React from 'react';
import Image from 'next/image';

type ClassCardProps = {
  id: string;
  image: string;
  category: string;
  level: string;
  title: string;
  rating: number;
  reviewCount: number;
  onClick?: () => void;
};

export default function ClassCard({
  id: _id,
  image,
  category,
  level,
  title,
  rating,
  reviewCount,
  onClick,
}: ClassCardProps) {
  return (
    <div
      className="w-full cursor-pointer rounded-2xl border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md"
      onClick={onClick}
    >
      <div className="flex items-start gap-4">
        <div className="relative h-[140px] w-[140px] shrink-0 overflow-hidden rounded-lg border border-black/4">
          <Image src={image} alt={title} fill className="object-cover" sizes="140px" unoptimized />
        </div>
        <div className="flex min-h-[140px] flex-1 flex-col justify-between">
          <div className="flex flex-col gap-2">
            <div className="flex items-start gap-1">
              <div className="flex items-center rounded-md bg-blue-50 px-3 py-1">
                <p className="text-sm font-medium text-blue-700">{category}</p>
              </div>
              <div className="flex items-center rounded-md bg-gray-100 px-3 py-1">
                <p className="text-sm font-medium text-gray-700">{level}</p>
              </div>
            </div>
            <div className="flex items-center px-0.5">
              <p className="flex-1 text-xl font-semibold whitespace-pre-wrap text-gray-900">
                {title}
              </p>
            </div>
          </div>
          <div className="flex items-end gap-1">
            <div className="flex items-center gap-0.5">
              <div className="relative size-5 shrink-0 overflow-hidden">
                <div className="absolute inset-[2.5%_0_-2.5%_0]">
                  <div className="absolute inset-[4.01%_6.13%_12.31%_6.13%]">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10 2L12.5 7.5L18.5 8.5L14 12.5L15 18.5L10 15.5L5 18.5L6 12.5L1.5 8.5L7.5 7.5L10 2Z"
                        fill="#F5F5F5"
                      />
                    </svg>
                  </div>
                </div>
                <div className="absolute top-0 left-0 size-5">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10 2L12.5 7.5L18.5 8.5L14 12.5L15 18.5L10 15.5L5 18.5L6 12.5L1.5 8.5L7.5 7.5L10 2Z"
                      fill="#FFD700"
                    />
                  </svg>
                </div>
              </div>
              <p className="text-base font-semibold text-gray-900">{rating}</p>
            </div>
            <p className="text-base font-medium text-gray-400">리뷰 {reviewCount}개</p>
          </div>
        </div>
      </div>
    </div>
  );
}
