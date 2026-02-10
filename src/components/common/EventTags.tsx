interface EventTagsProps {
  category?: string; //  "헬스", "요가", "필라테스", "복싱", "스쿼시" 등
  level?: string; // "입문", "초급", "중급", "고급"
  className?: string;
  size?: 'sm' | 'md'; // 'sm': 작은 사이즈 (기본값), 'md': 중간 사이즈
}

export default function EventTags({
  category,
  level,
  className = '',
  size = 'sm',
}: EventTagsProps) {
  if (!category && !level) return null;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <div className={`flex flex-wrap gap-1 ${className}`}>
      {/* 프로그램 종류 (Category) -> 파란색 */}
      {category && (
        <span className={`rounded bg-blue-50 font-medium text-blue-700 ${sizeClasses[size]}`}>
          {category}
        </span>
      )}

      {/*  난이도 (Level) -> 회색 */}
      {level && (
        <span className={`rounded bg-gray-100 font-medium text-gray-700 ${sizeClasses[size]}`}>
          {level}
        </span>
      )}
    </div>
  );
}
