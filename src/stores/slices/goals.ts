import * as api from "@/shared/api/client";
import type { AppStoreActions, StoreSlice } from "@/stores/types";

type GoalsSlice = Pick<
  AppStoreActions,
  | "addCategory"
  | "addGoal"
  | "deleteGoal"
  | "updateGoal"
  | "updateGoalProgress"
  | "getActivity"
  | "getGoalXp"
  | "toggleTask"
  | "addReport"
>;

export const createGoalsSlice: StoreSlice<GoalsSlice> = (set, get) => ({
  addCategory: (category) => {
    set({ categories: [...get().categories, category] });
  },

  addGoal: async (goal) => {
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

  deleteGoal: async (goal) => {
    set({ loading: true });
    try {
      await api.deleteGoal(goal.id);
      set({
        goals: get().goals.filter((item) => item.id !== goal.id),
      });
    } catch (err) {
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  updateGoal: async (goal) => {
    set({ loading: true });
    try {
      const updatedGoal = await api.updateGoal(goal);
      set({
        goals: get().goals.map((item) =>
          item.id === updatedGoal.id ? updatedGoal : item
        ),
      });
    } catch (err) {
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  updateGoalProgress: async (goalId, delta) => {
    set({ loading: true });
    try {
      const { goal, user } = await api.updateGoalProgress(goalId, delta);

      set({
        goals: get().goals.map((item) => (item.id === goalId ? goal : item)),
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

  getActivity: async (goalId) => {
    set({ loading: true });
    try {
      return await api.getActivity(goalId);
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  getGoalXp: async (goalId) => {
    set({ loading: true });
    try {
      return await api.getGoalXp(goalId);
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  toggleTask: async (taskId) => {
    set({ loading: true });
    try {
      const { goal, user } = await api.toggleTask(taskId);

      set({
        goals: get().goals.map((item) => (item.id === goal.id ? goal : item)),
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

  addReport: async (taskId, data) => {
    set({ loading: true });
    try {
      const { goal, user } = await api.addReport(taskId, data);

      set({
        goals: get().goals.map((item) => (item.id === goal.id ? goal : item)),
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
});
