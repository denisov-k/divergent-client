import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Calendar, Clock, Target } from "lucide-react";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { RewardIcon } from "@/components/shared/RewardIcon";
import { CategoryBadge } from "@/components/shared/CategoryBadge";
import { useAppStore } from "@/stores/useAppStore";
import type { AIChatResponse, Task, ChatMessage, Draft, Goal, RewardIcon as RewardIconType } from "@/types";
import { DAYS_OF_WEEK } from "@/types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDraftAdded: (goal: Goal) => void;
}

const daysMap = Object.fromEntries(DAYS_OF_WEEK.map((d) => [d.key, d.label])) as Record<string, string>;

export default function AiChatDialog({ open, onOpenChange, onDraftAdded }: Props) {
  const { t } = useTranslation();
  const { chatAI, getChatHistory } = useAppStore();

  const [prompt, setPrompt] = useState("");
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current?.lastElementChild as HTMLElement | null;
    el?.scrollIntoView({ block: "start", behavior: "smooth" });
  }, [history]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setPrompt("");

    const userMessage: ChatMessage = { role: "user", content: prompt, isDraftAdded: false };

    setHistory((h) => [...h, userMessage]);
    setLoading(true);
    setError(null);

    try {
      const data: AIChatResponse = await chatAI(prompt);

      if (data.message) {
        setHistory((h) => [
          ...h,
          {
            id: data.id,
            role: "assistant",
            content: data.message,
            goalDraft: data.goalDraft ?? null,
            isDraftAdded: data.isDraftAdded,
          },
        ]);
      }
    } catch {
      setError(t("ai.goal_response_error"));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = (nextOpen: boolean) => {
    if (!nextOpen) {
      setPrompt("");
      setHistory([]);
      setError(null);
    }
    onOpenChange(nextOpen);
  };

  const handleGoalAdded = (goal: Goal, messageId?: string) => {
    onDraftAdded(goal);

    if (messageId) {
      setHistory((prev) => prev.map((m) => (m.id === messageId ? { ...m, isDraftAdded: true } : m)));
    }
  };

  useEffect(() => {
    if (open) {
      const loadHistory = async () => {
        try {
          const storedHistory = await getChatHistory();
          if (storedHistory) setHistory(storedHistory);
        } catch (err) {
          console.error("Failed to load chat history:", err);
        }
      };
      void loadHistory();
    }
  }, [open, getChatHistory]);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] text-sm flex flex-col">
        <DialogHeader>
          <DialogTitle>{t("ai.title")}</DialogTitle>
        </DialogHeader>

        <div ref={scrollRef} className="flex-1 overflow-y-auto rounded bg-gray-50 p-2 space-y-2">
          {history.map((message, index) => (
            <ChatMessageItem key={index} message={message} messageId={message.id} onDraftAdded={handleGoalAdded} />
          ))}
        </div>

        <div className="mt-2 space-y-2">
          <Textarea placeholder={t("ai.placeholder")} value={prompt} onChange={(e) => setPrompt(e.target.value)} disabled={loading} />
          {error && <div className="text-red-500">{error}</div>}
        </div>

        <DialogFooter>
          <Button onClick={handleGenerate} disabled={loading || !prompt.trim()} size="sm">
            {loading ? t("ai.asking") : t("ai.ask")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ChatMessageItem({
  message,
  messageId,
  onDraftAdded,
}: {
  message: ChatMessage;
  messageId?: string;
  onDraftAdded: (goal: Goal) => void;
}) {
  return (
    <div className="space-y-1">
      <div className={`whitespace-pre-wrap rounded p-2 ${message.role === "user" ? "bg-blue-100 text-blue-900" : "bg-gray-100 text-gray-800"}`}>
        {message.content}
      </div>

      {message.role === "assistant" && message.goalDraft && (
        <GoalDraftPreview draft={message.goalDraft} messageId={messageId} onAdd={onDraftAdded} isDraftAdded={message.isDraftAdded} />
      )}
    </div>
  );
}

function GoalDraftPreview({
  draft,
  isDraftAdded,
  messageId,
  onAdd,
}: {
  draft: Draft;
  isDraftAdded: boolean;
  messageId?: string;
  onAdd: (goal: Goal, messageId: string) => void;
}) {
  const { t } = useTranslation();
  const { addDraft, categories } = useAppStore();

  const categoryLabel = categories.find((c) => c.value === draft.goal.category)?.label ?? draft.goal.category;

  const handleAdd = async () => {
    if (!messageId) return;
    try {
      const goal = await addDraft(messageId);
      if (goal) {
        onAdd(goal, messageId);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex flex-col gap-2 rounded border bg-gray-50 p-4">
      <div className="flex items-center gap-2 font-medium">
        <Target className="size-4 text-primary" />
        <span>{draft.goal.title}</span>
      </div>
      <CategoryBadge category={draft.goal.category} label={categoryLabel} />

      {draft.goal.description && <div>{draft.goal.description}</div>}

      <div className="flex items-center gap-2 font-medium">
        {draft.goal.goalPeriod !== "NONE" && (
          <Badge variant="outline">
            {draft.goal.goalPeriod === "DAILY" && t("goal_period.daily")}
            {draft.goal.goalPeriod === "WEEKLY" && t("goal_period.weekly")}
            {draft.goal.goalPeriod === "MONTHLY" && t("goal_period.monthly")}
          </Badge>
        )}

        {draft.goal.dueDate && (
          <Badge variant="outline">
            <Calendar className="size-2" />
            <span className="whitespace-nowrap text-xs">{draft.goal.dueDate}</span>
          </Badge>
        )}
      </div>

      {draft.tasks?.length > 0 && (
        <div>
          <div className="mb-1 font-medium">{t("ai.tasks")}</div>
          <ul className="ml-4 list-disc space-y-1">
            {draft.tasks.map((task, i) => (
              <TaskItem key={i} task={task} />
            ))}
          </ul>
        </div>
      )}

      {draft.reminders?.length > 0 && (
        <div>
          <div className="mb-1 font-medium">{t("ai.reminders")}</div>
          <ul className="space-y-1">
            {draft.reminders.map((r, i) => (
              <li key={i} className="flex flex-col space-y-1">
                <div className="flex items-center gap-1">
                  <Clock size="12" />
                  <span>{r.title}</span>
                </div>
                {r.daysOfWeek?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {[...r.daysOfWeek].map((d) => (
                      <Badge key={d} variant="outline" className="px-1.5 py-0">
                        {daysMap[d] ?? d}
                      </Badge>
                    ))}
                  </div>
                )}

                {r.daysOfMonth?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {[...r.daysOfMonth]
                      .sort((a, b) => a - b)
                      .map((d) => (
                        <Badge key={d} variant="outline" className="px-1.5 py-0">
                          {d}
                        </Badge>
                      ))}
                  </div>
                )}
                <Badge variant="outline" className="px-1.5 py-0">
                  {r.time}
                </Badge>
              </li>
            ))}
          </ul>
        </div>
      )}

      {draft.reward && (
        <div>
          <div className="mb-1 font-medium">{t("ai.reward")}</div>

          <div className="flex items-start gap-2">
            <div className="flex flex-col gap-2">
              <div className="flex items-center">
                <RewardIcon icon={draft.reward.icon as RewardIconType} size={4} />
                {draft.reward.title}
              </div>

              {draft.reward.description && <div className="text-muted-foreground">{draft.reward.description}</div>}

              {draft.reward.xpRequires != null && (
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                  {t("ai.xp_required", { xp: draft.reward.xpRequires })}
                </Badge>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <Button size="sm" onClick={handleAdd} disabled={isDraftAdded}>
          {isDraftAdded ? t("common.added") : t("common.add")}
        </Button>
      </div>
    </div>
  );
}

function TaskItem({ task }: { task: Task }) {
  return (
    <li>
      <div className="flex items-center gap-2">
        <span>{task.title}</span>

        {task.xpReward != null && <Badge className="px-1.5 py-0">+{task.xpReward} XP</Badge>}
      </div>

      {task.subtasks && task.subtasks.length > 0 && (
        <ul className="mt-1 ml-4 list-disc space-y-1 border-l pl-2">
          {task.subtasks.map((sub: Task, i: number) => (
            <TaskItem key={i} task={sub} />
          ))}
        </ul>
      )}
    </li>
  );
}


