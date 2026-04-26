import {create} from "zustand";
import * as api from "@/shared/api/client";
import { loadAppData } from "@/shared/app/loadAppData";

import {
  CategoryOption,
  Challenge,
  ChallengeApi, ChallengeParticipant,
  FriendSummary,
  Goal, GoalActivity,
  Leader,
  PaymentMethod,
  Reminder,
  Report,
  Reward,
  User, AIChatResponse, ChatMessage
} from "@/types/";
import {ChallengeInput} from "@/components/CreateChallengeDialog.tsx";

import WebApp from '@twa-dev/sdk';
import Config from "@/services/Config.ts";

interface AppStore {
  initialized: boolean;
  loading: boolean;
  user: User | null;
  token: string | null,
  goals: Goal[];
  challenges: Challenge[];
  rewards: Reward[];
  reminders: Reminder[];
  friends: FriendSummary[];
  categories: CategoryOption[];
  reports: Record<string, Report[]>;

  initialize: () => Promise<void>;

  signup: (email: string, password: string, name?: string, referrerId?: string, referrerLinkId?: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (patch: Partial<User>) => Promise<void>;
  passwordReset: (email: string) => Promise<void>;
  login: (tgData: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;

  addChallenge: (challenge: ChallengeInput) => Promise<void>;
  updateChallenge: (challenge: ChallengeInput) => Promise<void>;
  getLeaderboard: (id: string) => Promise<Leader[]>;

  acceptChallenge: (challenge: Challenge) => Promise<void>;
  leaveChallenge: (id: string) => Promise<void>;
  payChallenge: (challenge: Challenge, method: PaymentMethod) => Promise<void>;
  redirectToTelegram: (link: string) => void;

  addCategory: (category: CategoryOption) => void;
  addGoal: (goal: Goal) => Promise<void>;
  deleteGoal: (goal: Goal) => Promise<void>;
  updateGoal: (goal: Goal) => Promise<void>;
  updateGoalProgress: (goalId: string, delta: number) => Promise<void>;
  getActivity: (goalId: string) => Promise<GoalActivity>;
  getGoalXp: (goalId: string) => Promise<number>;
  toggleTask: (taskId: string) => Promise<void>;
  addReport: (taskId: string, data: FormData) => Promise<void>;
  getReports: (challengeId: string) => Promise<Report[]>;
  getParticipants: (challengeId: string) => Promise<ChallengeParticipant[]>;
  kickParticipant: (challengeId: string, userId: string) => Promise<void>;
  sendMessageToParticipants: (challengeId: string, message: string) => Promise<void>;
  downloadReport: (report: Report) => Promise<void>;
  chatAI: (prompt: string) => Promise<AIChatResponse>;
  getChatHistory: () => Promise<ChatMessage[]>;
  addDraft: (messageId: string) => Promise<Goal>;

  addReward: (reward: Reward) => Promise<void>;
  deleteReward: (reward: Reward) => Promise<void>;
  updateReward: (reward: Reward) => Promise<void>;
  updateRewardGoal: (goalId: string, rewardId?: string) => Promise<void>;
  claimReward: (id: string) => Promise<void>;

  addReminder: (reminder: Reminder) => Promise<void>;
  deleteReminder: (reminder: Reminder) => Promise<void>;
  updateReminder: (reminder: Reminder) => Promise<void>;
  toggleReminder: (id: string) => Promise<void>;
}

export const useAppStore = create<AppStore>((set, get) => ({
  initialized: false,
  loading: false,
  user: null,
  token: null,
  goals: [] as Goal[],
  challenges: [] as Challenge[],
  rewards: [] as Reward[],
  reminders: [] as Reminder[],
  friends: [] as FriendSummary[],
  categories: [] as CategoryOption[],
  reports: {},

  // ==========================
  // AUTH
  // ==========================
  login: async (tgData: string) => {
    set({ loading: true });
    try {
      const token = '';
      const user = await api.login(tgData);
      set({ user, token });
      localStorage.setItem("token", token); // сохраняем для перезагрузки
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  signup: async (email, password, name, referrerId, referrerLinkId) => {
    console.log(email, password, name, referrerId, referrerLinkId);
  },

  signOut: async () => {

  },

  updateUser: async (patch: Partial<User>) => {
    const updated = await api.updateUser(patch);

    set({ user: updated });
  },

  passwordReset: async (email) => {
    console.log(email);
  },

  logout: () => {
    set({ user: null, token: null, goals: [], rewards: [], reminders: [] });
    localStorage.removeItem("token");
  },

  refreshUser: async () => {
    const token = get().token || localStorage.getItem("token");
    if (!token) return;

    set({ loading: true });
    try {
      const user = await api.fetchUser();
      set({ user });
    } catch (err) {
      console.error(err);
      get().logout();
    } finally {
      set({ loading: false });
    }
  },

  initialize: async () => {
    set({ loading: true });
    try {
      const user = await api.fetchUser();
      set({ user });

      if (user) {
        set(await loadAppData());
      }
    } catch (err) {
      console.error(err);
      set({ user: null });
    } finally {
      set({ initialized: true, loading: false });
    }
  },

  addChallenge: async (data: ChallengeInput) => {
    set({ loading: true });
    try {
      const challenge = await api.createChallenge(data);
      set({ challenges: [...get().challenges, challenge] });
    } catch (err) {
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  updateChallenge: async (data: ChallengeInput) => {
    set({ loading: true });
    try {
      const updated = await api.updateChallenge(data);

      function normalizeChallenge(c: ChallengeApi): Challenge {
        return {
          ...c,
          goals: c.goals.map((cg) => cg.goal),
        };
      }

      const normalized = normalizeChallenge(updated);

      set({
        challenges: get().challenges.map((c) =>
          c.id === normalized.id ? normalized : c
        ),
      });
    } catch (err) {
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  getLeaderboard: async (id: string) => {
    set({ loading: true });
    try {
      return await api.fetchLeaderboard(id);

    } catch (err) {
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  acceptChallenge: async (challenge: Challenge) => {
    set({ loading: true });
    try {
      await api.acceptChallenge(challenge.id);

      await get().initialize();

    } catch (err) {
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  leaveChallenge: async (id: string) => {
    set({ loading: true });
    try {
      await api.leaveChallenge(id);

      await get().initialize();

    } catch (err) {
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  payChallenge: async (challenge: Challenge, method: PaymentMethod) => {
    const redirectToTelegram = get().redirectToTelegram;

    set({ loading: true });
    try {

      const res = await api.payChallenge(challenge.id, method);

      redirectToTelegram(res.invoiceLink);

    } catch (err) {
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  redirectToTelegram(link) {
    WebApp.openInvoice(link, async (status) => {
      if (status === "paid") {
        set(await loadAppData());
      }
    });
  },

  // ==========================
  // GOALS
  // ==========================
  addGoal: async (goal: Goal) => {
    set({ loading: true });
    try {
      const newGoal = await api.createGoal(goal);
      set({ goals: [...get().goals, newGoal] });
    } catch (err) {
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  deleteGoal: async (goal: Goal) => {
    set({ loading: true });
    try {
      await api.deleteGoal(goal.id);

      set({
        goals: get().goals.filter((g) => g.id !== goal.id),
      });

    } catch (err) {
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  deleteReminder: async (reminder: Reminder) => {
    set({ loading: true });
    try {
      await api.deleteReminder(reminder.id);

      set({
        reminders: get().reminders.filter((r) => r.id !== reminder.id),
      });

    } catch (err) {
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  deleteReward: async (reward: Reward) => {
    set({ loading: true });
    try {
      await api.deleteReward(reward.id);

      set({
        rewards: get().rewards.filter((r) => r.id !== reward.id),
      });

    } catch (err) {
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  addCategory: (category: CategoryOption) => {
    set({ categories: [...get().categories, category] });
  },

  updateGoal: async (goal: Goal) => {
    set({ loading: true });
    try {
      const updatedGoal = await api.updateGoal(goal);
      set({
        goals: get().goals.map((g) => (g.id === updatedGoal.id ? updatedGoal : g)),
      });
    } catch (err) {
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  toggleTask: async (taskId: string) => {
    set({ loading: true });

    try {
      // сервер возвращает { goal, user }
      const { goal, user } = await api.toggleTask(taskId);

      set({
        goals: get().goals.map(g => g.id === goal.id ? goal : g),
        user: {
          ...get().user!,
          xp: user.xp,
          level: user.level,
          xpInCurrentLevel: user.xpInCurrentLevel,
          requiredXp: user.requiredXp,
        },
      });

      if (goal.challenges.length) {
        const challenges = await api.fetchChallenges();
        set({ challenges });
      }

      if (goal.reward) {
        const rewards = await api.fetchRewards();
        set({ rewards });
      }


    } catch (err) {
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  addReport: async (taskId: string, data: FormData) => {
    set({ loading: true });

    try {
      // сервер возвращает { goal, user }
      const { goal, user } = await api.addReport(taskId, data);

      set({
        goals: get().goals.map(g => g.id === goal.id ? goal : g),
        user: {
          ...get().user!,
          xp: user.xp,
          level: user.level,
          xpInCurrentLevel: user.xpInCurrentLevel,
          requiredXp: user.requiredXp,
        },
      });

    } catch (err) {
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  getReports: async (challengeId: string) => {
    set({ loading: true });
    try {
      return await api.getReports(challengeId);

    } catch (err) {
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },
  getParticipants: async (challengeId: string) => {
    set({ loading: true });
    try {
      return await api.getParticipants(challengeId);

    } catch (err) {
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },
  kickParticipant: async (challengeId: string, userId: string) => {
    set({ loading: true });
    try {
      return await api.kickParticipant(challengeId, userId);

    } catch (err) {
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },
  sendMessageToParticipants: async (challengeId: string, text: string) => {
    set({ loading: true });
    try {
      return await api.sendMessageToParticipants(challengeId, text);

    } catch (err) {
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  downloadReport: async (report: Report) => {
    try {
      const fileUrl = report.fileUrl.startsWith("http")
        ? report.fileUrl
        : `${Config.data.api.http.baseURL}${report.fileUrl}`;

      const res = await fetch(fileUrl, { credentials: "include" });
      const blob = await res.blob();

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${report.user.name} - ${report.taskCompletion.task.title}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed", err);
    }
  },

  chatAI: async (message: string) => {
    set({ loading: true });
    try {
      return await api.chatAI(message);

    } catch (err) {
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  getChatHistory: async () => {
    set({ loading: true });
    try {
      return await api.getChatHistory();

    } catch (err) {
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  addDraft: async (messageId: string) => {
    set({ loading: true });
    try {
      // Сервер возвращает созданный драфт со всеми зависимостями
      const draft = await api.addDraft(messageId);
      const { goal, reward, reminders } = draft;

      // --- Обновляем цели ---
      set((state) => ({
        goals: state.goals.some(g => g.id === goal.id)
          ? state.goals.map(g => (g.id === goal.id ? goal : g))
          : [...state.goals, goal],
      }));

      // --- Обновляем награду ---
      if (reward) {
        set((state) => ({
          rewards: state.rewards.some(r => r.id === reward.id)
            ? state.rewards.map(r => (r.id === reward.id ? reward : r))
            : [...state.rewards, reward],
        }));
      }

      // --- Обновляем напоминания ---
      if (reminders?.length) {
        set((state) => ({
          reminders: [...state.reminders.filter(r =>
            !reminders.find((dr: Reminder) => dr.id === r.id)), ...reminders],
        }));
      }

      return goal;
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  updateGoalProgress: async (goalId: string, delta: number) => {
    set({ loading: true });
    try {
      // сервер вернёт { goal, user }
      const { goal, user } = await api.updateGoalProgress(goalId, delta);

      set({
        goals: get().goals.map(g => g.id === goalId ? goal : g),
        user: {
          ...get().user!,
          xp: user.xp,
          level: user.level,
          xpInCurrentLevel: user.xpInCurrentLevel,
          requiredXp: user.requiredXp,
        },
      });
    } catch (err) {
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  getActivity: async (goalId: string) => {
    set({ loading: true });
    try {
      return await api.getActivity(goalId);

    } catch (err) {
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },
  getGoalXp: async (goalId: string) => {
    set({ loading: true });
    try {
      return await api.getGoalXp(goalId);

    } catch (err) {
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  // ==========================
  // REWARDS
  // ==========================
  addReward: async (reward: Reward) => {
    set({ loading: true });
    try {
      const newReward = await api.createReward(reward);
      set({ rewards: [...get().rewards, newReward] });
    } catch (err) {
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  updateReward: async (reward: Reward) => {
    set({ loading: true });
    try {
      const updatedReward = await api.updateReward(reward);
      set({
        rewards: get().rewards.map((r) => (r.id === updatedReward.id ? updatedReward : r)),
      });
    } catch (err) {
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  updateRewardGoal: async (goalId: string, rewardId?: string) =>
    set((state) => ({
      rewards: state.rewards.map((r) => {
        if (r.id === rewardId) {
          // новая/редактируемая награда
          return { ...r, goalId: goalId === "none" ? undefined : goalId };
        } else if (r.goalId === goalId) {
          // старая награда, которая была привязана к этой цели — отвязываем
          return { ...r, goalId: undefined };
        }
        return r;
      }),
    })),

  claimReward: async (id: string) => {
    set({ loading: true });
    try {
      const updatedReward = await api.claimReward(id);
      set({
        rewards: get().rewards.map((r) => (r.id === updatedReward.id ? updatedReward : r)),
      });
    } catch (err) {
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  // ==========================
  // REMINDERS
  // ==========================
  addReminder: async (reminder: Reminder) => {
    set({ loading: true });
    try {
      const newReminder = await api.createReminder(reminder);
      set({ reminders: [...get().reminders, newReminder] });
    } catch (err) {
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  updateReminder: async (reminder: Reminder) => {
    set({ loading: true });
    try {
      const updatedReminder = await api.updateReminder(reminder);
      set({
        reminders: get().reminders.map((r) => (r.id === updatedReminder.id ? updatedReminder : r)),
      });
    } catch (err) {
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  toggleReminder: async (id: string) => {
    set({ loading: true });
    try {
      const updatedReminder = await api.toggleReminder(id);
      set({
        reminders: get().reminders.map((r) => (r.id === updatedReminder.id ? updatedReminder : r)),
      });
    } catch (err) {
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },
}));
