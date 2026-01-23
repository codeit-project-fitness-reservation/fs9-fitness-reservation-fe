'use client';

import { useState, useRef, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { EventContentArg, DayHeaderContentArg } from '@fullcalendar/core';
import koLocale from '@fullcalendar/core/locales/ko';
import Image from 'next/image';
import icUser from '@/assets/images/user-02.svg';
import { ScheduleCalendarProps } from './types';
import EventTags from '../EventTags';

export default function ScheduleCalendar({
  events,
  onEventClick,
  title = '오늘의 스케줄',
  showViewToggle = true,
  initialView = 'timeGridDay',
  slotMinTime = '09:00:00',
  slotMaxTime = '24:00:00',
  slotDuration = '00:30:00',
  renderEvent,
}: ScheduleCalendarProps) {
  const [view, setView] = useState<'timeGridDay' | 'timeGridWeek'>(initialView);
  const [mounted, setMounted] = useState(false);
  const calendarRef = useRef<FullCalendar>(null);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const fullCalendarEvents = events.map((event) => ({
    id: event.id,
    title: event.title,
    start: event.start,
    end: event.end,
    extendedProps: {
      ...event.resource,
    },
  }));

  const renderDayHeader = (args: DayHeaderContentArg) => {
    const date = args.date;
    const today = new Date();
    const isToday =
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();

    const weekday = date.toLocaleDateString('ko-KR', { weekday: 'short' });
    const day = date.getDate();

    return (
      <div className="flex flex-col items-center gap-1.5 py-2">
        <span className="text-xs font-medium text-gray-500">{weekday}</span>
        <div
          className={`flex items-center justify-center ${
            isToday
              ? 'size-6 rounded-full bg-blue-500 font-semibold text-white'
              : 'font-medium text-gray-800'
          } text-xs leading-4.5`}
        >
          {day}
        </div>
      </div>
    );
  };

  const renderEventContent = (eventInfo: EventContentArg) => {
    if (renderEvent) {
      const originalEvent = events.find((e) => e.id === eventInfo.event.id);
      if (originalEvent) return renderEvent(originalEvent);
    }

    const { capacity, instructor, status, category, level, currentReservations, maxCapacity } =
      eventInfo.event.extendedProps;
    const isDayView = view === 'timeGridDay';

    if (!isDayView) {
      return (
        <div className="flex h-full w-full items-center justify-center px-1 text-[10px] font-semibold text-gray-800">
          {eventInfo.event.title}
        </div>
      );
    }

    const statusStyles =
      status === '반려됨'
        ? 'bg-red-50 text-red-600'
        : status === '대기중'
          ? 'bg-blue-50 text-blue-600'
          : 'bg-[#f5f5f5] text-[#414651]';

    const capacityText = capacity
      ? capacity
      : currentReservations != null && maxCapacity != null
        ? `${currentReservations}/${maxCapacity}`
        : null;

    return (
      <div className="flex h-full w-full flex-col px-1.5 py-1">
        <div className="mb-1 flex-1 overflow-hidden">
          <div className="text-xs font-bold text-gray-800">{eventInfo.event.title}</div>

          {instructor && (
            <div className="mt-1 text-[12px] font-medium text-gray-500">{instructor}</div>
          )}

          {capacityText && (
            <div className="mt-2 flex items-center gap-1 text-[11px] text-gray-500">
              <Image src={icUser} alt="" width={10} height={10} className="opacity-70" />
              <span>{capacityText}</span>
            </div>
          )}
        </div>

        <div className="flex shrink-0 flex-wrap items-end justify-between gap-1">
          <EventTags category={category} level={level} />

          {status && (
            <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${statusStyles}`}>
              {status}
            </span>
          )}
        </div>
      </div>
    );
  };

  if (!mounted) return null;

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-800">{title}</h2>
        {showViewToggle && (
          <div className="flex gap-1.5 rounded bg-gray-100 p-1">
            {(['timeGridDay', 'timeGridWeek'] as const).map((v) => (
              <button
                key={v}
                onClick={() => {
                  setView(v);
                  calendarRef.current?.getApi().changeView(v);
                }}
                className={`h-6 w-16 rounded text-[10px] leading-3.5 font-medium transition-all ${
                  view === v ? 'bg-white text-gray-800' : 'bg-gray-100 text-gray-500'
                }`}
              >
                {v === 'timeGridDay' ? '일간' : '주간'}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="schedule-calendar overflow-hidden rounded-xl border border-gray-200 bg-white">
        <FullCalendar
          ref={calendarRef}
          plugins={[timeGridPlugin, interactionPlugin]}
          initialView={initialView}
          headerToolbar={false}
          locale={koLocale}
          events={fullCalendarEvents}
          eventContent={renderEventContent}
          slotMinTime={slotMinTime}
          slotMaxTime={slotMaxTime}
          slotDuration={slotDuration}
          contentHeight="auto"
          allDaySlot={false}
          dayHeaderContent={renderDayHeader}
          slotLabelFormat={{
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          }}
          eventClick={(info) => {
            const originalEvent = events.find((e) => e.id === info.event.id);
            if (originalEvent && onEventClick) onEventClick(originalEvent);
          }}
        />
      </div>
    </div>
  );
}
