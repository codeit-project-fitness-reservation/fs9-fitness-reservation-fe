import { Class, ClassSlot } from '@/types/class';
import { TabType } from '@/app/(main)/(customer)/classes/[id]/_components/types';
import IntroTab from '@/app/(main)/(customer)/classes/[id]/_components/IntroTab';
import ScheduleTab from '@/app/(main)/(customer)/classes/[id]/_components/ScheduleTab';
import RulesTab from '@/app/(main)/(customer)/classes/[id]/_components/RulesTab';
import ReviewsTab from './ReviewsTab';

interface TabContentProps {
  activeTab: TabType;
  classData: Class;
  selectedDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
  onTimeSlotSelect: (slot: ClassSlot) => void;
  selectedTimeSlot: ClassSlot | null;
  onReviewCountChange?: (count: number) => void;
}

export default function TabContent({
  activeTab,
  classData,
  selectedDate,
  onDateSelect,
  onTimeSlotSelect,
  selectedTimeSlot,
  onReviewCountChange,
}: TabContentProps) {
  return (
    <div className="min-h-50">
      {activeTab === 'intro' && <IntroTab classData={classData} />}
      {activeTab === 'schedule' && (
        <ScheduleTab
          classId={classData.id}
          selectedDate={selectedDate}
          onDateSelect={onDateSelect}
          onTimeSlotSelect={onTimeSlotSelect}
          selectedTimeSlot={selectedTimeSlot}
        />
      )}
      {activeTab === 'rules' && <RulesTab classData={classData} />}
      {activeTab === 'reviews' && classData?.id && (
        <ReviewsTab
          classId={classData.id}
          centerId={classData.centerId}
          onReviewCountChange={onReviewCountChange}
        />
      )}
    </div>
  );
}
