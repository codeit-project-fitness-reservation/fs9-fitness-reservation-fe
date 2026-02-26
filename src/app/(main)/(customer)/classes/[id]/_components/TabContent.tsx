import { Class, ClassSlot } from '@/types/class';
import { TabType } from './types';
import type { SlotItemResponse } from '@/lib/api/class';
import IntroTab from './IntroTab';
import ScheduleTab from './ScheduleTab';
import RulesTab from './RulesTab';
import ReviewsTab from './ReviewsTab';

interface TabContentProps {
  activeTab: TabType;
  classData: Class;
  classSlots?: SlotItemResponse[];
  selectedDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
  onTimeSlotSelect: (slot: ClassSlot) => void;
  selectedTimeSlot: ClassSlot | null;
  reservationSlotId?: string | null;
  reservationHour?: string | null;
  onReviewCountChange?: (count: number) => void;
}

export default function TabContent({
  activeTab,
  classData,
  classSlots,
  selectedDate,
  onDateSelect,
  onTimeSlotSelect,
  selectedTimeSlot,
  reservationSlotId,
  reservationHour,
  onReviewCountChange,
}: TabContentProps) {
  return (
    <div className="min-h-50">
      {activeTab === 'intro' && <IntroTab classData={classData} />}
      {activeTab === 'schedule' && (
        <ScheduleTab
          classId={classData.id}
          slots={classSlots}
          selectedDate={selectedDate}
          onDateSelect={onDateSelect}
          onTimeSlotSelect={onTimeSlotSelect}
          selectedTimeSlot={selectedTimeSlot}
          reservationSlotId={reservationSlotId}
          reservationHour={reservationHour}
        />
      )}
      {activeTab === 'rules' && <RulesTab classData={classData} />}
      {activeTab === 'reviews' && (
        <ReviewsTab classId={classData.id} onReviewCountChange={onReviewCountChange} />
      )}
    </div>
  );
}
