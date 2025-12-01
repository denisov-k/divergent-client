// Обёртка для fetch с JSON и проверкой ошибок
import {Goal} from "@/components/GoalDialog.tsx";
import {Reward} from "@/components/RewardDialog.tsx";
import {Reminder} from "@/components/ReminderDialog.tsx";

import Config from '@/services/Config';

async function fetchJSON(url: string, options: RequestInit = {}) {
  const res = await fetch(Config.data.api.http.baseURL + url, {
    ...options,
    credentials: 'include', // ✅ важно для cookie-based auth
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });

  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

// Авторизация
export async function login(tgData: string) {
  return fetchJSON("/api/auth/telegram", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tgData }),
  });
}

// ==========================
// USER
// ==========================
export async function fetchUser() {
  return fetchJSON("/api/user");
}

// ==========================
// GOALS
// ==========================
export async function createGoal(goal: Goal) {
  return fetchJSON("/api/goals", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(goal),
  });
}

export async function updateGoal(goal: Goal) {
  return fetchJSON(`/api/goals/${goal.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(goal),
  });
}

export async function deleteGoal(id: string) {
  return fetchJSON(`/api/goals/${id}`, { method: 'DELETE' });
}

export async function toggleTask(goalId: string, taskId: string) {
  return fetchJSON(`/api/goals/${goalId}/toggle-task`, {
    method: "PATCH",
    body: JSON.stringify({ taskId }),
  });
}

// ==========================
// REWARDS
// ==========================
export async function createReward(reward: Reward) {
  return fetchJSON("/api/rewards", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(reward),
  });
}

export async function updateReward(reward: Reward) {
  return fetchJSON(`/api/rewards/${reward.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(reward),
  });
}

export async function claimReward(id: string) {
  return fetchJSON(`/api/rewards/${id}/claim`, { method: "POST" });
}

// ==========================
// REMINDERS
// ==========================
export async function createReminder(reminder: Reminder) {
  return fetchJSON("/api/reminders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(reminder),
  });
}

export async function updateReminder(reminder: Reminder) {
  return fetchJSON(`/api/reminders/${reminder.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(reminder),
  });
}

export async function toggleReminder(id: string) {
  return fetchJSON(`/api/reminders/${id}/toggle`, { method: "PATCH" });
}

// ==========================
// LIST / FETCH ALL
// ==========================
export async function fetchGoals(): Promise<Goal[]> {
  return fetchJSON("/api/goals");
}

export async function fetchRewards(): Promise<Reward[]> {
  return fetchJSON("/api/rewards");
}

export async function fetchReminders(): Promise<Reminder[]> {
  return fetchJSON("/api/reminders");
}

// если есть сущность friends
export async function fetchFriends(): Promise<any[]> {
  return fetchJSON("/api/friends");
}

// категории
export async function fetchCategories(): Promise<{ value: string; label: string }[]> {
  return fetchJSON("/api/categories");
}
