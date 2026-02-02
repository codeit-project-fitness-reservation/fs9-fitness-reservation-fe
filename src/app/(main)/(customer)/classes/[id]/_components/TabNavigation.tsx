import { TabType } from './types';

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  reviewCount?: number;
}

export default function TabNavigation({
  activeTab,
  onTabChange,
  reviewCount = 0,
}: TabNavigationProps) {
  return (
    <div className="flex items-center gap-8 border-b border-gray-200">
      <button
        onClick={() => onTabChange('intro')}
        className={`pb-3 text-base font-medium transition-colors ${
          activeTab === 'intro'
            ? 'border-b-2 border-blue-500 text-blue-600'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        소개
      </button>
      <button
        onClick={() => onTabChange('schedule')}
        className={`pb-3 text-base font-medium transition-colors ${
          activeTab === 'schedule'
            ? 'border-b-2 border-blue-500 text-blue-600'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        시간표
      </button>
      <button
        onClick={() => onTabChange('rules')}
        className={`pb-3 text-base font-medium transition-colors ${
          activeTab === 'rules'
            ? 'border-b-2 border-blue-500 text-blue-600'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        규정
      </button>
      <button
        onClick={() => onTabChange('reviews')}
        className={`pb-3 text-base font-medium transition-colors ${
          activeTab === 'reviews'
            ? 'border-b-2 border-blue-500 text-blue-600'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        리뷰({reviewCount})
      </button>
    </div>
  );
}
