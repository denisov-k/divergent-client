import { useEffect, useMemo, useState } from "react";
import { Modal, ScrollView, Text, TextInput, View } from "react-native";

import { ActionChip } from "@/components/native/ActionChip";
import { SurfaceCard } from "@/components/native/SurfaceCard";
import { useAppStore } from "@/stores/useAppStore";
import { appPalette } from "@/theme/palette";
import type { AIChatResponse, ChatMessage, Draft, Goal, Task } from "@/types";

const DAY_LABELS: Record<string, string> = { mon: "Пн", tue: "Вт", wed: "Ср", thu: "Чт", fri: "Пт", sat: "Сб", sun: "Вс" };

export function AiChatSheet({ open, onOpenChange, onDraftAdded }: { open: boolean; onOpenChange: (open: boolean) => void; onDraftAdded: (goal: Goal) => void; }) {
  const { chatAI, getChatHistory } = useAppStore();
  const [prompt, setPrompt] = useState("");
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) { setPrompt(""); setHistory([]); setError(null); return; }
    const loadHistory = async () => { try { const storedHistory = await getChatHistory(); setHistory(storedHistory ?? []); } catch { setHistory([]); } };
    void loadHistory();
  }, [open, getChatHistory]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    const currentPrompt = prompt.trim();
    setPrompt("");
    setHistory((items) => [...items, { role: "user", content: currentPrompt, isDraftAdded: false }]);
    setLoading(true); setError(null);
    try {
      const data: AIChatResponse = await chatAI(currentPrompt);
      if (data.message) setHistory((items) => [...items, { id: data.id, role: "assistant", content: data.message, goalDraft: data.goalDraft ?? null, isDraftAdded: data.isDraftAdded }]);
    } catch {
      setError("Не удалось получить ответ от AI.");
    } finally { setLoading(false); }
  };

  const handleGoalAdded = (goal: Goal, messageId?: string) => {
    onDraftAdded(goal);
    if (!messageId) return;
    setHistory((items) => items.map((item) => (item.id === messageId ? { ...item, isDraftAdded: true } : item)));
  };

  return (
    <Modal visible={open} transparent animationType="slide" onRequestClose={() => onOpenChange(false)}>
      <View style={{ flex: 1, backgroundColor: appPalette.surface.overlay, justifyContent: "flex-end" }}>
        <View style={{ maxHeight: "92%", backgroundColor: appPalette.surface.background, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, gap: 14 }}>
          <View style={{ gap: 6 }}><Text style={{ fontSize: 20, fontWeight: "700", color: appPalette.semantic.textStrong, fontFamily: "Montserrat" }}>AI для целей</Text><Text style={{ color: appPalette.semantic.textMuted, fontFamily: "Montserrat", fontSize: 12, lineHeight: 18 }}>Тот же AI goal flow, только в mobile sheet.</Text></View>
          <ScrollView contentContainerStyle={{ gap: 10, paddingBottom: 4 }}>{history.map((message, index) => <AiChatMessageCard key={`${message.id ?? message.role}-${index}`} message={message} messageId={message.id} onDraftAdded={handleGoalAdded} />)}</ScrollView>
          <View style={{ gap: 8 }}>
            <TextInput value={prompt} onChangeText={setPrompt} placeholder="Опиши цель, привычку или challenge-flow" multiline textAlignVertical="top" style={{ minHeight: 96, borderWidth: 1, borderColor: appPalette.semantic.borderStrong, borderRadius: 16, paddingHorizontal: 14, paddingVertical: 12, backgroundColor: appPalette.surface.background, color: appPalette.semantic.textStrong, fontFamily: "Montserrat", fontSize: 12, lineHeight: 18 }} placeholderTextColor={appPalette.semantic.textSubtle} />
            {!!error && <View style={{ backgroundColor: appPalette.semantic.dangerSurface, borderRadius: 12, padding: 12 }}><Text style={{ color: appPalette.semantic.dangerText, fontFamily: "Montserrat", fontSize: 12, lineHeight: 18 }}>{error}</Text></View>}
          </View>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}><ActionChip onPress={() => onOpenChange(false)}>Закрыть</ActionChip><ActionChip onPress={() => void handleGenerate()} tone="primary">{loading ? "Думаем..." : "Спросить AI"}</ActionChip></View>
        </View>
      </View>
    </Modal>
  );
}

function AiChatMessageCard({ message, messageId, onDraftAdded }: { message: ChatMessage; messageId?: string; onDraftAdded: (goal: Goal, messageId?: string) => void; }) {
  const tone = useMemo(() => message.role === "user" ? { backgroundColor: appPalette.semantic.infoSurface, textColor: appPalette.semantic.infoTextStrong } : { backgroundColor: appPalette.ui.inputBackground, textColor: appPalette.semantic.text }, [message.role]);
  return <View style={{ gap: 8 }}><View style={{ backgroundColor: tone.backgroundColor, borderRadius: 14, padding: 12 }}><Text style={{ color: tone.textColor, fontFamily: "Montserrat", fontSize: 12, lineHeight: 18 }}>{message.content}</Text></View>{message.role === "assistant" && message.goalDraft && <GoalDraftCard draft={message.goalDraft} messageId={messageId} isDraftAdded={message.isDraftAdded} onAdd={onDraftAdded} />}</View>;
}

