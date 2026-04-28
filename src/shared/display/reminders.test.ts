import test from "node:test";
import assert from "node:assert/strict";

import type { TFunction } from "i18next";

import { formatReminderDayLabel } from "./reminders.ts";

const t = ((key: string) =>
  ({
    "weekdays.mon": "\u041f\u043d",
    "weekdays.tue": "\u0412\u0442",
    "weekdays.wed": "\u0421\u0440",
    "weekdays.thu": "\u0427\u0442",
    "weekdays.fri": "\u041f\u0442",
    "weekdays.sat": "\u0421\u0431",
    "weekdays.sun": "\u0412\u0441",
  })[key] ?? key) as TFunction;

test("formats reminder weekdays from string and numeric values", () => {
  assert.equal(formatReminderDayLabel("mon", t), "\u041f\u043d");
  assert.equal(formatReminderDayLabel("Tue", t), "\u0412\u0442");
  assert.equal(formatReminderDayLabel("7", t), "\u0412\u0441");
});

test("falls back to the original value for unknown weekdays", () => {
  assert.equal(formatReminderDayLabel("holiday", t), "holiday");
});
