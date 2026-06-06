import assert from "node:assert/strict";
import test from "node:test";

import dayjs from "dayjs";

import { buildProgressActivityView, getActivityCellStatus } from "./model";

const makeActivity = () =>
  ({
    currentStreak: 0,
    longestStreak: 0,
    period: "DAILY",
    data: [
      { periodStart: "2026-06-01", completed: 1, total: 2, status: "partial", xp: 5 },
      { periodStart: "2026-06-02", completed: 1, total: 2, status: "partial", xp: 5 },
      { periodStart: "2026-06-08", completed: 2, total: 2, status: "full", xp: 10 },
      { periodStart: "2026-06-09", completed: 2, total: 2, status: "full", xp: 10 },
    ],
  }) as never;

test("groups weekly activity into one shared bucket for coloring", () => {
  const view = buildProgressActivityView(makeActivity(), "WEEKLY", "en");

  assert.equal(view.dateStatusMap.get("2026-06-01"), "full");
  assert.equal(view.dateStatusMap.get("2026-06-02"), "full");
  assert.equal(view.dateStatusMap.get("2026-06-08"), "full");
  assert.equal(view.dateStatusMap.get("2026-06-09"), "full");
  assert.equal(view.currentStreak, 2);
  assert.equal(view.longestStreak, 2);
  assert.deepEqual(view.streakItems.map((item) => item.active), [false, false, false, false, false, true, true]);
  assert.equal(view.streakItems[0].label.length > 0, true);
});

test("groups monthly activity into one shared bucket for coloring", () => {
  const view = buildProgressActivityView(makeActivity(), "MONTHLY", "ru");

  assert.equal(view.dateStatusMap.get("2026-06-01"), "full");
  assert.equal(view.dateStatusMap.get("2026-06-02"), "full");
  assert.equal(view.dateStatusMap.get("2026-06-08"), "full");
  assert.equal(view.dateStatusMap.get("2026-06-09"), "full");
  assert.equal(view.currentStreak, 1);
  assert.equal(view.longestStreak, 1);
  assert.equal(view.streakItems.length, 7);
  assert.equal(view.streakItems[6].label.length > 0, true);
});

test("marks missed periods red only after goal creation and outside the current period", () => {
  const goal = {
    id: "goal-1",
    title: "Goal",
    category: "work",
    goalType: "TASK",
    goalPeriod: "WEEKLY",
    tasks: [],
    createdAt: "2026-05-20T10:00:00.000Z",
  } as never;

  const dateStatusMap = new Map<string, "empty" | "partial" | "full">();
  const missedDay = dayjs("2026-05-28T12:00:00.000Z");
  const beforeCreationDay = dayjs("2026-05-18T12:00:00.000Z");
  const currentPeriodDay = dayjs("2026-06-04T12:00:00.000Z");

  assert.equal(getActivityCellStatus(missedDay, goal, dateStatusMap), "missed");
  assert.equal(getActivityCellStatus(beforeCreationDay, goal, dateStatusMap), "empty");
  assert.equal(getActivityCellStatus(currentPeriodDay, goal, dateStatusMap), "empty");
});
