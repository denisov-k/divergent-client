import Config from "@/services/Config";
import { readDownloadResponse } from "@/platform/download";
import { clearSessionToken, readSessionToken, writeSessionToken } from "@/platform/session";
import { createReportUploadBody } from "@/platform/upload";
import type {
  Challenge,
  ChallengeApi,
  ChallengeInput,
  FriendInput,
  FriendSummary,
  Goal,
  Reminder,
  ReportUploadPayload,
  Reward,
  User,
} from "@/types";

const API_TIMEOUT_MS = 15000;

function isPublicAuthRoute(url: string) {
  return (
    url === "/api/auth/login" ||
    url === "/api/auth/register" ||
    url === "/api/auth/password-reset/request" ||
    url === "/api/auth/password-reset/confirm"
  );
}

function normalizeFriend(friend: Partial<FriendSummary> & { id: string; name: string; level: number; currentXp: number }): FriendSummary {
  return {
    id: friend.id,
    name: friend.name,
    level: friend.level,
    avatarUrl: friend.avatarUrl,
    currentXp: friend.currentXp ?? 0,
    totalGoals: friend.totalGoals ?? 0,
    completedGoals: friend.completedGoals ?? 0,
    streak: friend.streak ?? 0,
    rank: friend.rank ?? undefined,
  };
}

async function fetchJSON(url: string, options: RequestInit = {}) {
  const isFormData = options.body instanceof FormData;
  const baseUrl = Config.data.api.http.baseURL;
  const publicAuthRoute = isPublicAuthRoute(url);
  const sessionToken = publicAuthRoute ? null : await readSessionToken();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  let res: Response;
  try {
    res = await fetch(baseUrl + url, {
      ...options,
      credentials: publicAuthRoute ? "omit" : "include",
      signal: controller.signal,
      headers: {
        ...(baseUrl.includes("ngrok-free.dev") ? { "ngrok-skip-browser-warning": "true" } : {}),
        ...(!isFormData ? { "Content-Type": "application/json" } : {}),
        ...(sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {}),
        ...(options.headers || {}),
      },
    });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(`Request timed out for ${url}`);
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }

  const nextSessionToken = res.headers.get("x-session-token");
  if (nextSessionToken) {
    await writeSessionToken(nextSessionToken);
  }

  const contentType = res.headers.get("content-type") || "";
  if (!res.ok) {
    if (res.status === 401) {
      await clearSessionToken();
    }

    if (contentType.includes("application/json")) {
      const data = (await res.json()) as { error?: string };
      throw new Error(data.error || `API error: ${res.status}`);
    }

    const text = await res.text();
    throw new Error(text || `API error: ${res.status}`);
  }

  if (!contentType.includes("application/json")) {
    const text = await res.text();
    throw new Error(`Expected JSON but received ${contentType || "unknown content type"}: ${text.slice(0, 120)}`);
  }

  return res.json();
}

export async function loginWithCredentials(email: string, password: string) {
  return fetchJSON("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function register(email: string, password: string, name?: string) {
  return fetchJSON("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password, name }),
  });
}

export async function loginWithTelegramIdToken(idToken: string) {
  return fetchJSON("/api/auth/telegram/native-login", {
    method: "POST",
    body: JSON.stringify({ idToken }),
  });
}

export async function logout() {
  const result = await fetchJSON("/api/auth/logout", {
    method: "POST",
  });
  await clearSessionToken();
  return result;
}

