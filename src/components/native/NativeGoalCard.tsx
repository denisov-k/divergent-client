import { useMemo, useState } from "react";
import { Linking, Pressable, Text, TextInput, View } from "react-native";
import { useTranslation } from "react-i18next";

import { buildChallengesPath, buildRewardsPath } from "@/app/routes";
import { ProgressRing } from "@/components/ProgressRing";
import { ActionChip } from "@/components/native/ActionChip";
import {
  AlarmClock,
  BarChart2,
  Briefcase,
  Calendar,
  ChevronDown,
  ChevronUp,
  Dumbbell,
  Edit,
  Gift,
  GraduationCap,
  Heart,
  Home,
  Palette,
  Rocket,
  Swords,
  Target,
} from "@/components/native/icons";
import { SurfaceCard } from "@/components/native/SurfaceCard";
import { buildNativeRouteUrl } from "@/platform/appUrl.native";
import { isTaskCompletedThisPeriod } from "@/shared/screens/goals/model";
import type { CategoryType } from "@/shared/domain";
import type { Goal, GoalPeriod, Reward, Task } from "@/types";

const categoryConfig: Record<
  CategoryType,
  {
    backgroundColor: string;
    textColor: string;
    borderColor: string;
    icon: React.ComponentType<{ size?: string | number; color?: string }>;
  }
> = {
  work: { backgroundColor: "#dbeafe", textColor: "#1d4ed8", borderColor: "#bfdbfe", icon: Briefcase },
  health: { backgroundColor: "#fee2e2", textColor: "#b91c1c", borderColor: "#fecaca", icon: Heart },
  learning: { backgroundColor: "#f3e8ff", textColor: "#7e22ce", borderColor: "#e9d5ff", icon: GraduationCap },
  fitness: { backgroundColor: "#dcfce7", textColor: "#15803d", borderColor: "#bbf7d0", icon: Dumbbell },
  creative: { backgroundColor: "#fce7f3", textColor: "#be185d", borderColor: "#fbcfe8", icon: Palette },
  personal: { backgroundColor: "#ffedd5", textColor: "#c2410c", borderColor: "#fed7aa", icon: Home },
  custom: { backgroundColor: "#fef3c7", textColor: "#a16207", borderColor: "#fde68a", icon: Rocket },
};

function countTasks(tasks?: Task[]): number {
  if (!tasks || tasks.length === 0) {
    return 0;
  }

  return tasks.reduce((sum, task) => sum + 1 + countTasks(task.subtasks), 0);
}

function countCompleted(tasks: Task[] | undefined, goalPeriod: GoalPeriod): number {
  if (!tasks || tasks.length === 0) {
    return 0;
  }

  return tasks.reduce(
    (sum, task) => sum + (isTaskCompletedThisPeriod(task, goalPeriod) ? 1 : 0) + countCompleted(task.subtasks, goalPeriod),
    0
  );
}

function periodLabel(goalPeriod: GoalPeriod) {
  if (goalPeriod === "DAILY") {
    return "Ежедневная";
  }

  if (goalPeriod === "WEEKLY") {
    return "Еженедельная";
  }

  if (goalPeriod === "MONTHLY") {
    return "Ежемесячная";
  }

  return null;
}

