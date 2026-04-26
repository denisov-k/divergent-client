import type {
  CategoryType,
  RewardIconType as SharedRewardIconType,
} from "@/shared/domain";

export type { CategoryType } from "@/shared/domain";

export enum UserRole {
  User = 'user',
  Agent = 'agent',
  Admin = 'admin',
  SuperAgent = 'superagent',
}

export const DAYS_OF_WEEK = [
  { key: 'mon', label: 'Пн' },
  { key: 'tue', label: 'Вт' },
  { key: 'wed', label: 'Ср' },
  { key: 'thu', label: 'Чт' },
  { key: 'fri', label: 'Пт' },
  { key: 'sat', label: 'Сб' },
  { key: 'sun', label: 'Вс' },
] as const;

export const DAYS_OF_MONTH = Array.from({ length: 31 }, (_, i) => i + 1);

export interface Task {
  id: string;
  title: string;
  lastCompletedAt: string;
  xpReward?: number;
  dueDate?: string;
  subtasks?: Task[];
  expanded?: boolean;
  parentId?: string | null;
  completions?: TaskCompletion[];
}

export interface Goal {
  id: string;
  title: string;
  description?: string;
  category: CategoryType;
  tasks: Task[]; // остаётся для обычных целей
  dueDate?: string;
  lastCompletedAt?: string;
  xpReward?: number;

  // новые поля для числовой цели
  currentValue?: number; // текущее значение прогресса
  targetValue?: number;  // целевое значение
  goalType: GoalType;      // "tasks" | "numeric"
  goalPeriod: GoalPeriod; // "daily" | "weekly" | "monthly"
  challengeId?: string;
  challenge?: Challenge;
}

export interface Leader {
  xp: number;
  name: string;
  userId: string;
}

export interface ChallengeGoal {
  challengeId: string;
  goalId: string;
  challenge: Challenge;
  goal: Goal;
}

export interface Challenge {
  id: string;
  title: string;
  description?: string;
  goals: Goal[];
  goalIds: string[];
  leaderboard: Leader[];
  requiresReport: boolean;
  creatorId: string;
  rules?: string;
  link?: string;
  isPublic: boolean;
  startsAt?: string;
  endsAt?: string;
  price?: number;
  participants: ChallengeParticipant[];
  reports: Report[];
}

export interface ChallengeApi
  extends Omit<Challenge, "goals"> {
  goals: ChallengeGoal[];
}

export interface Report {
  id: string;
  challengeId: string;
  userId: string;
  challenge: Challenge;
  taskCompletion: TaskCompletion;
  user: User;
  fileType: string;
  fileUrl: string;
  comment?: string;
  createdAt: string;
}

export interface TaskCompletion {
  id: string;
  userId: string;
  user: User;
  taskId: string;
  task: Task;
  createdAt: string;
  report?: Report;
}

export interface ChallengeParticipant {
  id: string;
  challengeId: string;
  userId: string;
  challenge: Challenge;
  user: User;
}

export type GoalType = "TASK" | "PROGRESS";
export type GoalPeriod = "NONE" | "DAILY" | "WEEKLY" | "MONTHLY";

export interface GoalFormData extends Goal {
  rewardId?: string | null;
}

export interface CategoryOption {
  value: string;
  label: string;
}

export interface FriendSummary {
  id: string;
  name: string;
  level: number;
  avatarUrl?: string;
  currentXp: number;
  totalGoals: number;
  completedGoals: number;
  streak: number;
  rank?: number;
}

export interface Reminder {
  id: string;
  title: string;
  time: string;
  daysOfWeek: string[];
  daysOfMonth: number[];
  isActive: boolean;
  goalId?: string;
  taskId?: string;
  goal?: Goal;
  task?: Task;
}

export type RewardIcon = SharedRewardIconType;

export interface Reward {
  id: string;
  title: string;
  description: string;
  icon: RewardIcon;
  isUnlocked: boolean;
  goalId?: string;
  goal?: Goal;
  xpRequires?: number;
}

export interface User {
  id: string;
  name: string;
  email?: string | null;
  role: string;
  xp: number;
  level: number;
  xpInCurrentLevel: number;
  requiredXp: number;
  photoUrl: string
  language: string
  timeZone: string
}

export type PaymentMethod = "YOUKASSA";


export type GridItem = {
  periodStart: string;
  completed: number;
  total: number;
  status: "empty" | "partial" | "full";
  xp: number;
};

export type GoalActivity = {
  currentStreak: number;
  longestStreak: number;
  period: GoalPeriod;
  data: GridItem[];
}

export type Draft = {
  goal: {
    title: string
    description: string | null
    goalPeriod: "NONE" | "DAILY" | "WEEKLY" | "MONTHLY"
    category: string
    dueDate: string | null
  }
  tasks: Task[]
  reminders: {
    title: string
    time: string
    daysOfWeek: string[]
    daysOfMonth: number[]
  }[]
  reward: {
    title: string
    description?: string | null
    icon?: string | null
    xpRequires?: number | null
  }
}

export type ChatMessage = {
  role: "user" | "assistant"
  content: string
  goalDraft?: Draft | null
  id?: string;
  isDraftAdded: boolean;
}

export type AIChatResponse = {
  id: string
  message: string
  goalDraft: Draft | null
  isDraftAdded: boolean;
}

