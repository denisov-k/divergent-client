import { create } from "zustand";
import { Goal } from "@/components/GoalDialog";
import { Reward } from "@/components/RewardDialog";
import { Reminder } from "@/components/ReminderDialog";

// ==========================
// XP SYSTEM CONSTANTS
// ==========================
const XP_PER_LEVEL = 250;

function calculateLevel(xp: number) {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
}

function calculateXpInCurrentLevel(xp: number) {
  return xp % XP_PER_LEVEL;
}

function calculateRequiredXp(level: number) {
  return level * XP_PER_LEVEL;
}

// ==========================
// STORE INTERFACE
// ==========================
interface AppStore {
  loading: boolean;

  user: {
    id: string;
    name: string;
    xp: number;
    level: number;
    xpInCurrentLevel: number;
    requiredXp: number;
  };

  goals: Goal[];
  rewards: Reward[];
  reminders: Reminder[];
  friends: any[];

  // XP
  addXp: (amount: number) => void;
  removeXp: (amount: number) => void;

  // GOALS
  addGoal: (goal: Goal) => void;
  updateGoal: (goal: Goal) => void;
  toggleTask: (goalId: string, taskId: string) => void;

  // REWARDS
  addReward: (reward: Reward) => void;
  updateReward: (reward: Reward) => void;
  claimReward: (id: string) => void;

  // REMINDERS
  addReminder: (reminder: Reminder) => void;
  updateReminder: (reminder: Reminder) => void;
  toggleReminder: (id: string) => void;
}

// ==========================
// INITIAL MOCK DATA
// ==========================

const initialUser = {
  id: "u1",
  name: "Иван Петров",
  xp: 2450,
  level: calculateLevel(2450),
  xpInCurrentLevel: calculateXpInCurrentLevel(2450),
  requiredXp: calculateRequiredXp(calculateLevel(2450)),
};

const initialGoals: Goal[] = [
  {
    id: "1",
    title: "Прочитать 12 книг за год",
    description: "Развивать привычку ежедневного чтения",
    category: "learning",
    categoryLabel: "Обучение",
    dueDate: "2025-12-31",
    xpReward: 1200,
    tasks: [
      { id: "1-1", title: "Прочитать 'Война и мир'", completed: true, xpReward: 100 },
      { id: "1-2", title: "Прочитать 'Преступление и наказание'", completed: true, xpReward: 100 },
      { id: "1-3", title: "Прочитать 'Мастер и Маргарита'", completed: true, xpReward: 100 },
      { id: "1-4", title: "Прочитать 'Анна Каренина'", completed: true, xpReward: 100 },
      { id: "1-5", title: "Прочитать 'Идиот'", completed: true, xpReward: 100 },
      { id: "1-6", title: "Прочитать 'Братья Карамазовы'", completed: false, xpReward: 100 },
      { id: "1-7", title: "Прочитать 'Евгений Онегин'", completed: false, xpReward: 100 },
      { id: "1-8", title: "Прочитать 'Отцы и дети'", completed: false, xpReward: 100 },
      { id: "1-9", title: "Прочитать 'Тихий Дон'", completed: false, xpReward: 100 },
      { id: "1-10", title: "Прочитать 'Обломов'", completed: false, xpReward: 100 },
      { id: "1-11", title: "Прочитать 'Доктор Живаго'", completed: false, xpReward: 100 },
      { id: "1-12", title: "Прочитать 'Двенадцать стульев'", completed: false, xpReward: 100 }
    ]
  },
  {
    id: "2",
    title: "Пробежать 500 км",
    description: "Улучшить физическую форму и выносливость",
    category: "fitness",
    categoryLabel: "Фитнес",
    dueDate: "2025-06-30",
    xpReward: 2000,
    tasks: [
      { id: "2-1", title: "Пробежать 10 км", completed: true, xpReward: 40 },
      { id: "2-2", title: "Пробежать 20 км", completed: true, xpReward: 40 },
      { id: "2-3", title: "Пробежать 30 км", completed: true, xpReward: 40 },
      { id: "2-4", title: "Пробежать 40 км", completed: true, xpReward: 40 },
      { id: "2-5", title: "Пробежать 50 км", completed: false, xpReward: 40 }
    ]
  },
  {
    id: "3",
    title: "Выучить Python",
    category: "learning",
    categoryLabel: "Обучение",
    dueDate: "2025-03-01",
    xpReward: 1500,
    tasks: [
      { id: "3-1", title: "Основы синтаксиса", completed: true, xpReward: 75 },
      { id: "3-2", title: "Работа с функциями", completed: true, xpReward: 75 },
      { id: "3-3", title: "ООП в Python", completed: true, xpReward: 75 },
      { id: "3-4", title: "Работа с файлами", completed: true, xpReward: 75 },
      { id: "3-5", title: "Работа с базами данных", completed: true, xpReward: 75 },
      { id: "3-6", title: "Веб-разработка на Django", completed: false, xpReward: 75 },
      { id: "3-7", title: "Тестирование кода", completed: false, xpReward: 75 },
      { id: "3-8", title: "Деплой проекта", completed: false, xpReward: 75 }
    ]
  }
];

