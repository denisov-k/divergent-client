import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import type { Goal } from "./GoalDialog";

export interface Reminder {
  id: string;
  title: string;
  time: string;
  days: string[];
  isActive: boolean;
  goalId?: string;
  taskId?: string;
}

interface ReminderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (reminder: Reminder) => void;
  reminder?: Reminder;
  goals: Goal[];
}

const daysOfWeek = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

export function ReminderDialog({ open, onOpenChange, onSave, reminder, goals }: ReminderDialogProps) {
  const [title, setTitle] = useState(reminder?.title || "");
  const [time, setTime] = useState(reminder?.time || "09:00");
  const [selectedDays, setSelectedDays] = useState<string[]>(reminder?.days || []);
  const [goalId, setGoalId] = useState(reminder?.goalId || "");
  const [taskId, setTaskId] = useState(reminder?.taskId || "");

  const selectedGoal = goals.find(g => g.id === goalId);
  const availableTasks = selectedGoal?.tasks || [];

  const toggleDay = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(d => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const handleSave = () => {
    const reminderData: Reminder = {
      id: reminder?.id || Date.now().toString(),
      title,
      time,
      days: selectedDays,
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
      setGoalId("");
      setTaskId("");
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{reminder ? "Редактировать напоминание" : "Создать напоминание"}</DialogTitle>
          <DialogDescription>
            Настройте напоминание для достижения своих целей
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="reminder-title">Название напоминания *</Label>
            <Input
              id="reminder-title"
              placeholder="Например: Утренняя зарядка"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reminder-time">Время *</Label>
            <Input
              id="reminder-time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Дни недели *</Label>
            <div className="flex flex-wrap gap-2">
              {daysOfWeek.map((day) => (
                <Button
                  key={day}
                  type="button"
                  variant={selectedDays.includes(day) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleDay(day)}
                  className="w-12"
                >
                  {day}
                </Button>
              ))}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setSelectedDays(daysOfWeek)}
            >
              Каждый день
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reminder-goal">Привязать к цели (необязательно)</Label>
            <Select value={goalId} onValueChange={(value) => {
              setGoalId(value);
              setTaskId(""); // Сбросить задачу при смене цели
            }}>
              <SelectTrigger id="reminder-goal">
                <SelectValue placeholder="Выберите цель" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Без привязки</SelectItem>
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
              <Label htmlFor="reminder-task">Привязать к задаче (необязательно)</Label>
              <Select value={taskId} onValueChange={setTaskId}>
                <SelectTrigger id="reminder-task">
                  <SelectValue placeholder="Выберите задачу" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Без привязки к задаче</SelectItem>
                  {availableTasks.map((task) => (
                    <SelectItem key={task.id} value={task.id}>
                      {task.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {selectedDays.length > 0 && (
            <div className="p-3 rounded-lg border bg-muted/50">
              <p className="text-sm text-muted-foreground mb-2">Выбранные дни:</p>
              <div className="flex flex-wrap gap-1">
                {selectedDays.map((day) => (
                  <Badge key={day} variant="secondary">
                    {day}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Отмена
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={!title || !time || selectedDays.length === 0}
          >
            {reminder ? "Сохранить" : "Создать напоминание"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
