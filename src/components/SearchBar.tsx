import Image from 'next/image';
import searchIcon from '@/assets/images/search.svg';

type SearchBarProps = {
  className?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (query: string) => void;
};

export default function SearchBar({
  className = '',
  placeholder = '검색어를 입력해주세요.',
  value = '',
  onChange,
  onSearch,
}: SearchBarProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch(value);
    }
  };

  return (
    <div
      className={`flex flex-1 items-center gap-2 rounded-full border border-gray-300 bg-white px-6 py-3 ${className}`}
    >
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1 text-base font-normal text-gray-500 outline-none placeholder:text-gray-500"
      />
      <div className="relative size-4 shrink-0 overflow-hidden">
        <Image src={searchIcon} alt="검색" width={16} height={16} />
      </div>
    </div>
  );
}
