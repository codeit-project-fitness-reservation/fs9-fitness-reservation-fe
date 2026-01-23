import React from 'react';

interface EventTagsProps {
  category?: string; //  "헬스", "요가", "필라테스", "복싱", "스쿼시" 등
  level?: string; // "입문", "초급", "중급", "고급"
  className?: string;
}

export default function EventTags({ category, level, className = '' }: EventTagsProps) {
  if (!category && !level) return null;

  return (
    <div className={`flex flex-wrap gap-1 ${className}`}>
      {/* 프로그램 종류 (Category) -> 파란색 */}
      {category && (
        <span className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700">
          {category}
        </span>
      )}

      {/*  난이도 (Level) -> 회색 */}
      {level && (
        <span className="rounded bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-700">
          {level}
        </span>
      )}
    </div>
  );
}
