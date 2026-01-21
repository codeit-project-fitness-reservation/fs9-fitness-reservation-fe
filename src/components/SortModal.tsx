import React from 'react';

export type SortOption = 'recommended' | 'distance' | 'priceLow';

type SortModalProps = {
  /** parent must be `relative` so this dropdown can anchor under the trigger button */
  isOpen: boolean;
  selectedSort: SortOption;
  onClose: () => void;
  onSelect: (sort: SortOption) => void;
};

const SORT_OPTIONS: Array<{ value: SortOption; label: string }> = [
  { value: 'recommended', label: '추천순' },
  { value: 'distance', label: '거리순' },
  { value: 'priceLow', label: '가격낮은순' },
];

export default function SortModal({ isOpen, selectedSort, onClose, onSelect }: SortModalProps) {
  if (!isOpen) return null;

  const handleSelect = (sort: SortOption) => {
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