function GoalDraftCard({ draft, isDraftAdded, messageId, onAdd }: { draft: Draft; isDraftAdded: boolean; messageId?: string; onAdd: (goal: Goal, messageId?: string) => void; }) {
  const { categories, addDraft } = useAppStore();
  const categoryLabel = categories.find((item) => item.value === draft.goal.category)?.label ?? draft.goal.category;
  const handleAdd = async () => { if (!messageId) return; try { const goal = await addDraft(messageId); if (goal) onAdd(goal, messageId); } catch (error) { console.error(error); } };

  return <SurfaceCard gap={10}><View style={{ gap: 6 }}><Text style={{ fontSize: 16, fontWeight: "700", color: appPalette.semantic.textStrong, fontFamily: "Montserrat" }}>{draft.goal.title}</Text><Text style={{ color: appPalette.semantic.text, fontFamily: "Montserrat", fontSize: 12, lineHeight: 18 }}>{categoryLabel}</Text>{!!draft.goal.description && <Text style={{ color: appPalette.semantic.text, fontFamily: "Montserrat", fontSize: 12, lineHeight: 18 }}>{draft.goal.description}</Text>}</View><View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>{draft.goal.goalPeriod !== "NONE" && <Pill>{draft.goal.goalPeriod}</Pill>}{!!draft.goal.dueDate && <Pill>{draft.goal.dueDate}</Pill>}</View>{draft.tasks?.length > 0 && <View style={{ gap: 6 }}><Text style={{ fontWeight: "600", color: appPalette.semantic.textStrong, fontFamily: "Montserrat", fontSize: 12, lineHeight: 18 }}>Задачи</Text>{draft.tasks.map((task, index) => <TaskPreview key={`${task.title}-${index}`} task={task} depth={0} />)}</View>}{draft.reminders?.length > 0 && <View style={{ gap: 6 }}><Text style={{ fontWeight: "600", color: appPalette.semantic.textStrong, fontFamily: "Montserrat", fontSize: 12, lineHeight: 18 }}>Напоминания</Text>{draft.reminders.map((reminder, index) => <View key={`${reminder.title}-${index}`} style={{ backgroundColor: appPalette.ui.inputBackground, borderRadius: 12, padding: 10, gap: 6 }}><Text style={{ color: appPalette.semantic.textStrong, fontWeight: "600", fontFamily: "Montserrat", fontSize: 12, lineHeight: 18 }}>{reminder.title}</Text><View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}><Pill>{reminder.time}</Pill>{reminder.daysOfWeek.map((day) => <Pill key={day}>{DAY_LABELS[day] ?? day}</Pill>)}{reminder.daysOfMonth.map((day) => <Pill key={day}>{String(day)}</Pill>)}</View></View>)}</View>}{!!draft.reward?.title && <View style={{ gap: 6 }}><Text style={{ fontWeight: "600", color: appPalette.semantic.textStrong, fontFamily: "Montserrat", fontSize: 12, lineHeight: 18 }}>Награда</Text><View style={{ backgroundColor: appPalette.ui.inputBackground, borderRadius: 12, padding: 10, gap: 4 }}><Text style={{ color: appPalette.semantic.textStrong, fontWeight: "600", fontFamily: "Montserrat", fontSize: 12, lineHeight: 18 }}>{draft.reward.title}</Text>{!!draft.reward.description && <Text style={{ color: appPalette.semantic.text, fontFamily: "Montserrat", fontSize: 12, lineHeight: 18 }}>{draft.reward.description}</Text>}{draft.reward.xpRequires != null && <Text style={{ color: appPalette.semantic.warningText, fontFamily: "Montserrat", fontSize: 12, lineHeight: 18 }}>Требуется {draft.reward.xpRequires} XP</Text>}</View></View>}<View style={{ flexDirection: "row", justifyContent: "flex-end" }}><ActionChip onPress={() => void handleAdd()} tone="primary">{isDraftAdded ? "Уже добавлено" : "Добавить в цели"}</ActionChip></View></SurfaceCard>;
}

function TaskPreview({ task, depth }: { task: Task; depth: number }) {
  return <View style={{ gap: 6, marginLeft: depth * 12 }}><View style={{ backgroundColor: appPalette.ui.inputBackground, borderRadius: 12, padding: 10, gap: 4 }}><Text style={{ color: appPalette.semantic.textStrong, fontFamily: "Montserrat", fontSize: 12, lineHeight: 18 }}>{task.title}</Text>{task.xpReward != null && <Text style={{ color: appPalette.brand.primary, fontWeight: "600", fontFamily: "Montserrat", fontSize: 12, lineHeight: 18 }}>+{task.xpReward} XP</Text>}</View>{task.subtasks?.map((subtask, index) => <TaskPreview key={`${subtask.title}-${index}`} task={subtask} depth={depth + 1} />)}</View>;
}

function Pill({ children }: { children: string }) {
  return <View style={{ backgroundColor: appPalette.semantic.infoSurfaceStrong, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 }}><Text style={{ color: appPalette.semantic.infoText, fontWeight: "600", fontSize: 12, fontFamily: "Montserrat", lineHeight: 18 }}>{children}</Text></View>;
}