export async function requestPasswordReset(email: string): Promise<{ ok: true; resetUrl?: string }> {
  return fetchJSON("/api/auth/password-reset/request", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function confirmPasswordReset(token: string, password: string) {
  return fetchJSON("/api/auth/password-reset/confirm", {
    method: "POST",
    body: JSON.stringify({ token, password }),
  });
}

export async function fetchUser() {
  return fetchJSON("/api/user");
}

export async function updateUser(patch: Partial<User>) {
  return fetchJSON("/api/user", {
    method: "PATCH",
    body: JSON.stringify(patch),
  });
}

export async function setCredentials(password: string, email?: string, currentPassword?: string) {
  return fetchJSON("/api/user/credentials", {
    method: "POST",
    body: JSON.stringify({ email, password, currentPassword }),
  });
}

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

export async function addReport(taskId: string, data: ReportUploadPayload) {
  const res = await fetchJSON(`/api/tasks/${taskId}/report`, {
    method: "POST",
    body: createReportUploadBody(data),
  });

  return res as Promise<{ goal: Goal; user: User }>;
}

export async function getReports(challengeId: string) {
  return await fetchJSON(`/api/challenges/${challengeId}/reports`, {
    method: "GET",
  });
}

export async function getParticipants(challengeId: string) {
  return await fetchJSON(`/api/challenges/${challengeId}/participants`, {
    method: "GET",
  });
}

export async function getActivity(goalId: string) {
  return await fetchJSON(`/api/goals/${goalId}/activity`, {
    method: "GET",
  });
}

export async function getGoalXp(goalId: string) {
  return await fetchJSON(`/api/goals/${goalId}/xp`, {
    method: "GET",
  });
}

export async function kickParticipant(challengeId: string, userId: string) {
  return await fetchJSON(`/api/challenges/${challengeId}/participants/${userId}`, {
    method: "DELETE",
  });
}

export async function chatAI(message: string) {
  return await fetchJSON(`/api/ai/chat`, {
    method: "POST",
    body: JSON.stringify({ message }),
  });
}

export async function getChatHistory() {
  return await fetchJSON(`/api/ai/chat`, {
    method: "GET",
  });
}

export async function addDraft(messageId: string) {
  return await fetchJSON(`/api/ai/add_draft`, {
    method: "POST",
    body: JSON.stringify({ messageId }),
  });
}

export async function downloadReport(reportId: string): Promise<Blob> {
  const baseUrl = Config.data.api.http.baseURL;
  const sessionToken = await readSessionToken();
  const res = await fetch(baseUrl + `/api/reports/${reportId}/download`, {
    method: "GET",
    credentials: "include",
    headers: {
      ...(baseUrl.includes("ngrok-free.dev") ? { "ngrok-skip-browser-warning": "true" } : {}),
      ...(sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {}),
    },
  });

  if (!res.ok) {
    throw new Error(`Download error: ${res.status}`);
  }

  return await readDownloadResponse(res);
}

export async function updateGoalProgress(goalId: string, delta: number) {
  return fetchJSON(`/api/goals/${goalId}/progress`, {
    method: "POST",
    body: JSON.stringify({ delta }),
  });
}

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
    method: "GET",
  });
}

export async function leaveChallenge(id: string) {
  return fetchJSON(`/api/challenges/leave`, {
    method: "POST",
    body: JSON.stringify({ challengeId: id }),
  });
}

export async function payChallenge(id: string, method: string, returnUrl?: string) {
  return fetchJSON(`/api/payments/create`, {
    method: "POST",
    body: JSON.stringify({ challengeId: id, method, returnUrl }),
  });
}

export async function fetchPaymentStatus(paymentId: string) {
  return fetchJSON(`/api/payments/${paymentId}/status`, {
    method: "GET",
  });
}

export async function acceptChallenge(id: string) {
  return fetchJSON(`/api/challenges/accept`, {
    method: "POST",
    body: JSON.stringify({ id }),
  });
}

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

export async function fetchFriends(): Promise<FriendSummary[]> {
  const friends = (await fetchJSON("/api/friends")) as FriendSummary[];
  return friends.map((friend) => normalizeFriend(friend));
}

export async function createFriend(friend: FriendInput): Promise<FriendSummary> {
  const createdFriend = (await fetchJSON("/api/friends", {
    method: "POST",
    body: JSON.stringify(friend),
  })) as FriendSummary;

  return normalizeFriend(createdFriend);
}

export async function fetchCategories(): Promise<{ value: string; label: string }[]> {
  return fetchJSON("/api/categories");
}
