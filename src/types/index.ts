import type {CategoryType} from "@/components/GoalCard.tsx";

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
  completed: boolean;
  xpReward?: number;
  dueDate?: string;
  subtasks?: Task[];
  expanded?: boolean;
  parentId?: string | null;
}

export interface Goal {
  id: string;
  title: string;
  description?: string;
  category: CategoryType;
  categoryLabel: string;
  tasks: Task[]; // остаётся для обычных целей
  dueDate?: string;
  xpReward?: number;

  // новые поля для числовой цели
  currentValue?: number; // текущее значение прогресса
  targetValue?: number;  // целевое значение
  goalType: GoalType;      // "tasks" | "numeric"
  goalPeriod?: GoalPeriod; // "daily" | "weekly" | "monthly"
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

export interface Reminder {
  id: string;
  title: string;
  time: string;
  daysOfWeek: string[];
  daysOfMonth: number[];
  isActive: boolean;
  goalId?: string;
  taskId?: string;
}

export type RewardIcon = "trophy" | "star" | "gift" | "crown" | "award" | "zap";

export interface Reward {
  id: string;
  title: string;
  description: string;
  icon: RewardIcon;
  isUnlocked: boolean;
  goalId?: string;
}

export interface User {
  id: string;
  name: string;
  role: string;
  xp: number;
  level: number;
  xpInCurrentLevel: number;
  requiredXp: number;
  photoUrl: string
  language: string
  timeZone: string
}
