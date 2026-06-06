import test from "node:test";
import assert from "node:assert/strict";

import { isTaskCompletedThisPeriodAt, sumCompletedTaskXp } from "./model.ts";

const makeTask = (lastCompletedAt?: string, xpReward = 5) =>
  ({
    id: "task-1",
    title: "Task",
    lastCompletedAt,
    xpReward,
  }) as never;

test("resets weekly completion at Monday midnight", () => {
  const mondayStart = new Date("2026-06-01T00:00:00");

  assert.equal(isTaskCompletedThisPeriodAt(makeTask("2026-05-31T23:59:00"), "WEEKLY", mondayStart), false);
  assert.equal(isTaskCompletedThisPeriodAt(makeTask("2026-06-01T00:00:00"), "WEEKLY", mondayStart), true);
});

test("resets monthly completion on the first day of the month", () => {
  const juneFirst = new Date("2026-06-01T00:00:00");

  assert.equal(isTaskCompletedThisPeriodAt(makeTask("2026-05-31T23:59:00"), "MONTHLY", juneFirst), false);
  assert.equal(isTaskCompletedThisPeriodAt(makeTask("2026-06-01T00:00:00"), "MONTHLY", juneFirst), true);
});

test("counts completed task xp with the shared period logic", () => {
  const now = new Date("2026-06-01T00:00:00");

  const xp = sumCompletedTaskXp(
    [
      makeTask("2026-05-31T23:59:00", 10),
      makeTask("2026-06-01T00:00:00", 15),
    ],
    "WEEKLY",
    now,
  );

  assert.equal(xp, 15);
});
