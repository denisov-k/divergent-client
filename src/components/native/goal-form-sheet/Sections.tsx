import { Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { ActionChip } from "@/components/native/ActionChip";
import { FieldInput } from "@/components/native/FieldInput";
import { SectionTabs } from "@/components/native/SectionTabs";
import { formHelperStyle, formSectionLabelStyle } from "@/components/native/form-sheet/Layout";
import { appPalette } from "@/theme/palette";
import type { CategoryOption, GoalPeriod, GoalType, Reward, Task } from "@/types";

export function GoalTypeSection(props: { goalType: GoalType; onChange: (value: GoalType) => void }) {
  const { t } = useTranslation();

  return (
    <View style={{ gap: 8 }}>
      <Text style={formSectionLabelStyle}>{t("goals.dialog.goal_type_label")}</Text>
      <SectionTabs
        tabs={[{ key: "TASK", label: t("goals.dialog.goal_type_tasks") }, { key: "PROGRESS", label: t("goals.dialog.goal_type_progress") }]}
        activeTab={props.goalType}
        onChange={(value) => props.onChange(value as GoalType)}
      />
    </View>
  );
}

export function GoalPeriodSection(props: { goalPeriod: GoalPeriod; onChange: (value: GoalPeriod) => void }) {
  const { t } = useTranslation();

  return (
    <View style={{ gap: 8 }}>
      <Text style={formSectionLabelStyle}>{t("goals.dialog.period_label")}</Text>
      <SectionTabs
        tabs={[
          { key: "NONE", label: t("goals.dialog.period_none") },
          { key: "DAILY", label: t("goals.dialog.period_day") },
          { key: "WEEKLY", label: t("goals.dialog.period_week") },
          { key: "MONTHLY", label: t("goals.dialog.period_month") },
        ]}
        activeTab={props.goalPeriod}
        onChange={(value) => props.onChange(value as GoalPeriod)}
      />
    </View>
  );
}

export function CategorySection(props: {
  categories: CategoryOption[];
  category: string;
  onChange: (value: string) => void;
}) {
  const { t } = useTranslation();

  return (
    <View style={{ gap: 8 }}>
      <Text style={formSectionLabelStyle}>{t("goals.dialog.category_label")}</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        {props.categories.map((item) => (
          <ActionChip key={item.value} onPress={() => props.onChange(item.value)} tone={props.category === item.value ? "primary" : "secondary"}>
            {item.label}
          </ActionChip>
        ))}
      </View>
    </View>
  );
}

export function RewardSection(props: {
  rewards: Reward[];
  activeRewardId: string | null;
  onChange: (value: string | null) => void;
}) {
  const { t } = useTranslation();

  return (
    <View style={{ gap: 8 }}>
      <Text style={formSectionLabelStyle}>{t("goals.dialog.reward_label")}</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        <ActionChip onPress={() => props.onChange(null)} tone={props.activeRewardId ? "secondary" : "primary"}>
          {t("common.no_reward")}
        </ActionChip>
        {props.rewards.map((reward) => (
          <ActionChip key={reward.id} onPress={() => props.onChange(reward.id)} tone={props.activeRewardId === reward.id ? "primary" : "secondary"}>
            {reward.title}
          </ActionChip>
        ))}
      </View>
    </View>
  );
}

export function ProgressFieldsSection(props: {
  currentValue: string;
  targetValue: string;
  onChangeCurrentValue: (value: string) => void;
  onChangeTargetValue: (value: string) => void;
}) {
  const { t } = useTranslation();

  return (
    <View style={{ gap: 12 }}>
      <FieldInput label={t("goals.dialog.current_progress")} value={props.currentValue} onChangeText={props.onChangeCurrentValue} placeholder="0" />
      <FieldInput label={t("goals.dialog.target_value")} value={props.targetValue} onChangeText={props.onChangeTargetValue} placeholder="100" />
    </View>
  );
}

export function TasksSection(props: {
  tasks: Task[];
  newTaskTitle: string;
  onChangeNewTaskTitle: (value: string) => void;
  onAddTask: () => void;
  onRemoveTask: (taskId: string) => void;
}) {
  const { t } = useTranslation();

  return (
    <View style={{ gap: 12 }}>
      <Text style={formSectionLabelStyle}>{t("goals.dialog.tasks_label")}</Text>

      {props.tasks.length === 0 ? (
        <Text style={formHelperStyle}>{t("goals.dialog.empty_tasks")}</Text>
      ) : (
        props.tasks.map((task) => (
          <View
            key={task.id}
            style={{
              borderWidth: 1,
              borderColor: appPalette.semantic.borderSubtle,
              borderRadius: 14,
              padding: 12,
              gap: 8,
              backgroundColor: appPalette.semantic.neutralSurfaceStrong,
            }}
          >
            <Text style={{ color: appPalette.semantic.textStrong, fontWeight: "600", fontFamily: "Montserrat" }}>{task.title}</Text>
            <ActionChip onPress={() => props.onRemoveTask(task.id)} tone="danger">
              {t("common.delete")}
            </ActionChip>
          </View>
        ))
      )}

      <FieldInput label={t("goals.dialog.task_placeholder")} value={props.newTaskTitle} onChangeText={props.onChangeNewTaskTitle} placeholder={t("goals.dialog.task_placeholder")} />
      <ActionChip onPress={props.onAddTask} tone="primary">
        {t("common.add")}
      </ActionChip>
    </View>
  );
}
