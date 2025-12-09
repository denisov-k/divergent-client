import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import type { Goal } from "./GoalDialog";

export interface Reminder {
  id: string;
  title: string;
  time: string;
  daysOfWeek: string[];
  daysOfMonth: number[];
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
  initialGoalId?: string;
}

export const DAYS_OF_WEEK = [
  { key: 'mon', label: 'Пн' },
  { key: 'tue', label: 'Вт' },
  { key: 'wed', label: 'Ср' },
  { key: 'thu', label: 'Чт' },
  { key: 'fri', label: 'Пт' },
  { key: 'sat', label: 'Сб' },
  { key: 'sun', label: 'Вс' },
] as const;

export const DAYS_OF_MONTH = Array.from({ length: 31 }, (_, i) => i + 1);

export function ReminderDialog({ open, onOpenChange, onSave, reminder, goals, initialGoalId }: ReminderDialogProps) {
  const [title, setTitle] = useState(reminder?.title || "");
  const [time, setTime] = useState(reminder?.time || "09:00");
  const [selectedDays, setSelectedDays] = useState<string[]>(reminder?.daysOfWeek || []);
  const [selectedDaysOfMonth, setSelectedDaysOfMonth] = useState<number[]>(reminder?.daysOfMonth || []);

  const [goalId, setGoalId] = useState(reminder?.goalId || initialGoalId || "");
  const [taskId, setTaskId] = useState(reminder?.taskId || "");

  const [mode, setMode] = useState<'week' | 'month'>('week');

  useEffect(() => {
    if (open) {
      if (reminder) {
        setTitle(reminder.title);
        setTime(reminder.time);
        setSelectedDays(reminder.daysOfWeek);
        setSelectedDaysOfMonth(reminder.daysOfMonth || []);
        setGoalId(reminder.goalId || "");
        setTaskId(reminder.taskId || "");
        setMode(reminder.daysOfMonth.length ? 'month' : 'week')
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

  const selectedGoal = goals.find(g => g.id === goalId);
  const availableTasks = selectedGoal?.tasks || [];

  const allDayKeys = DAYS_OF_WEEK.map(d => d.key);
  const todayDate = new Date().getDate();

  const toggleDay = (dayKey: string) => {
    setSelectedDays(prev =>
      prev.includes(dayKey)
        ? prev.filter(d => d !== dayKey)
        : [...prev, dayKey]
    );
  };

  const toggleDayOfMonth = (day: number) => {
    setSelectedDaysOfMonth(prev =>
      prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  const handleSave = () => {
    const reminderData: Reminder = {
      id: reminder?.id || Date.now().toString(),
      title,
      time,
      daysOfWeek: mode === 'week' ? selectedDays : [],
      daysOfMonth: mode === 'month' ? selectedDaysOfMonth : [],
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

          {/* Переключатель режима */}
          <div className="flex gap-2">
            <Button
              variant={mode === 'week' ? 'default' : 'outline'}
              onClick={() => setMode('week')}
            >
              Дни недели
            </Button>
            <Button
              variant={mode === 'month' ? 'default' : 'outline'}
              onClick={() => setMode('month')}
            >
              Числа месяца
            </Button>
          </div>

          {/* Дни недели */}
          {mode === 'week' && (
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {DAYS_OF_WEEK.map(day => (
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
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setSelectedDays(allDayKeys)}
              >
                Каждый день
              </Button>
            </div>
          )}

          {/* Числа месяца */}
          {mode === 'month' && (
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                {DAYS_OF_MONTH.map(day => (
                  <Button
                    key={day}
                    type="button"
                    variant={selectedDaysOfMonth.includes(day) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleDayOfMonth(day)}
                    className={`w-10 ${day === todayDate ? 'border-primary' : ''}`}
                  >
                    {day}
                  </Button>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setSelectedDaysOfMonth(DAYS_OF_MONTH)}
              >
                Каждый день месяца
              </Button>
            </div>
          )}

          {/* Цель и задача */}
          <div className="space-y-2">
            <Label htmlFor="reminder-goal">Привязать к цели (необязательно)</Label>
            <Select value={goalId} onValueChange={(value) => {
              setGoalId(value);
              setTaskId("");
            }}>
              <SelectTrigger id="reminder-goal">
                <SelectValue placeholder="Выберите цель"/>
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
                  <SelectValue placeholder="Выберите задачу"/>
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
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Отмена
          </Button>
          <Button
            onClick={handleSave}
            disabled={!title || !time || (selectedDays.length === 0 && selectedDaysOfMonth.length === 0)}
          >
            {reminder ? "Сохранить" : "Создать напоминание"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
