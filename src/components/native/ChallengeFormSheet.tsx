import { useEffect, useState } from "react";
import { Modal, ScrollView, Text, View } from "react-native";

import type { ChallengeInput } from "@/types";
import { ActionChip } from "@/components/native/ActionChip";
import { FieldInput } from "@/components/native/FieldInput";
import { SectionTabs } from "@/components/native/SectionTabs";
import type { Challenge, Goal } from "@/types";

export function ChallengeFormSheet({
  open,
  challenge,
  goals,
  onOpenChange,
  onSave,
}: {
  open: boolean;
  challenge?: Challenge;
  goals: Goal[];
  onOpenChange: (open: boolean) => void;
  onSave: (data: ChallengeInput) => Promise<unknown>;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [rules, setRules] = useState("");
  const [link, setLink] = useState("");
  const [price, setPrice] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [requiresReport, setRequiresReport] = useState(false);
  const [selectedGoalIds, setSelectedGoalIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    if (challenge) {
      setTitle(challenge.title);
      setDescription(challenge.description ?? "");
      setRules(challenge.rules ?? "");
      setLink(challenge.link ?? "");
      setPrice(challenge.price ? String(challenge.price) : "");
      setStartsAt(challenge.startsAt ?? "");
      setEndsAt(challenge.endsAt ?? "");
      setIsPublic(challenge.isPublic);
      setRequiresReport(challenge.requiresReport);
      setSelectedGoalIds(challenge.goalIds ?? challenge.goals.map((goal) => goal.id));
      return;
    }

    setTitle("");
    setDescription("");
    setRules("");
    setLink("");
    setPrice("");
    setStartsAt("");
    setEndsAt("");
    setIsPublic(true);
    setRequiresReport(false);
    setSelectedGoalIds([]);
  }, [open, challenge]);

  const toggleGoalSelection = (goalId: string) => {
    setSelectedGoalIds((current) =>
      current.includes(goalId) ? current.filter((item) => item !== goalId) : [...current, goalId]
    );
  };

  const handleSave = async () => {
    if (!title.trim()) {
      return;
    }

    try {
      setIsSubmitting(true);
      await onSave({
        id: challenge?.id ?? "",
        title: title.trim(),
        description: description.trim() || undefined,
        rules: rules.trim() || undefined,
        link: link.trim() || undefined,
        isPublic,
        reports: challenge?.reports ?? [],
        requiresReport,
        price: price ? Number(price) : undefined,
        startsAt: startsAt.trim() || undefined,
        endsAt: endsAt.trim() || undefined,
        goalIds: selectedGoalIds,
      });
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal visible={open} transparent animationType="slide" onRequestClose={() => onOpenChange(false)}>
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(15, 23, 42, 0.35)",
          justifyContent: "flex-end",
        }}
      >
        <View
          style={{
            maxHeight: "90%",
            backgroundColor: "#ffffff",
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            padding: 20,
            gap: 14,
          }}
        >
          <View style={{ gap: 6 }}>
            <Text style={{ fontSize: 20, fontWeight: "700", color: "#0f172a" }}>
              {challenge ? "Редактировать челлендж" : "Новый челлендж"}
            </Text>
            <Text style={{ color: "#64748b" }}>
              Mobile-форма для базового challenge CRUD без web-specific зависимостей.
            </Text>
          </View>

          <ScrollView contentContainerStyle={{ gap: 14 }}>
            <FieldInput label="Название" value={title} onChangeText={setTitle} placeholder="Например, майский спринт" />
            <FieldInput
              label="Описание"
              value={description}
              onChangeText={setDescription}
              placeholder="О чём этот челлендж"
            />
            <FieldInput label="Правила" value={rules} onChangeText={setRules} placeholder="Короткие правила участия" />
            <FieldInput label="Ссылка" value={link} onChangeText={setLink} placeholder="https://..." />
            <FieldInput label="Цена" value={price} onChangeText={setPrice} placeholder="0" />
            <FieldInput label="Старт (YYYY-MM-DD)" value={startsAt} onChangeText={setStartsAt} placeholder="2026-05-01" />
            <FieldInput label="Финиш (YYYY-MM-DD)" value={endsAt} onChangeText={setEndsAt} placeholder="2026-05-31" />

            <View style={{ gap: 8 }}>
              <Text style={{ fontSize: 14, fontWeight: "600", color: "#334155" }}>Доступ</Text>
              <SectionTabs
                tabs={[
                  { key: "public", label: "Публичный" },
                  { key: "private", label: "Приватный" },
                ]}
                activeTab={isPublic ? "public" : "private"}
                onChange={(tab) => setIsPublic(tab === "public")}
              />
            </View>

            <View style={{ gap: 8 }}>
              <Text style={{ fontSize: 14, fontWeight: "600", color: "#334155" }}>Требовать отчёт</Text>
              <SectionTabs
                tabs={[
                  { key: "yes", label: "Да" },
                  { key: "no", label: "Нет" },
                ]}
                activeTab={requiresReport ? "yes" : "no"}
                onChange={(tab) => setRequiresReport(tab === "yes")}
              />
            </View>

            <View style={{ gap: 8 }}>
              <Text style={{ fontSize: 14, fontWeight: "600", color: "#334155" }}>Цели в челлендже</Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                {goals.map((goal) => (
                  <ActionChip
                    key={goal.id}
                    onPress={() => toggleGoalSelection(goal.id)}
                    tone={selectedGoalIds.includes(goal.id) ? "primary" : "secondary"}
                  >
                    {goal.title}
                  </ActionChip>
                ))}
              </View>
            </View>
          </ScrollView>

          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            <ActionChip onPress={() => onOpenChange(false)}>Отмена</ActionChip>
            <ActionChip onPress={() => void handleSave()} tone="primary">
              {isSubmitting ? "Сохраняем..." : challenge ? "Сохранить" : "Создать"}
            </ActionChip>
          </View>
        </View>
      </View>
    </Modal>
  );
}

