import { useState, useRef, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

import type { GeneratedGoal, AIChatResponse } from "@/types"
import { useAppStore } from "@/stores/useAppStore"
import { useTranslation } from "react-i18next"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onGoalCreated: (goal: GeneratedGoal) => void
}

type ChatMessage = {
  role: "user" | "assistant"
  content: string
  goalDraft?: GeneratedGoal | null
}

const daysMap: Record<string, string> = {
  "1": "Monday",
  "2": "Tuesday",
  "3": "Wednesday",
  "4": "Thursday",
  "5": "Friday",
  "6": "Saturday",
  "7": "Sunday"
}

export default function AiChatDialog({
                                       open,
                                       onOpenChange,
                                       onGoalCreated,
                                     }: Props) {
  const { t } = useTranslation()
  const [prompt, setPrompt] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [history, setHistory] = useState<ChatMessage[]>([])

  const { chatAI } = useAppStore()
  const scrollRef = useRef<HTMLDivElement>(null)

  // Скролл к началу нового сообщения
  useEffect(() => {
    if (scrollRef.current) {
      const lastMsg = scrollRef.current.lastElementChild as HTMLElement | null
      lastMsg?.scrollIntoView({ block: "start", behavior: "smooth" })
    }
  }, [history])

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    setLoading(true)
    setError(null)

    const userMessage: ChatMessage = { role: "user", content: prompt }
    setHistory((h) => [...h, userMessage])

    try {
      const data: AIChatResponse = await chatAI(prompt)

      if (data.message) {
        const aiMessage: ChatMessage = {
          role: "assistant",
          content: data.message,
          goalDraft: data.goalDraft ?? null,
        }
        setHistory((h) => [...h, aiMessage])
      }

      setPrompt("")
    } catch (e) {
      console.error(e)
      setError("Failed to communicate with AI")
    } finally {
      setLoading(false)
    }
  }

  const handleAddGoal = (goal: GeneratedGoal) => {
    onGoalCreated(goal)
  }

  const handleClose = (open: boolean) => {
    if (!open) {
      setHistory([])
      setPrompt("")
      setError(null)
    }
    onOpenChange(open)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t('ai.title')}</DialogTitle>
        </DialogHeader>

        {/* История чата */}
        <div
          ref={scrollRef}
          className="space-y-2 mb-4 max-h-96 overflow-y-auto p-2 bg-gray-50 rounded"
        >
          {history.map((m, i) => (
            <div key={i} className="mb-2">
              {/* Сообщение пользователя / AI */}
              <div
                className={`p-2 rounded whitespace-pre-wrap ${
                  m.role === "user"
                    ? "bg-blue-100 text-blue-900"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {m.content}
              </div>

              {/* Если AI прислал goalDraft, показываем превью */}
              {m.role === "assistant" && m.goalDraft && (
                <div className="mt-2 border p-2 rounded bg-gray-50">
                  {/* Основная цель */}
                  <div className="font-semibold text-sm">
                    {t('ai.goal')}: {m.goalDraft.goal.title}
                  </div>
                  {m.goalDraft.goal.description && (
                    <div className="text-sm text-muted-foreground">
                      {m.goalDraft.goal.description}
                    </div>
                  )}

                  {/* Задачи */}
                  {m.goalDraft.tasks?.length > 0 && (
                    <div className="mt-1">
                      <div className="font-semibold text-xs text-muted-foreground">
                        {t('ai.tasks')}
                      </div>
                      <ul className="list-disc ml-5 text-sm">
                        {m.goalDraft.tasks.map((task, idx) => (
                          <li key={idx}>
                            {task.title}
                            {task.xpReward != null && ` (XP: ${task.xpReward})`}
                            {task.subtasks && task.subtasks.length > 0 && (
                              <ul className="list-disc ml-5">
                                {task.subtasks.map((st, sidx) => (
                                  <li key={sidx}>
                                    {st.title}
                                    {st.xpReward != null && ` (XP: ${st.xpReward})`}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Напоминания */}
                  {m.goalDraft.reminders?.length > 0 && (
                    <div className="mt-1">
                      <div className="font-semibold text-xs text-muted-foreground">
                        {t('ai.reminders')}
                      </div>
                      <ul className="ml-5 text-sm list-disc">
                        {m.goalDraft.reminders.map((r, idx) => (
                          <li key={idx}>
                            {r.title ? `${r.title} — ` : ""}
                            {r.time}{" "}
                            {r.daysOfWeek?.map((d) => daysMap[d] || d).join(", ")}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Награда */}
                  {m.goalDraft.reward && (
                    <div className="mt-1">
                      <div className="font-semibold text-xs text-muted-foreground">
                        {t('ai.reward')}
                      </div>
                      <div className="ml-5 text-sm">
                        <div>{m.goalDraft.reward.title}</div>
                        {m.goalDraft.reward.description && (
                          <div className="text-xs text-muted-foreground">
                            {m.goalDraft.reward.description}
                          </div>
                        )}
                        {m.goalDraft.reward.icon && (
                          <div className="text-xs text-muted-foreground">
                            Icon: {m.goalDraft.reward.icon}
                          </div>
                        )}
                        {m.goalDraft.reward.xpRequires != null && (
                          <div className="text-xs text-muted-foreground">
                            XP Requires: {m.goalDraft.reward.xpRequires}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Кнопка добавления цели */}
                  <div className="mt-2 flex justify-end">
                    <Button
                      size="sm"
                      onClick={() => handleAddGoal(m.goalDraft!)}
                    >
                      {t('common.add')}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="space-y-2">
          <Textarea
            placeholder={t('ai.placeholder')}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={loading}
          />
          {error && <div className="text-sm text-red-500">{error}</div>}
        </div>

        {/* Footer */}
        <DialogFooter className="flex justify-end mt-2">
          <Button onClick={handleGenerate} disabled={loading || !prompt.trim()}>
            {loading ? "Generating..." : t('ai.ask')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
