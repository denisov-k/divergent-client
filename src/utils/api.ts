import type {Challenge, ChallengeApi, Goal, Reminder, Reward, User} from "@/types/";
import Config from "@/services/Config";
import {ChallengeInput} from "@/components/CreateChallengeDialog.tsx";

async function fetchJSON(url: string, options: RequestInit = {}) {
  const isFormData = options.body instanceof FormData;

  const res = await fetch(Config.data.api.http.baseURL + url, {
    ...options,
    credentials: "include",
    headers: {
      ...(!isFormData ? { "Content-Type": "application/json" } : {}),
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

export async function deleteReminder(id: string) {
  return fetchJSON(`/api/reminders/${id}`, { method: "DELETE" });
}

export async function deleteReward(id: string) {
  return fetchJSON(`/api/rewards/${id}`, { method: "DELETE" });
}

export async function toggleTask(taskId: string) {
  return fetchJSON(`/api/tasks/toggle`, {
    method: "POST",
    body: JSON.stringify({ taskId }),
  });
}

export async function addReport(taskId: string, data: FormData) {
  const res = await fetchJSON(`/api/tasks/${taskId}/report`, {
    method: "POST",
    body: data, // FormData напрямую
  });

  return res as Promise<{ goal: Goal; user: User }>;
}

export async function getReports(challengeId: string) {
  return await fetchJSON(`/api/challenges/${challengeId}/reports`, {
    method: "GET",
  });
}

export async function downloadReport(reportId: string): Promise<Blob> {
  const res = await fetch(
    Config.data.api.http.baseURL + `/api/reports/${reportId}/download`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  if (!res.ok) {
    throw new Error(`Download error: ${res.status}`);
  }

  return await res.blob();
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

export async function createChallenge(data: ChallengeInput): Promise<Challenge> {
  return fetchJSON("/api/challenges", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateChallenge(data: ChallengeInput): Promise<ChallengeApi> {
  return fetchJSON(`/api/challenges/${data.id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function fetchLeaderboard(id: string) {
  return fetchJSON(`/api/challenges/${id}/leaderboard`, {
    method: "GET"
  });
}

export async function leaveChallenge(id: string) {
  return fetchJSON(`/api/challenges/leave`, {
    method: "POST",
    body: JSON.stringify({challengeId: id}),
  });
}

export async function payChallenge(id: string, method: string) {
  return fetchJSON(`/api/payments/create`, {
    method: "POST",
    body: JSON.stringify({challengeId: id, method}),
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
