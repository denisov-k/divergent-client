import type { TFunction } from "i18next";

const reminderWeekdayKeyByValue: Record<string, string> = {
  mon: "weekdays.mon",
  tue: "weekdays.tue",
  wed: "weekdays.wed",
  thu: "weekdays.thu",
  fri: "weekdays.fri",
  sat: "weekdays.sat",
  sun: "weekdays.sun",
  "1": "weekdays.mon",
  "2": "weekdays.tue",
  "3": "weekdays.wed",
  "4": "weekdays.thu",
  "5": "weekdays.fri",
  "6": "weekdays.sat",
  "7": "weekdays.sun",
};

export function formatReminderDayLabel(day: string, t: TFunction) {
  const normalized = String(day).toLowerCase();
  const translationKey = reminderWeekdayKeyByValue[normalized];

  return translationKey ? t(translationKey) : day;
}
