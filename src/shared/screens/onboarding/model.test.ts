import assert from "node:assert/strict";
import test from "node:test";

import { buildOnboardingChecklist } from "./model.ts";

test("builds onboarding checklist from goals and AI history", () => {
  const checklist = buildOnboardingChecklist(
    [
      {
        id: "goal-1",
        title: "Goal",
        category: "work",
        tasks: [
          {
            id: "task-1",
            title: "Task",
            lastCompletedAt: "",
          },
        ],
        goalType: "TASK",
        goalPeriod: "DAILY",
      } as never,
    ],
    undefined,
    true,
  );

  assert.equal(checklist.completedCount, 3);
  assert.equal(checklist.totalCount, 3);
  assert.equal(checklist.nextStep, "completed_first_task");
  assert.equal(checklist.isComplete, false);
  assert.deepEqual(
    checklist.steps.map((step) => [step.key, step.completed]),
    [
      ["used_ai", true],
      ["created_first_goal", true],
      ["completed_first_task", false],
    ],
  );
});

test("marks checklist complete when all onboarding steps are done", () => {
  const checklist = buildOnboardingChecklist(
    [
      {
        id: "goal-1",
        title: "Goal",
        category: "work",
        tasks: [
          {
            id: "task-1",
            title: "Task",
            lastCompletedAt: "2026-06-08T10:00:00.000Z",
          },
        ],
        goalType: "TASK",
        goalPeriod: "DAILY",
      } as never,
    ],
    undefined,
    true,
  );

  assert.equal(checklist.isComplete, true);
  assert.equal(checklist.nextStep, null);
});

test("prefers persisted onboarding state over derived fallback", () => {
  const checklist = buildOnboardingChecklist(
    [],
    {
      created_first_goal: "2026-06-08T10:00:00.000Z",
      used_ai: "2026-06-08T10:01:00.000Z",
    },
    false,
  );

  assert.equal(checklist.completedCount, 2);
  assert.equal(checklist.nextStep, "completed_first_task");
  assert.deepEqual(
    checklist.steps.map((step) => [step.key, step.completed]),
    [
      ["used_ai", true],
      ["created_first_goal", true],
      ["completed_first_task", false],
    ],
  );
});
