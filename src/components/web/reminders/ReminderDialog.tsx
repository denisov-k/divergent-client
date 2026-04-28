import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import type { Goal, Reminder } from "@/types";
import { DAYS_OF_MONTH, DAYS_OF_WEEK } from "@/types";

interface ReminderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (reminder: Reminder) => void;
  onDelete?: (id: string) => void;
  reminder?: Reminder;
  goals: Goal[];
  initialGoalId?: string;
}

export function ReminderDialog({ open, onOpenChange, onSave, onDelete, reminder, goals, initialGoalId }: ReminderDialogProps) {
  const { t } = useTranslation();
  const [title, setTitle] = useState(reminder?.title || "");
  const [time, setTime] = useState(reminder?.time || "09:00");
  const [selectedDays, setSelectedDays] = useState<string[]>(reminder?.daysOfWeek || []);
  const [selectedDaysOfMonth, setSelectedDaysOfMonth] = useState<number[]>(reminder?.daysOfMonth || []);
  const [goalId, setGoalId] = useState(reminder?.goalId || initialGoalId || "");
  const [taskId, setTaskId] = useState(reminder?.taskId || "");
  const [mode, setMode] = useState<"week" | "month">("week");

  useEffect(() => {
    if (open) {
      if (reminder) {
        setTitle(reminder.title);
        setTime(reminder.time);
        setSelectedDays(reminder.daysOfWeek);
        setSelectedDaysOfMonth(reminder.daysOfMonth || []);
        setGoalId(reminder.goalId || "");
        setTaskId(reminder.taskId || "");
        setMode(reminder.daysOfMonth.length ? "month" : "week");
      } else {
        setTitle("");
        setTime("09:00");
        setSelectedDays([]);
        setSelectedDaysOfMonth([]);
        setGoalId(initialGoalId || "");
        setTaskId("");
      }
    }
  }, [open, reminder, initialGoalId]);

  const selectedGoal = goals.find((g) => g.id === goalId);
  const availableTasks = selectedGoal?.tasks || [];
  const allDayKeys = DAYS_OF_WEEK.map((d) => d.key);
  const todayDate = new Date().getDate();

  const toggleDay = (dayKey: string) => {
    setSelectedDays((prev) => (prev.includes(dayKey) ? prev.filter((d) => d !== dayKey) : [...prev, dayKey]));
  };

  const toggleDayOfMonth = (day: number) => {
    setSelectedDaysOfMonth((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]));
  };

  const handleSave = () => {
    const reminderData: Reminder = {
      id: reminder?.id || Date.now().toString(),
      title,
      time,
      daysOfWeek: mode === "week" ? selectedDays : [],
      daysOfMonth: mode === "month" ? selectedDaysOfMonth : [],
      isActive: reminder?.isActive ?? true,
      goalId: goalId || undefined,
      taskId: taskId || undefined,
    };

    onSave(reminderData);
    handleClose();
  };

  const handleClose = () => {
    if (!reminder) {
      setTitle("");
      setTime("09:00");
      setSelectedDays([]);
      setSelectedDaysOfMonth([]);
      setGoalId("");
      setTaskId("");
    }
    onOpenChange(false);
  };

  const handleDelete = (id: string) => {
    if (onDelete) {
      onDelete(id);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{reminder ? t("reminders.dialog.edit_title") : t("reminders.dialog.create_title")}</DialogTitle>
          <DialogDescription>{t("reminders.dialog.description")}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="reminder-title">{t("reminders.dialog.title_label")}</Label>
            <Input
              id="reminder-title"
              placeholder={t("reminders.dialog.title_placeholder")}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reminder-time">{t("reminders.dialog.time_label")}</Label>
            <Input id="reminder-time" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
          </div>

          <div className="flex gap-2">
            <Button variant={mode === "week" ? "default" : "outline"} onClick={() => setMode("week")}>
              {t("reminders.dialog.mode_week")}
            </Button>
            <Button variant={mode === "month" ? "default" : "outline"} onClick={() => setMode("month")}>
              {t("reminders.dialog.mode_month")}
            </Button>
          </div>

          {mode === "week" && (
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {DAYS_OF_WEEK.map((day) => (
                  <Button
                    key={day.key}
                    type="button"
                    variant={selectedDays.includes(day.key) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleDay(day.key)}
                    className="w-14"
                  >
                    {day.label}
                  </Button>
                ))}
              </div>
              <Button type="button" variant="outline" size="sm" onClick={() => setSelectedDays(allDayKeys)}>
                {t("common.every_day")}
              </Button>
            </div>
          )}

          {mode === "month" && (
            <div className="space-y-2">
              <div className="flex max-h-40 flex-wrap gap-2 overflow-y-auto">
                {DAYS_OF_MONTH.map((day) => (
                  <Button
                    key={day}
                    type="button"
                    variant={selectedDaysOfMonth.includes(day) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleDayOfMonth(day)}
                    className={`w-10 ${day === todayDate ? "border-primary" : ""}`}
                  >
                    {day}
                  </Button>
                ))}
              </div>
              <Button type="button" variant="outline" size="sm" onClick={() => setSelectedDaysOfMonth(DAYS_OF_MONTH)}>
                {t("common.every_month_day")}
              </Button>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="reminder-goal">{t("reminders.dialog.bind_goal")}</Label>
            <Select
              value={goalId}
              onValueChange={(value) => {
                setGoalId(value);
                setTaskId("");
              }}
            >
              <SelectTrigger id="reminder-goal">
                <SelectValue placeholder={t("reminders.dialog.goal_placeholder")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">{t("reminders.dialog.goal_none")}</SelectItem>
                {goals.map((goal) => (
                  <SelectItem key={goal.id} value={goal.id}>
                    {goal.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {goalId && goalId !== "none" && availableTasks.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="reminder-task">{t("reminders.dialog.bind_task")}</Label>
              <Select value={taskId} onValueChange={setTaskId}>
                <SelectTrigger id="reminder-task">
                  <SelectValue placeholder={t("reminders.dialog.task_placeholder")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">{t("reminders.dialog.task_none")}</SelectItem>
                  {availableTasks.map((task) => (
                    <SelectItem key={task.id} value={task.id}>
                      {task.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <DialogFooter>
          {reminder && (
            <Button variant="destructive" onClick={() => handleDelete(reminder.id)}>
              {t("common.delete")}
            </Button>
          )}
          <Button variant="outline" onClick={handleClose}>
            {t("common.cancel")}
          </Button>
          <Button onClick={handleSave} disabled={!title || !time || (selectedDays.length === 0 && selectedDaysOfMonth.length === 0)}>
            {reminder ? t("common.save") : t("reminders.dialog.create_submit")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
