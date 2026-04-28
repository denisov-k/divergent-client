import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DatePickerInput } from "@/components/ui/date-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TaskItem } from "@/components/shared/TaskItem";
import { Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";

import type { CategoryType } from "@/shared/domain";
import type { GoalFormData, Goal, CategoryOption, Task, Reward, GoalPeriod, GoalType } from "@/types";

interface GoalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: GoalFormData) => void;
  onDelete: (id: string) => void;
  goal?: Goal;
  categories: CategoryOption[];
  rewards: Reward[];
  onAddCategory: (category: CategoryOption) => void;
}

export function GoalDialog({
  open,
  onOpenChange,
  onSave,
  onDelete,
  goal,
  categories,
  rewards,
  onAddCategory: onAddCategoryProp,
}: GoalDialogProps) {
  const { t } = useTranslation();
  const [title, setTitle] = useState(goal?.title || "");
  const [description, setDescription] = useState(goal?.description || "");
  const [category, setCategory] = useState<CategoryType>(goal?.category || "personal");
  const [dueDate, setDueDate] = useState<Date | undefined>(goal?.dueDate ? new Date(goal.dueDate) : undefined);
  const [tasks, setTasks] = useState<Task[]>(goal?.tasks || []);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [rewardId, setRewardId] = useState(rewards.find((r) => r.goalId === goal?.id)?.id || "none");
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [expandedTasks, setExpandedTasks] = useState<Record<string, boolean>>({});
  const [newSubTaskTitles, setNewSubTaskTitles] = useState<Record<string, string>>({});
  const [newSubTaskXps, setNewSubTaskXps] = useState<Record<string, string>>({});
  const [goalType, setGoalType] = useState<GoalType>(goal?.goalType || "TASK");
  const [goalPeriod, setGoalPeriod] = useState<GoalPeriod>(goal?.goalPeriod || "NONE");
  const [numericTarget, setNumericTarget] = useState(goal?.targetValue?.toString() || "");
  const [numericCurrent, setNumericCurrent] = useState(goal?.currentValue?.toString() || "");

  useEffect(() => {
    if (goal) {
      setTitle(goal.title || "");
      setDescription(goal.description || "");
      setCategory(goal.category || "personal");
      setDueDate(goal.dueDate ? new Date(goal.dueDate) : undefined);
      setGoalType(goal.goalType || "TASK");
      setGoalPeriod(goal.goalPeriod || "NONE");
      setNumericTarget(goal.targetValue !== undefined && goal.targetValue !== null ? goal.targetValue.toString() : "");
      setNumericCurrent(goal.currentValue !== undefined && goal.currentValue !== null ? goal.currentValue.toString() : "");
      setTasks(goal.tasks || []);
      setRewardId(rewards.find((r) => r.goalId === goal.id)?.id || "none");
    } else {
      resetForm();
    }
  }, [goal, open, rewards]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCategory("personal");
    setDueDate(undefined);
    setTasks([]);
    setRewardId("none");
    setGoalType("TASK");
    setGoalPeriod("NONE");
    setNumericTarget("");
    setNumericCurrent("");
    setNewTaskTitle("");
    setIsCreatingCategory(false);
    setNewCategoryName("");
    setExpandedTasks({});
    setNewSubTaskTitles({});
    setNewSubTaskXps({});
  };

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;
    const value = newCategoryName.toLowerCase().replace(/\s+/g, "-");
    const newCategory = { value, label: newCategoryName };
    onAddCategoryProp(newCategory);
    setCategory(value);
    setNewCategoryName("");
    setIsCreatingCategory(false);
  };

  const generateId = () => Date.now().toString() + Math.random().toString(36).slice(2, 7);

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;

    const newTask: Task = {
      id: generateId(),
      title: newTaskTitle,
      lastCompletedAt: "",
      parentId: null,
      subtasks: [],
    };

    setTasks([...tasks, newTask]);
    setNewTaskTitle("");
  };

  function addSubtaskRecursive(currentTasks: Task[], parentId: string, subtask: Task): Task[] {
    return currentTasks.map((task) => {
      if (task.id === parentId) {
        return {
          ...task,
          subtasks: [...(task.subtasks || []), subtask],
        };
      }

      if (task.subtasks?.length) {
        return {
          ...task,
          subtasks: addSubtaskRecursive(task.subtasks, parentId, subtask),
        };
      }

      return task;
    });
  }

  const handleAddSubTask = (parentId: string) => {
    const subtaskTitle = newSubTaskTitles[parentId];
    if (!subtaskTitle?.trim()) return;

    const newSubTask: Task = {
      id: generateId(),
      title: subtaskTitle,
      lastCompletedAt: "",
      parentId,
      subtasks: [],
    };

    setTasks((prev) => addSubtaskRecursive(prev, parentId, newSubTask));
    setExpandedTasks((prev) => ({ ...prev, [parentId]: true }));
    setNewSubTaskTitles((prev) => ({ ...prev, [parentId]: "" }));
    setNewSubTaskXps((prev) => ({ ...prev, [parentId]: "" }));
  };

  function removeTaskRecursive(currentTasks: Task[], idToRemove: string): Task[] {
    return currentTasks
      .filter((task) => task.id !== idToRemove)
      .map((task) => ({
        ...task,
        subtasks: task.subtasks ? removeTaskRecursive(task.subtasks, idToRemove) : [],
      }));
  }

  const handleRemoveTask = (id: string) => {
    setTasks((prev) => removeTaskRecursive(prev, id));
  };

  function toggleTaskRecursive(currentTasks: Task[], taskId: string): Task[] {
    return currentTasks.map((task) => {
      if (task.id === taskId) {
        return {
          ...task,
          lastCompletedAt: task.lastCompletedAt ? "" : new Date().toISOString(),
        };
      }

      if (task.subtasks?.length) {
        return {
          ...task,
          subtasks: toggleTaskRecursive(task.subtasks, taskId),
        };
      }

      return task;
    });
  }

  const handleToggleTask = (id: string) => {
    setTasks((prev) => toggleTaskRecursive(prev, id));
  };

  const toggleExpand = (id: string) => {
    setExpandedTasks({ ...expandedTasks, [id]: !expandedTasks[id] });
  };

  const handleSave = () => {
    const goalData: GoalFormData = {
      id: goal?.id || Date.now().toString(),
      title,
      description,
      category,
      goalType,
      goalPeriod,
      tasks: goalType === "TASK" ? tasks : [],
      targetValue: goalType === "PROGRESS" && numericTarget ? parseInt(numericTarget, 10) : undefined,
      currentValue: goalType === "PROGRESS" && numericCurrent ? parseInt(numericCurrent, 10) : undefined,
      dueDate: dueDate
        ? dueDate.getFullYear() + "-" + String(dueDate.getMonth() + 1).padStart(2, "0") + "-" + String(dueDate.getDate()).padStart(2, "0")
        : undefined,
      rewardId: rewardId === "none" ? null : rewardId,
    };

    onSave(goalData);
    handleClose();
  };

  const handleClose = () => {
    if (!goal) {
      resetForm();
    }
    onOpenChange(false);
  };

  const handleDelete = (id: string) => {
    onDelete(id);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) handleClose();
        else onOpenChange(true);
      }}
    >
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{goal ? t("goals.dialog.edit_title") : t("goals.dialog.create_title")}</DialogTitle>
          <DialogDescription>{t("goals.dialog.description")}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">{t("goals.dialog.title_label")}</Label>
            <Input
              id="title"
              placeholder={t("goals.dialog.title_placeholder")}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{t("goals.dialog.description_label")}</Label>
            <Textarea
              id="description"
              placeholder={t("goals.dialog.description_placeholder")}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t("goals.dialog.period_label")}</Label>
              <Select value={goalPeriod} onValueChange={(v: GoalPeriod) => setGoalPeriod(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NONE">{t("goals.dialog.period_none")}</SelectItem>
                  <SelectItem value="DAILY">{t("goals.dialog.period_day")}</SelectItem>
                  <SelectItem value="WEEKLY">{t("goals.dialog.period_week")}</SelectItem>
                  <SelectItem value="MONTHLY">{t("goals.dialog.period_month")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">{t("goals.dialog.due_date_label")}</Label>
              <DatePickerInput value={dueDate} onChange={setDueDate} />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="category">{t("goals.dialog.category_label")}</Label>
              {!isCreatingCategory ? (
                <Button variant="link" className="h-auto p-0 text-xs" onClick={() => setIsCreatingCategory(true)}>
                  {t("goals.dialog.create_category")}
                </Button>
              ) : (
                <Button variant="link" className="h-auto p-0 text-xs" onClick={() => setIsCreatingCategory(false)}>
                  {t("goals.dialog.cancel_category")}
                </Button>
              )}
            </div>

            {isCreatingCategory ? (
              <div className="flex gap-2">
                <Input
                  placeholder={t("goals.dialog.category_placeholder")}
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                />
                <Button type="button" onClick={handleAddCategory} disabled={!newCategoryName.trim()}>
                  OK
                </Button>
              </div>
            ) : (
              <Select value={category} onValueChange={(value) => setCategory(value)}>
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="space-y-2">
            <Label>{t("goals.dialog.goal_type_label")}</Label>
            <Select value={goalType} onValueChange={(v: GoalType) => setGoalType(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TASK">{t("goals.dialog.goal_type_tasks")}</SelectItem>
                <SelectItem value="PROGRESS">{t("goals.dialog.goal_type_progress")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reward">{t("goals.dialog.reward_label")}</Label>
            <Select value={rewardId} onValueChange={(value) => setRewardId(value)}>
              <SelectTrigger id="reward">
                <SelectValue placeholder={t("goals.dialog.reward_placeholder")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">{t("common.no_reward")}</SelectItem>
                {rewards.map((reward) => (
                  <SelectItem key={reward.id} value={reward.id}>
                    {reward.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {goalType === "PROGRESS" && (
            <div className="space-y-2">
              <Label>{t("goals.dialog.current_progress")}</Label>
              <Input type="number" min={0} value={numericCurrent} onChange={(e) => setNumericCurrent(e.target.value)} />

              <Label>{t("goals.dialog.target_value")}</Label>
              <Input type="number" min={1} value={numericTarget} onChange={(e) => setNumericTarget(e.target.value)} />
            </div>
          )}

          {goalType === "TASK" && (
            <div className="space-y-3">
              <Label>{t("goals.dialog.tasks_label")}</Label>

              {tasks.map((task) => (
                <TaskItem
                  key={task.id}
                  id={task.id}
                  title={task.title}
                  lastCompletedAt={task.lastCompletedAt}
                  editMode
                  xpReward={task.xpReward}
                  dueDate={task.dueDate}
                  subtasks={task.subtasks}
                  expanded={expandedTasks[task.id]}
                  onToggle={handleToggleTask}
                  onRemove={handleRemoveTask}
                  onToggleExpand={toggleExpand}
                  newSubTaskTitles={newSubTaskTitles}
                  newSubTaskXps={newSubTaskXps}
                  setNewSubTaskTitles={setNewSubTaskTitles}
                  setNewSubTaskXps={setNewSubTaskXps}
                  handleAddSubTask={handleAddSubTask}
                  goalPeriod={goalPeriod ?? "NONE"}
                />
              ))}

              <div className="mt-2 flex gap-2">
                <Input
                  placeholder={t("goals.dialog.task_placeholder")}
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTask();
                    }
                  }}
                />
                <Button type="button" onClick={() => handleAddTask()} size="icon">
                  <Plus className="size-4" />
                </Button>
              </div>

              {tasks.length === 0 && <p className="py-4 text-center text-muted-foreground">{t("goals.dialog.empty_tasks")}</p>}
            </div>
          )}
        </div>

        <DialogFooter>
          {goal && (
            <Button variant="destructive" onClick={() => handleDelete(goal.id)}>
              {t("common.delete")}
            </Button>
          )}
          <Button variant="outline" onClick={handleClose}>
            {t("common.cancel")}
          </Button>
          <Button onClick={handleSave} disabled={!title}>
            {goal ? t("common.save") : t("common.create")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