function hasChallengeStartedForUser(challengeStart: Date, userTimeZone: string) {
  const now = new Date();

  const nowInUserTZ = new Date(
    new Intl.DateTimeFormat("en-US", {
      timeZone: userTimeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(now)
  );

  const startInUserTZ = new Date(
    new Intl.DateTimeFormat("en-US", {
      timeZone: userTimeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(challengeStart)
  );

  return startInUserTZ <= nowInUserTZ;
}

function getGoalStatus(goal: Goal) {
  const now = new Date();
  const due = goal.dueDate ? new Date(goal.dueDate) : null;
  if (due) {
    due.setDate(due.getDate() + 1);
  }
  const completedAt = goal.lastCompletedAt ? new Date(goal.lastCompletedAt) : null;
  const isExpired = due ? now > due : false;

  if (completedAt) {
    if (due && completedAt > due) {
      return "FAILED" as const;
    }

    return "COMPLETED" as const;
  }

  if (isExpired) {
    return "FAILED" as const;
  }

  return "ACTIVE" as const;
}

function SmallPill({
  children,
  tone = "neutral",
  icon,
  onPress,
}: {
  children: string;
  tone?: "neutral" | "success" | "warning" | "danger";
  icon?: React.ReactNode;
  onPress?: () => void;
}) {
  const palette = {
    neutral: { backgroundColor: "#f1f5f9", color: "#475569" },
    success: { backgroundColor: "#22c55e", color: "#ffffff" },
    warning: { backgroundColor: "#f97316", color: "#ffffff" },
    danger: { backgroundColor: "#ef4444", color: "#ffffff" },
  }[tone];

  const content = (
    <View
      style={{
        alignSelf: "flex-start",
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 2,
        backgroundColor: palette.backgroundColor,
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
      }}
    >
      {icon ? (
        <View style={{ width: 12, height: 12, flexShrink: 0, alignItems: "center", justifyContent: "center" }}>{icon}</View>
      ) : null}
      <Text
        style={{
          color: palette.color,
          fontWeight: "500",
          fontSize: 12,
          lineHeight: 18,
          fontFamily: "Montserrat",
          flexShrink: 1,
        }}
      >
        {children}
      </Text>
    </View>
  );

  if (!onPress) {
    return content;
  }

  return (
    <Pressable onPress={onPress} hitSlop={6}>
      {content}
    </Pressable>
  );
}

function SmallAction({ icon, onPress }: { icon: React.ReactNode; onPress?: () => void }) {
  if (!onPress) {
    return null;
  }

  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      style={{
        width: 36,
        height: 36,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "transparent",
      }}
    >
      {icon}
    </Pressable>
  );
}

function TaskTree({
  tasks,
  goalPeriod,
  onTaskToggle,
  goalId,
  level = 0,
  disabled = false,
}: {
  tasks: Task[];
  goalPeriod: GoalPeriod;
  onTaskToggle: (goalId: string, taskId: string) => Promise<void>;
  goalId: string;
  level?: number;
  disabled?: boolean;
}) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  return (
    <View style={{ gap: 8 }}>
      {tasks.map((task) => {
        const completed = isTaskCompletedThisPeriod(task, goalPeriod);
        const hasSubtasks = Boolean(task.subtasks?.length);
        const isOpen = Boolean(expanded[task.id]);

        return (
          <View key={task.id} style={{ gap: 8, marginLeft: level * 12 }}>
            <View
              style={{
                borderWidth: 1,
                borderColor: "#e2e8f0",
                borderRadius: 14,
                backgroundColor: "#f8fafc",
                paddingHorizontal: 12,
                paddingVertical: 10,
                gap: 8,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                {hasSubtasks || level > 0 ? (
                  <Pressable onPress={() => setExpanded((current) => ({ ...current, [task.id]: !current[task.id] }))}>
                    {isOpen ? <ChevronUp size={16} color="#64748b" /> : <ChevronDown size={16} color="#64748b" />}
                  </Pressable>
                ) : (
                  <View style={{ width: 16 }} />
                )}

                <Pressable
                  onPress={() => {
                    if (!disabled) {
                      void onTaskToggle(goalId, task.id);
                    }
                  }}
                  style={{ flexDirection: "row", alignItems: "center", gap: 10, flex: 1 }}
                >
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 6,
                      borderWidth: 1.5,
                      borderColor: completed ? "#2563eb" : "#94a3b8",
                      backgroundColor: completed ? "#2563eb" : "#ffffff",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {completed && <Text style={{ color: "#ffffff", fontSize: 12, fontWeight: "500", fontFamily: "Montserrat", lineHeight: 18 }}>✓</Text>}
                  </View>

                  <View style={{ flex: 1, gap: 2 }}>
                    <Text style={{ color: completed ? "#64748b" : "#0f172a", textDecorationLine: completed ? "line-through" : "none", fontSize: 12, fontWeight: "400", lineHeight: 18, fontFamily: "Montserrat" }}>
                      {task.title}
                    </Text>
                    {!!task.dueDate && (
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                        <Calendar size={12} color="#94a3b8" />
                        <Text style={{ color: "#94a3b8", fontSize: 12, fontWeight: "400", lineHeight: 18, fontFamily: "Montserrat" }}>{task.dueDate}</Text>
                      </View>
                    )}
                  </View>
                </Pressable>

                {typeof task.xpReward === "number" && task.xpReward > 0 && (
                  <View
                    style={{
                      backgroundColor: "#e2e8f0",
                      borderRadius: 8,
                      paddingHorizontal: 8,
                      paddingVertical: 2,
                    }}
                  >
                    <Text style={{ color: "#334155", fontWeight: "500", fontSize: 12, lineHeight: 18, fontFamily: "Montserrat" }}>+{task.xpReward} XP</Text>
                  </View>
                )}
              </View>
            </View>

            {hasSubtasks && isOpen && (
              <TaskTree
                tasks={task.subtasks ?? []}
                goalPeriod={goalPeriod}
                onTaskToggle={onTaskToggle}
                goalId={goalId}
                level={level + 1}
                disabled={disabled}
              />
            )}
          </View>
        );
      })}
    </View>
  );
}

export function NativeGoalCard({
  goal,
  categoryLabel,
  reward,
  userTimeZone,
  autoExpand = false,
  onEdit,
  onTaskToggle,
  onAddReminder,
  onAddProgress,
  onGoToProgress,
}: {
  goal: Goal;
  categoryLabel: string;
  reward?: Reward | null;
  userTimeZone: string;
  autoExpand?: boolean;
  onEdit?: (id: string) => void;
  onTaskToggle: (goalId: string, taskId: string) => Promise<void>;
  onAddReminder?: (id: string) => void;
  onAddProgress?: (goalId: string, delta: number) => void;
  onGoToProgress?: (id: string) => void;
}) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(autoExpand);
  const [progressDelta, setProgressDelta] = useState("");

  const categoryPalette = categoryConfig[(goal.category as CategoryType) || "custom"] ?? categoryConfig.custom;
  const CategoryIcon = categoryPalette.icon;
  const safeTasks = goal.tasks ?? [];
  const totalTasks = countTasks(safeTasks);
  const completedTasks = countCompleted(safeTasks, goal.goalPeriod);
  const isNumeric = goal.goalType === "PROGRESS";
  const progress = isNumeric
    ? goal.targetValue && goal.targetValue > 0
      ? Math.min(((goal.currentValue ?? 0) / goal.targetValue) * 100, 100)
      : 0
    : totalTasks > 0
      ? (completedTasks / totalTasks) * 100
      : 0;

  const status = getGoalStatus(goal);
  const statusLabel = status === "COMPLETED" ? "Выполнена" : status === "FAILED" ? "Не выполнена" : null;
  const challengeStarted = goal.challenge?.startsAt
    ? hasChallengeStartedForUser(new Date(goal.challenge.startsAt), userTimeZone)
    : true;

  const disabledTasks = Boolean(goal.challenge && !challengeStarted);
  const cycleLabel = useMemo(() => periodLabel(goal.goalPeriod), [goal.goalPeriod]);

  return (
    <SurfaceCard gap={16} padding={24} radius={12}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 16 }}>
        <View style={{ flex: 1, gap: 8 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Target size={20} color="#2563eb" />
            <Text style={{ fontSize: 12, fontWeight: "500", color: "#0f172a", flex: 1, fontFamily: "Montserrat", lineHeight: 12 }}>{goal.title}</Text>
          </View>

          <View
            style={{
              alignSelf: "flex-start",
              paddingHorizontal: 8,
              paddingVertical: 2,
              borderRadius: 8,
              borderWidth: 1,
              backgroundColor: categoryPalette.backgroundColor,
              borderColor: categoryPalette.borderColor,
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
            }}
          >
            <CategoryIcon size={12} color={categoryPalette.textColor} />
            <Text style={{ color: categoryPalette.textColor, fontWeight: "500", fontSize: 12, lineHeight: 18, fontFamily: "Montserrat", flexShrink: 1 }}>{categoryLabel}</Text>
          </View>

          {!!goal.description && <Text style={{ color: "#64748b", fontSize: 12, fontWeight: "400", lineHeight: 18, fontFamily: "Montserrat" }}>{goal.description}</Text>}

          {!!statusLabel && <SmallPill tone={status === "COMPLETED" ? "success" : "danger"}>{statusLabel}</SmallPill>}
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <ProgressRing progress={progress} size={70} strokeWidth={6} />
          <View>
            {!goal.challenge && !!onEdit && <SmallAction icon={<Edit size={14} color="#64748b" />} onPress={() => onEdit(goal.id)} />}
            {!!onAddReminder && <SmallAction icon={<AlarmClock size={14} color="#64748b" />} onPress={() => onAddReminder(goal.id)} />}
            {!!onGoToProgress && <SmallAction icon={<BarChart2 size={14} color="#64748b" />} onPress={() => onGoToProgress(goal.id)} />}
          </View>
        </View>
      </View>

      <View style={{ gap: 8 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ color: "#64748b", fontSize: 12, fontWeight: "400", lineHeight: 18, fontFamily: "Montserrat" }}>{t("goals.progress")}</Text>
          {goal.goalType === "TASK" ? (
            <Text style={{ color: "#64748b", fontSize: 12, fontWeight: "400", lineHeight: 18, fontFamily: "Montserrat" }}>
              {completedTasks} / {totalTasks} {t("goals.tasks_count")}
            </Text>
          ) : (
            <Text style={{ color: "#64748b", fontSize: 12, fontWeight: "400", lineHeight: 18, fontFamily: "Montserrat" }}>
              {goal.currentValue ?? 0} / {goal.targetValue ?? 0}
            </Text>
          )}
        </View>
        <View style={{ height: 8, backgroundColor: "#e2e8f0", borderRadius: 999, overflow: "hidden" }}>
          <View style={{ width: `${progress}%`, height: "100%", backgroundColor: "#2563eb" }} />
        </View>
      </View>

      {goal.goalType === "PROGRESS" && (
        <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
          <TextInput
            value={progressDelta}
            onChangeText={setProgressDelta}
            placeholder="Добавить значение"
            keyboardType="numeric"
            style={{
              flex: 1,
              borderWidth: 1,
              borderColor: "#cbd5e1",
              borderRadius: 8,
              paddingHorizontal: 8,
              paddingVertical: 6,
              backgroundColor: "#ffffff",
              color: "#0f172a",
              fontFamily: "Montserrat",
              fontSize: 10,
              lineHeight: 15,
            }}
            placeholderTextColor="#94a3b8"
          />
          <ActionChip
            onPress={() => {
              const value = Number(progressDelta);
              if (!Number.isNaN(value) && value !== 0) {
                onAddProgress?.(goal.id, value);
                setProgressDelta("");
              }
            }}
            tone="primary"
          >
            +
          </ActionChip>
        </View>
      )}

      {goal.goalType === "TASK" && (
        <View style={{ gap: 10 }}>
          <Pressable onPress={() => setIsOpen((current) => !current)} style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Text style={{ color: "#0f172a", fontSize: 12, fontWeight: "500", lineHeight: 18, fontFamily: "Montserrat" }}>{t("goals.tasks")}</Text>
            {isOpen ? <ChevronUp size={18} color="#64748b" /> : <ChevronDown size={18} color="#64748b" />}
          </Pressable>

          {isOpen && (
            <TaskTree
              tasks={safeTasks}
              goalPeriod={goal.goalPeriod}
              onTaskToggle={onTaskToggle}
              goalId={goal.id}
              disabled={disabledTasks}
            />
          )}
        </View>
      )}

      <View style={{ borderTopWidth: 1, borderTopColor: "#e2e8f0", paddingTop: 8, flexDirection: "row", justifyContent: "space-between", gap: 12 }}>
        <View style={{ flex: 1, gap: 8 }}>
          {!!cycleLabel && <SmallPill>{cycleLabel}</SmallPill>}
          {!!goal.challenge && (
            <SmallPill
              tone="warning"
              icon={<Swords size={12} color="#ffffff" />}
              onPress={() => {
                void Linking.openURL(buildNativeRouteUrl(buildChallengesPath({ id: goal.challenge?.id })));
              }}
            >
              {goal.challenge.title}
            </SmallPill>
          )}
          {!!goal.dueDate && (
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <Calendar size={14} color="#94a3b8" />
              <Text style={{ color: "#64748b", fontSize: 12, fontWeight: "400", lineHeight: 18, fontFamily: "Montserrat" }}>{new Date(goal.dueDate).toISOString().split("T")[0]}</Text>
            </View>
          )}
        </View>

        {!!reward && (
          <View style={{ maxWidth: "50%", alignItems: "flex-end" }}>
            <SmallPill
              tone="success"
              icon={<Gift size={12} color="#ffffff" />}
              onPress={() => {
                if (!reward.id) {
                  return;
                }

                void Linking.openURL(buildNativeRouteUrl(buildRewardsPath({ id: reward.id })));
              }}
            >
              {reward.title}
            </SmallPill>
          </View>
        )}
      </View>
    </SurfaceCard>
  );
}




