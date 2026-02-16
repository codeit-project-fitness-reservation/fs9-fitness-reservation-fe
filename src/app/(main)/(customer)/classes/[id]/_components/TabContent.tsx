import { Class, ClassSlot } from '@/types/class';
import { TabType } from './types';
import IntroTab from './IntroTab';
import ScheduleTab from './ScheduleTab';
import RulesTab from './RulesTab';
import ReviewsTab from './ReviewsTab';

interface TabContentProps {
  activeTab: TabType;
  classData: Class;
  selectedDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
  onTimeSlotSelect: (slot: ClassSlot) => void;
  selectedTimeSlot: ClassSlot | null;
  reservationSlotId?: string | null;
  reservationHour?: string | null;
}

export default function TabContent({
  activeTab,
  classData,
  selectedDate,
  onDateSelect,
  onTimeSlotSelect,
  selectedTimeSlot,
  reservationSlotId,
  reservationHour,
}: TabContentProps) {
  return (
    <div className="min-h-[200px]">
      {activeTab === 'intro' && <IntroTab classData={classData} />}
      {activeTab === 'schedule' && (
        <ScheduleTab
          classId={classData.id}
          selectedDate={selectedDate}
          onDateSelect={onDateSelect}
          onTimeSlotSelect={onTimeSlotSelect}
          selectedTimeSlot={selectedTimeSlot}
          reservationSlotId={reservationSlotId}
          reservationHour={reservationHour}
        />
      )}
      {activeTab === 'rules' && <RulesTab classData={classData} />}
      {activeTab === 'reviews' && <ReviewsTab />}
    </div>
  );
}
