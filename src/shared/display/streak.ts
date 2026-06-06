import dayjs from "dayjs";

import type { GoalPeriod } from "@/types";

function getPluralCategory(count: number, language: string | undefined) {
  const normalizedLanguage = language?.startsWith("ru") ? "ru" : "en";

  if (typeof Intl !== "undefined" && typeof Intl.PluralRules === "function") {
    return new Intl.PluralRules(normalizedLanguage).select(count);
  }

  if (normalizedLanguage === "ru") {
    const mod10 = count % 10;
    const mod100 = count % 100;

    if (mod10 === 1 && mod100 !== 11) return "one";
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "few";
    return "many";
  }

  return count === 1 ? "one" : "other";
}

function getGoalPeriodUnit(goalPeriod: GoalPeriod | undefined | null) {
  if (goalPeriod === "WEEKLY") {
    return "week";
  }

  if (goalPeriod === "MONTHLY") {
    return "month";
  }

  return "day";
}

export function getStreakUnitTranslationKey(goalPeriod: GoalPeriod | undefined | null, count: number, language: string | undefined) {
  const unit = getGoalPeriodUnit(goalPeriod);
  const category = getPluralCategory(count, language);

  if (category === "one") {
    return `progress.streak.${unit}_one`;
  }

  if (category === "few") {
    return `progress.streak.${unit}_few`;
  }

  return `progress.streak.${unit}_many`;
}

export function getStreakWindowTranslationKey(goalPeriod: GoalPeriod | undefined | null) {
  if (goalPeriod === "WEEKLY") {
    return "progress.last_7_weeks";
  }

  if (goalPeriod === "MONTHLY") {
    return "progress.last_7_months";
  }

  return "progress.last_7_days";
}

export function formatStreakPeriodLabel(goalPeriod: GoalPeriod | undefined | null, date: dayjs.Dayjs, language: string | undefined) {
  const locale = language?.startsWith("ru") ? "ru" : "en";
  const localized = date.locale(locale);

  if (goalPeriod === "WEEKLY") {
    return localized.format("DD.MM");
  }

  if (goalPeriod === "MONTHLY") {
    return localized.format("MMM");
  }

  return localized.format("dd");
}
