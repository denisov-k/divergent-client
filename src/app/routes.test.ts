import test from "node:test";
import assert from "node:assert/strict";

import {
  buildChallengesPath,
  buildGoalsPath,
  buildProgressPath,
  buildRemindersPath,
  buildRewardsPath,
  buildSettingsPath,
} from "./routes.ts";

test("builds goals path with focus id", () => {
  assert.equal(buildGoalsPath({ id: "goal-1" }), "/goals?id=goal-1");
  assert.equal(buildGoalsPath(), "/goals");
});

test("builds reminders path with both reminder and goal ids", () => {
  assert.equal(
    buildRemindersPath({ id: "reminder-1", goalId: "goal-1" }),
    "/reminders?id=reminder-1&goalId=goal-1",
  );
});

test("builds challenge, reward, progress and settings routes", () => {
  assert.equal(
    buildChallengesPath({ id: "challenge-1", paymentId: "payment-1" }),
    "/challenges?id=challenge-1&paymentId=payment-1",
  );
  assert.equal(buildRewardsPath({ id: "reward-1" }), "/rewards?id=reward-1");
  assert.equal(buildProgressPath({ goalId: "goal-1" }), "/progress?goalId=goal-1");
  assert.equal(buildSettingsPath(), "/settings");
});
