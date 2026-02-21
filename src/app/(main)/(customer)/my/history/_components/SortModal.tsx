export type HistorySortOption = 'latest' | 'oldest' | 'priceHigh' | 'priceLow';

type SortModalProps = {
  isOpen: boolean;
  selectedSort: HistorySortOption;
  onClose: () => void;
  onSelect: (sort: HistorySortOption) => void;
};

const SORT_OPTIONS: Array<{ value: HistorySortOption; label: string }> = [
  { value: 'latest', label: '최신순' },
  { value: 'oldest', label: '오래된순' },
  { value: 'priceHigh', label: '가격 높은순' },
  { value: 'priceLow', label: '가격 낮은순' },
];

export default function SortModal({ isOpen, selectedSort, onClose, onSelect }: SortModalProps) {
  if (!isOpen) return null;

  const handleSelect = (sort: HistorySortOption) => {
    onSelect(sort);
    onClose();
  };

  return (
    <div className="absolute top-full left-0 z-50 mt-2 w-[140px] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
      {SORT_OPTIONS.map((option) => (
        <button
          key={option.value}
          onClick={() => handleSelect(option.value)}
          className={`w-full px-4 py-2.5 text-left text-sm font-medium transition-colors ${
            selectedSort === option.value
              ? 'bg-gray-100 text-gray-900'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