const initialRewards: Reward[] = [
  {
    id: "1",
    title: "Первые шаги",
    description: "Выполните первую задачу",
    requiredXp: 100,
    icon: "star",
    isUnlocked: true
  },
  {
    id: "2",
    title: "Бегун-марафонец",
    description: "Пробежите 100 км",
    requiredXp: 2500,
    icon: "trophy",
    isUnlocked: false
  },
  {
    id: "3",
    title: "Мастер привычек",
    description: "Выполните привычку 30 дней подряд",
    requiredXp: 3000,
    icon: "crown",
    isUnlocked: false
  },
  {
    id: "4",
    title: "Книжный червь",
    description: "Прочитайте 5 книг",
    requiredXp: 1500,
    icon: "gift",
    isUnlocked: true
  }
];

const initialReminders: Reminder[] = [
  {
    id: "1",
    title: "Утренняя зарядка",
    time: "07:00",
    days: ["Пн", "Ср", "Пт"],
    isActive: true,
    goalId: "2"
  },
  {
    id: "2",
    title: "Вечернее чтение",
    time: "21:00",
    days: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
    isActive: false,
    goalId: "1",
    taskId: "1-6"
  }
];

const initialFriends = [
  { id: "1", name: "Анна Смирнова", level: 15, currentXp: 3200, totalGoals: 12, completedGoals: 9, streak: 21, rank: 1 },
  { id: "2", name: "Дмитрий Козлов", level: 13, currentXp: 2800, totalGoals: 10, completedGoals: 7, streak: 14, rank: 2 },
  { id: "3", name: "Мария Попова", level: 12, currentXp: 2450, totalGoals: 8, completedGoals: 5, streak: 12, rank: 3 },
  { id: "4", name: "Алексей Волков", level: 11, currentXp: 2100, totalGoals: 9, completedGoals: 4, streak: 8 }
];

// ==========================
// ZUSTAND STORE
// ==========================
export const useAppStore = create<AppStore>((set, get) => ({
  loading: false,

  user: initialUser,
  goals: initialGoals,
  rewards: initialRewards,
  reminders: initialReminders,
  friends: initialFriends,

  // ==========================
  // XP SYSTEM
  // ==========================
  addXp(amount) {
    const user = get().user;
    const newXp = user.xp + amount;
    const level = calculateLevel(newXp);

    set({
      user: {
        ...user,
        xp: newXp,
        level,
        xpInCurrentLevel: calculateXpInCurrentLevel(newXp),
        requiredXp: calculateRequiredXp(level),
      },
    });
  },

  removeXp(amount) {
    const user = get().user;
    const newXp = Math.max(0, user.xp - amount);
    const level = calculateLevel(newXp);

    set({
      user: {
        ...user,
        xp: newXp,
        level,
        xpInCurrentLevel: calculateXpInCurrentLevel(newXp),
        requiredXp: calculateRequiredXp(level),
      },
    });
  },

  // ==========================
  // GOALS / TASKS
  // ==========================
  addGoal(goal) {
    set({
      goals: [...get().goals, goal],
    });
  },

  updateGoal(goal) {
    set({
      goals: get().goals.map((g) => (g.id === goal.id ? goal : g)),
    });
  },

  toggleTask(goalId, taskId) {
    const { goals, addXp, removeXp } = get();

    set({
      goals: goals.map((goal) => {
        if (goal.id !== goalId) return goal;

        const updatedTasks = goal.tasks.map((task) => {
          if (task.id !== taskId) return task;

          const completed = !task.completed;

          if (completed) addXp(task.xpReward || 0);
          else removeXp(task.xpReward || 0);

          return { ...task, completed };
        });

        // проверяем завершение цели
        const wasCompleted = goal.tasks.every((t) => t.completed);
        const nowCompleted = updatedTasks.every((t) => t.completed);

        if (!wasCompleted && nowCompleted) {
          addXp(goal.xpReward || 0);
        }

        return { ...goal, tasks: updatedTasks };
      }),
    });
  },

  // ==========================
  // REWARDS
  // ==========================
  addReward(reward) {
    set({
      rewards: [...get().rewards, reward],
    });
  },

  updateReward(reward) {
    set({
      rewards: get().rewards.map((r) =>
        r.id === reward.id ? reward : r
      ),
    });
  },

  claimReward(id) {
    set({
      rewards: get().rewards.map((r) =>
        r.id === id ? { ...r, isUnlocked: true } : r
      ),
    });
  },

  // ==========================
  // REMINDERS
  // ==========================
  addReminder(reminder) {
    set({
      reminders: [...get().reminders, reminder],
    });
  },

  updateReminder(reminder) {
    set({
      reminders: get().reminders.map((r) =>
        r.id === reminder.id ? reminder : r
      ),
    });
  },

  toggleReminder(id) {
    set({
      reminders: get().reminders.map((r) =>
        r.id === id ? { ...r, isActive: !r.isActive } : r
      ),
    });
  },
}));
