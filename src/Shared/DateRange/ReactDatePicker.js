import React from 'react';
import { DateRangePicker } from 'react-date-range';
import settings from '../../configs/config_settings.json';

import {
  addDays,
  endOfDay,
  startOfDay,
  startOfMonth,
  endOfMonth,
  addMonths,
  startOfWeek,
  endOfWeek,
  isSameDay,
  differenceInCalendarDays,
} from 'date-fns';
import * as rdrLocales from 'react-date-range/dist/locale';
import { useTranslation } from 'react-i18next';

export default function ReactDatePicker({ selectionRange, handleSelect }) {
  const { t } = useTranslation();

  const staticRangeHandler = {
    range: {},
    isSelected(range) {
      const definedRange = this.range();

      return (
        isSameDay(range.startDate, definedRange.startDate) &&
        isSameDay(range.endDate, definedRange.endDate)
      );
    },
  };
  // custom language selection for react-date-range

  function createStaticRanges(ranges) {
    return ranges.map((range) => ({ ...staticRangeHandler, ...range }));
  }
  const defineds = {
    startOfWeek: startOfWeek(new Date()),
    endOfWeek: endOfWeek(new Date()),
    startOfLastWeek: startOfWeek(addDays(new Date(), -7)),
    endOfLastWeek: endOfWeek(addDays(new Date(), -7)),
    startOfToday: startOfDay(new Date()),
    endOfToday: endOfDay(new Date()),
    startOfYesterday: startOfDay(addDays(new Date(), -1)),
    endOfYesterday: endOfDay(addDays(new Date(), -1)),
    startOfMonth: startOfMonth(new Date()),
    endOfMonth: endOfMonth(new Date()),
    startOfLastMonth: startOfMonth(addMonths(new Date(), -1)),
    endOfLastMonth: endOfMonth(addMonths(new Date(), -1)),
  };

  const staticRanges = createStaticRanges([
    {
      label: t('reactDateRange.today'),
      range: () => ({
        startDate: defineds.startOfToday,
        endDate: defineds.endOfToday,
      }),
    },
    {
      label: t('reactDateRange.yesterday'),
      range: () => ({
        startDate: defineds.startOfYesterday,
        endDate: defineds.endOfYesterday,
      }),
    },

    {
      label: t('reactDateRange.thisWeek'),
      range: () => ({
        startDate: defineds.startOfWeek,
        endDate: defineds.endOfWeek,
      }),
    },
    {
      label: t('reactDateRange.lastWeeek'),
      range: () => ({
        startDate: defineds.startOfLastWeek,
        endDate: defineds.endOfLastWeek,
      }),
    },
    {
      label: t('reactDateRange.thisMonth'),
      range: () => ({
        startDate: defineds.startOfMonth,
        endDate: defineds.endOfMonth,
      }),
    },
    {
      label: t('reactDateRange.lastMonth'),
      range: () => ({
        startDate: defineds.startOfLastMonth,
        endDate: defineds.endOfLastMonth,
      }),
    },
  ]);
  const inputRanges = [
    {
      label: t('reactDateRange.daysUpToToday'),
      range(value) {
        return {
          startDate: addDays(
            defineds.startOfToday,
            (Math.max(Number(value), 1) - 1) * -1
          ),
          endDate: defineds.endOfToday,
        };
      },
      getCurrentValue(range) {
        if (!isSameDay(range.endDate, defineds.endOfToday)) return '-';
        if (!range.startDate) return '∞';
        return (
          differenceInCalendarDays(defineds.endOfToday, range.startDate) + 1
        );
      },
    },
    {
      label: t('reactDateRange.daysStartingToday'),
      range(value) {
        const today = new Date();
        return {
          startDate: today,
          endDate: addDays(today, Math.max(Number(value), 1) - 1),
        };
      },
      getCurrentValue(range) {
        if (!isSameDay(range.startDate, defineds.startOfToday)) return '-';
        if (!range.endDate) return '∞';
        return (
          differenceInCalendarDays(range.endDate, defineds.startOfToday) + 1
        );
      },
    },
  ];

  return (
    <DateRangePicker
      ranges={[selectionRange]}
      onChange={handleSelect}
      months={1}
      // scroll={{ enabled: true }}
      direction='vertical'
      preventSnapRefocus={true}
      calendarFocus='backwards'
      showSelectionPreview={true}
      moveRangeOnFirstSelection={true}
      locale={settings.language.includes('fi') ? rdrLocales.fi : rdrLocales.en}
      hasCustomRendering={true}
      staticRanges={staticRanges}
      inputRanges={inputRanges}
    />
  );
}
