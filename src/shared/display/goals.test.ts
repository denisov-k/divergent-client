import test from "node:test";
import assert from "node:assert/strict";

import { formatGoalDate, getGoalPeriodTranslationKey } from "./goals.ts";

test("maps goal periods to translation keys", () => {
  assert.equal(getGoalPeriodTranslationKey("DAILY"), "goal_period.daily");
  assert.equal(getGoalPeriodTranslationKey("WEEKLY"), "goal_period.weekly");
  assert.equal(getGoalPeriodTranslationKey("MONTHLY"), "goal_period.monthly");
  assert.equal(getGoalPeriodTranslationKey("NONE"), null);
  assert.equal(getGoalPeriodTranslationKey(null), null);
});

test("formats goal dates in ru-RU style", () => {
  assert.equal(formatGoalDate("2026-04-29T00:00:00.000Z"), "29.04.2026");
  assert.equal(formatGoalDate(undefined), "\u2014");
});
