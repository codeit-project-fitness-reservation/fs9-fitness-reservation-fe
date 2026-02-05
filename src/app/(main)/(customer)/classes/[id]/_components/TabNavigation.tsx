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
    <div className="flex items-center border-b border-gray-200 px-4 pt-4">
      {[
        { id: 'intro', label: '소개' },
        { id: 'schedule', label: '시간표' },
        { id: 'rules', label: '규정' },
        { id: 'reviews', label: `리뷰(${reviewCount})` },
      ].map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id as TabType)}
          className={`-mb-px flex-1 pb-4 text-base font-medium transition-colors ${
            activeTab === tab.id
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'border-b-2 border-transparent text-gray-600 hover:text-gray-900'
          } `}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
