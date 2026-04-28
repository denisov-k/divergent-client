import { Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { ActionChip } from "@/components/native/ActionChip";
import { FieldInput } from "@/components/native/FieldInput";
import { SectionTabs } from "@/components/native/SectionTabs";
import { formSectionLabelStyle } from "@/components/native/form-sheet/Layout";
import type { Goal } from "@/types";

export function ChallengeFieldsSection(props: {
  title: string;
  description: string;
  rules: string;
  link: string;
  price: string;
  startsAt: string;
  endsAt: string;
  onChangeTitle: (value: string) => void;
  onChangeDescription: (value: string) => void;
  onChangeRules: (value: string) => void;
  onChangeLink: (value: string) => void;
  onChangePrice: (value: string) => void;
  onChangeStartsAt: (value: string) => void;
  onChangeEndsAt: (value: string) => void;
}) {
  const { t } = useTranslation();

  return (
    <>
      <FieldInput label={t("challenges.fields.title")} value={props.title} onChangeText={props.onChangeTitle} placeholder={t("challenges.placeholders.title")} />
      <FieldInput label={t("challenges.fields.description")} value={props.description} onChangeText={props.onChangeDescription} placeholder={t("challenges.placeholders.description")} />
      <FieldInput label={t("challenges.fields.rules")} value={props.rules} onChangeText={props.onChangeRules} placeholder={t("challenges.placeholders.rules")} />
      <FieldInput label={t("challenges.fields.link")} value={props.link} onChangeText={props.onChangeLink} placeholder={t("challenges.placeholders.link")} />
      <FieldInput label={t("challenges.fields.price")} value={props.price} onChangeText={props.onChangePrice} placeholder={t("challenges.placeholders.price")} />
      <FieldInput label={`${t("challenges.fields.start_date")} (YYYY-MM-DD)`} value={props.startsAt} onChangeText={props.onChangeStartsAt} placeholder={t("challenges.placeholders.start_date")} />
      <FieldInput label={`${t("challenges.fields.end_date")} (YYYY-MM-DD)`} value={props.endsAt} onChangeText={props.onChangeEndsAt} placeholder={t("challenges.placeholders.end_date")} />
    </>
  );
}

export function ChallengeVisibilitySection(props: { isPublic: boolean; onChange: (value: boolean) => void }) {
  const { t } = useTranslation();

  return (
    <View style={{ gap: 8 }}>
      <Text style={formSectionLabelStyle}>{t("challenges.fields.visibility")}</Text>
      <SectionTabs
        tabs={[
          { key: "public", label: t("challenges.visibility.public") },
          { key: "private", label: t("challenges.visibility.private") },
        ]}
        activeTab={props.isPublic ? "public" : "private"}
        onChange={(tab) => props.onChange(tab === "public")}
      />
    </View>
  );
}

export function ChallengeReportsSection(props: { requiresReport: boolean; onChange: (value: boolean) => void }) {
  const { t } = useTranslation();

  return (
    <View style={{ gap: 8 }}>
      <Text style={formSectionLabelStyle}>{t("challenges.fields.requiresReport")}</Text>
      <SectionTabs
        tabs={[{ key: "yes", label: t("common.yes") }, { key: "no", label: t("common.no") }]}
        activeTab={props.requiresReport ? "yes" : "no"}
        onChange={(tab) => props.onChange(tab === "yes")}
      />
    </View>
  );
}

export function ChallengeGoalsSection(props: {
  goals: Goal[];
  selectedGoalIds: string[];
  onToggleGoal: (goalId: string) => void;
}) {
  const { t } = useTranslation();

  return (
    <View style={{ gap: 8 }}>
      <Text style={formSectionLabelStyle}>{t("challenges.selection.goals")}</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        {props.goals.map((goal) => (
          <ActionChip key={goal.id} onPress={() => props.onToggleGoal(goal.id)} tone={props.selectedGoalIds.includes(goal.id) ? "primary" : "secondary"}>
            {goal.title}
          </ActionChip>
        ))}
      </View>
    </View>
  );
}
