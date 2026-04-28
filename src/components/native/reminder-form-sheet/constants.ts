export const WEEK_DAYS = [
  { key: "mon", label: "Ïí" },
  { key: "tue", label: "Âò" },
  { key: "wed", label: "Ñð" },
  { key: "thu", label: "×ò" },
  { key: "fri", label: "Ïò" },
  { key: "sat", label: "Ñá" },
  { key: "sun", label: "Âñ" },
] as const;

export const MONTH_DAYS = Array.from({ length: 31 }, (_, index) => index + 1);

export type ReminderMode = "week" | "month";
