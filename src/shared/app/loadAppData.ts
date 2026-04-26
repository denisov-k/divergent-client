import * as api from "@/shared/api/client";
import type {
  CategoryOption,
  Challenge,
  FriendSummary,
  Goal,
  Reminder,
  Reward,
} from "@/types";

export interface AppDataSnapshot {
  goals: Goal[];
  challenges: Challenge[];
  rewards: Reward[];
  reminders: Reminder[];
  friends: FriendSummary[];
  categories: CategoryOption[];
}

export async function loadAppData(): Promise<AppDataSnapshot> {
  const [goals, challenges, rewards, reminders, friends, categories] = await Promise.all([
    api.fetchGoals(),
    api.fetchChallenges(),
    api.fetchRewards(),
    api.fetchReminders(),
    api.fetchFriends(),
    api.fetchCategories(),
  ]);

  return {
    goals,
    challenges,
    rewards,
    reminders,
    friends,
    categories,
  };
}
