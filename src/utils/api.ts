import type { User, Goal, Reward, Reminder, Challenge } from "@/types/";
import Config from "@/services/Config";

async function fetchJSON(url: string, options: RequestInit = {}) {
  const res = await fetch(Config.data.api.http.baseURL + url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

// ==========================
// AUTH
// ==========================
export async function login(tgData: string) {
  return fetchJSON("/api/auth/telegram", {
    method: "POST",
    body: JSON.stringify({ tgData }),
  });
}

// ==========================
// USER
// ==========================
export async function fetchUser() {
  return fetchJSON("/api/user");
}

export async function updateUser(patch: Partial<User>) {
  return fetchJSON("/api/user", {
    method: "PATCH",
    body: JSON.stringify(patch),
  });
}

// ==========================
// GOALS
// ==========================
export async function fetchGoals(): Promise<Goal[]> {
  return fetchJSON("/api/goals");
}

export async function createGoal(goal: Goal) {
  return fetchJSON("/api/goals", {
    method: "POST",
    body: JSON.stringify(goal),
  });
}

export async function updateGoal(goal: Goal) {
  return fetchJSON(`/api/goals/${goal.id}`, {
    method: "PUT",
    body: JSON.stringify(goal),
  });
}

export async function deleteGoal(id: string) {
  return fetchJSON(`/api/goals/${id}`, { method: "DELETE" });
}

export async function toggleTask(goalId: string, taskId: string) {
  return fetchJSON(`/api/goals/${goalId}/toggle-task`, {
    method: "PATCH",
    body: JSON.stringify({ taskId }),
  });
}

export async function updateGoalProgress(goalId: string, delta: number) {
  return fetchJSON(`/api/goals/${goalId}/progress`, {
    method: "POST",
    body: JSON.stringify({ delta }),
  });
}

// ==========================
// CHALLENGES
// ==========================
export async function fetchChallenges(): Promise<Challenge[]> {
  return fetchJSON("/api/challenges");
}

export async function createChallenge(data: {
  title: string;
  description?: string;
  isPublic: boolean;
  startsAt?: string;
  endsAt?: string;
}): Promise<Challenge> {
  return fetchJSON("/api/challenges", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateChallenge(
  id: string,
  data: {
    title: string;
    description?: string;
    isPublic: boolean;
    startsAt?: string;
    endsAt?: string;
  }
): Promise<Challenge> {
  return fetchJSON(`/api/challenges/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function acceptChallenge(id: string) {
  return fetchJSON(`/api/challenges/accept`, {
    method: "POST",
    body: JSON.stringify({id}),
  });
}

// ==========================
// REWARDS
// ==========================
export async function fetchRewards(): Promise<Reward[]> {
  return fetchJSON("/api/rewards");
}

export async function createReward(reward: Reward) {
  return fetchJSON("/api/rewards", {
    method: "POST",
    body: JSON.stringify(reward),
  });
}

export async function updateReward(reward: Reward) {
  return fetchJSON(`/api/rewards/${reward.id}`, {
    method: "PATCH",
    body: JSON.stringify(reward),
  });
}

export async function claimReward(id: string) {
  return fetchJSON(`/api/rewards/${id}/claim`, { method: "POST" });
}

// ==========================
// REMINDERS
// ==========================
export async function fetchReminders(): Promise<Reminder[]> {
  return fetchJSON("/api/reminders");
}

export async function createReminder(reminder: Reminder) {
  return fetchJSON("/api/reminders", {
    method: "POST",
    body: JSON.stringify(reminder),
  });
}

export async function updateReminder(reminder: Reminder) {
  return fetchJSON(`/api/reminders/${reminder.id}`, {
    method: "PATCH",
    body: JSON.stringify(reminder),
  });
}

export async function toggleReminder(id: string) {
  return fetchJSON(`/api/reminders/${id}/toggle`, { method: "PATCH" });
}

// ==========================
// FRIENDS / CATEGORIES
// ==========================
export async function fetchFriends(): Promise<any[]> {
  return fetchJSON("/api/friends");
}

export async function fetchCategories(): Promise<
  { value: string; label: string }[]
> {
  return fetchJSON("/api/categories");
}
