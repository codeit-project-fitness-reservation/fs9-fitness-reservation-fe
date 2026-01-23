import { ScheduleEvent } from '@/types';

export interface ScheduleCalendarProps {
  events: ScheduleEvent[];

  onEventClick?: (event: ScheduleEvent) => void;

  title?: string;
  showViewToggle?: boolean;
  initialView?: 'timeGridDay' | 'timeGridWeek';

  slotMinTime?: string;
  slotMaxTime?: string;
  slotDuration?: string;
  height?: number | 'auto';

  renderEvent?: (event: ScheduleEvent) => React.ReactNode;
}
