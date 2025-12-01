import { create } from "zustand";
import * as api from "@/utils/api";
import { type CategoryOption, Goal } from "@/components/GoalDialog";
import { Reward } from "@/components/RewardDialog";
import { Reminder } from "@/components/ReminderDialog";
import { FriendCardProps } from "@/components/FriendCard.tsx";

interface AppStore {
  initialized: boolean;
  loading: boolean;
  user: { id: string; name: string; xp: number; level: number; xpInCurrentLevel: number; requiredXp: number } | null;
  token: string | null,
  goals: Goal[];
  rewards: Reward[];
  reminders: Reminder[];
  friends: FriendCardProps[];
  categories: CategoryOption[];

  initialize: () => Promise<void>;

  login: (tgData: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;

  addXp: (amount: number) => Promise<void>;
  removeXp: (amount: number) => Promise<void>;

  addGoal: (goal: Goal) => Promise<void>;
  addCategory: (category: CategoryOption) => void;
  updateGoal: (goal: Goal) => Promise<void>;
  toggleTask: (goalId: string, taskId: string) => Promise<void>;

  addReward: (reward: Reward) => Promise<void>;
  updateReward: (reward: Reward) => Promise<void>;
  claimReward: (id: string) => Promise<void>;

  addReminder: (reminder: Reminder) => Promise<void>;
  updateReminder: (reminder: Reminder) => Promise<void>;
  toggleReminder: (id: string) => Promise<void>;
}


export const useAppStore = create<AppStore>((set, get) => ({
  initialized: false,
  loading: false,
  user: null,
  token: null,
  goals: [] as Goal[],
  rewards: [] as Reward[],
  reminders: [] as Reminder[],
  friends: [] as FriendCardProps[],
  categories: [] as CategoryOption[],

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
      // 1. Получаем пользователя
      const user = await api.fetchUser(); // с credentials: 'include'
      set({ user });

      // 2. Если есть пользователь, подтягиваем данные
      if (user) {
        const [goals, rewards, reminders, friends, categories] = await Promise.all([
          api.fetchGoals(),
          api.fetchRewards(),
          api.fetchReminders(),
          api.fetchFriends(),
          api.fetchCategories()
        ]);
        set({ goals, rewards, reminders, friends, categories, initialized: true });
      }
    } catch (err) {
      console.error(err);
      set({ user: null });
    } finally {
      set({ loading: false });
    }
  },

  // ==========================
  // XP SYSTEM
  // ==========================
  addXp: async (amount: number) => {
    set({ loading: true });
    try {
      const updatedUser = await api.addXp(amount);
      set({ user: updatedUser });
    } catch (err) {
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  removeXp: async (amount: number) => {
    set({ loading: true });
    try {
      const updatedUser = await api.removeXp(amount);
      set({ user: updatedUser });
    } catch (err) {
      console.error(err);
    } finally {
      set({ loading: false });
    }
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

  toggleTask: async (goalId: string, taskId: string) => {
    set({ loading: true });
    try {
      const { user, goal } = await api.toggleTask(goalId, taskId);
      set({
        user,
        goals: get().goals.map((g) => (g.id === goal.id ? goal : g)),
      });
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
