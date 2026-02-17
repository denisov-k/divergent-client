import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { DatePickerInput } from "./ui/date-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { TaskItem } from "./TaskItem";
import { Plus } from "lucide-react";
import { Separator } from "./ui/separator";

import { type CategoryType } from "@/components/GoalCard";
import {useTranslation} from "react-i18next";
import {GoalFormData, Goal, CategoryOption, Task, Reward, GoalPeriod, GoalType} from "@/types";


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
  const [title, setTitle] = useState(goal?.title || "");
  const [description, setDescription] = useState(goal?.description || "");
  const [category, setCategory] = useState<CategoryType>(goal?.category || "personal");
  const [dueDate, setDueDate] = useState<Date | undefined>(
    goal?.dueDate ? new Date(goal.dueDate) : undefined
  );
  const [xpReward, setXpReward] = useState(goal?.xpReward?.toString() || "");
  const [tasks, setTasks] = useState<Task[]>(goal?.tasks || []);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskXp, setNewTaskXp] = useState("");
  const [rewardId, setRewardId] = useState(
    rewards.find((r) => r.goalId === goal?.id)?.id || "none"
  );

  const { t } = useTranslation();

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
      setXpReward(goal.xpReward?.toString() || "");

      setGoalType(goal.goalType || "TASK");
      setGoalPeriod(goal.goalPeriod || "NONE");

      setNumericTarget(
        goal.targetValue !== undefined && goal.targetValue !== null
          ? goal.targetValue.toString()
          : ""
      );

      setNumericCurrent(
        goal.currentValue !== undefined && goal.currentValue !== null
          ? goal.currentValue.toString()
          : ""
      );

      setTasks(goal.tasks || []);
      setRewardId(
        rewards.find((r) => r.goalId === goal.id)?.id || "none"
      );
    } else {
      resetForm();
    }
  }, [goal, open, rewards]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCategory("personal");
    setDueDate(undefined);
    setXpReward("");
    setTasks([]);
    setRewardId("none");

    setGoalType("TASK");
    setGoalPeriod("NONE");
    setNumericTarget("");
    setNumericCurrent("");

    setNewTaskTitle("");
    setNewTaskXp("");
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

  const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 5);


  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;

    const newTask: Task = {
      id: generateId(),
      title: newTaskTitle,
      lastCompletedAt: "",
      xpReward: newTaskXp ? parseInt(newTaskXp) : undefined,
      parentId: null,
      subtasks: [],
    };

    setTasks([...tasks, newTask]);
    setNewTaskTitle("");
    setNewTaskXp("");
  };

  function addSubtaskRecursive(tasks: Task[], parentId: string, subtask: Task): Task[] {
    return tasks.map(task => {
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
    const title = newSubTaskTitles[parentId];
    if (!title?.trim()) return;

    const xp = newSubTaskXps[parentId]
      ? parseInt(newSubTaskXps[parentId])
      : undefined;

    const newSubTask: Task = {
      id: generateId(),
      title,
      lastCompletedAt: "",
      xpReward: xp,
      parentId,
      subtasks: [],
    };

    setTasks(prev =>
      addSubtaskRecursive(prev, parentId, newSubTask)
    );

    setExpandedTasks(prev => ({ ...prev, [parentId]: true }));
    setNewSubTaskTitles(prev => ({ ...prev, [parentId]: "" }));
    setNewSubTaskXps(prev => ({ ...prev, [parentId]: "" }));
  };

  function removeTaskRecursive(tasks: Task[], idToRemove: string): Task[] {
    return tasks
      .filter((task) => task.id !== idToRemove)
      .map((task) => ({
        ...task,
        subtasks: task.subtasks ? removeTaskRecursive(task.subtasks, idToRemove) : [],
      }));
  }

  const handleRemoveTask = (id: string) => {
    setTasks((prev) => removeTaskRecursive(prev, id));
  };

  function toggleTaskRecursive(tasks: Task[], taskId: string): Task[] {
    return tasks.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          lastCompletedAt: task.lastCompletedAt
            ? "" // снять отметку
            : new Date().toISOString(), // поставить отметку сейчас
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
    setTasks(prev => toggleTaskRecursive(prev, id));
  };

  const toggleExpand = (id: string) => {
    setExpandedTasks({ ...expandedTasks, [id]: !expandedTasks[id] });
  };

  const handleSave = () => {
    const categoryLabel = categories.find((opt) => opt.value === category)?.label || category;

    const goalData: GoalFormData = {
      id: goal?.id || Date.now().toString(),
      title,
      description,
      category,
      categoryLabel,
      goalType,
      goalPeriod,
      tasks: goalType === "TASK" ? tasks : [],

      targetValue:
        goalType === "PROGRESS" && numericTarget
          ? parseInt(numericTarget)
          : undefined,

      currentValue:
        goalType === "PROGRESS" && numericCurrent
          ? parseInt(numericCurrent)
          : undefined,
      dueDate: dueDate
        ? dueDate.getFullYear() + "-" +
        String(dueDate.getMonth() + 1).padStart(2, "0") + "-" +
        String(dueDate.getDate()).padStart(2, "0")
        : undefined,
      xpReward: xpReward ? parseInt(xpReward) : undefined,
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
          <DialogTitle>{goal ? "Редактировать цель" : "Создать новую цель"}</DialogTitle>
          <DialogDescription>
            Заполните информацию о цели и добавьте задачи для её достижения
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Название цели *</Label>
            <Input
              id="title"
              placeholder="Например: Прочитать 12 книг за год"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Описание</Label>
            <Textarea
              id="description"
              placeholder="Опишите вашу цель подробнее..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Период</Label>
              <Select value={goalPeriod} onValueChange={(v: GoalPeriod) => setGoalPeriod(v)}>
                <SelectTrigger>
                  <SelectValue/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NONE">Нет</SelectItem>
                  <SelectItem value="DAILY">День</SelectItem>
                  <SelectItem value="WEEKLY">Неделя</SelectItem>
                  <SelectItem value="MONTHLY">Месяц</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">Срок выполнения</Label>
              <DatePickerInput
                value={dueDate}
                onChange={setDueDate}
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="category">Категория *</Label>
              {!isCreatingCategory ? (
                <Button
                  variant="link"
                  className="h-auto p-0 text-xs"
                  onClick={() => setIsCreatingCategory(true)}
                >
                  + Создать
                </Button>
              ) : (
                <Button
                  variant="link"
                  className="h-auto p-0 text-xs"
                  onClick={() => setIsCreatingCategory(false)}
                >
                  Отмена
                </Button>
              )}
            </div>

            {isCreatingCategory ? (
              <div className="flex gap-2">
                <Input
                  placeholder="Название категории"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                />
                <Button
                  type="button"
                  onClick={handleAddCategory}
                  disabled={!newCategoryName.trim()}
                >
                  OK
                </Button>
              </div>
            ) : (
              <Select value={category} onValueChange={(value) => setCategory(value)}>
                <SelectTrigger id="category">
                  <SelectValue/>
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
            <Label>Тип цели</Label>
            <Select value={goalType} onValueChange={(v: GoalType) => setGoalType(v)}>
              <SelectTrigger>
                <SelectValue/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TASK">Задачи</SelectItem>
                <SelectItem value="PROGRESS">Числовая цель</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="reward">Награда за цель</Label>
            <Select value={rewardId} onValueChange={(value) => setRewardId(value)}>
              <SelectTrigger id="reward">
                <SelectValue placeholder="Выберите награду"/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Без награды</SelectItem>
                {rewards.map((reward) => (
                  <SelectItem key={reward.id} value={reward.id}>
                    {reward.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/*<div className="space-y-2">
            <Label htmlFor="xpReward">Награда за цель (XP)</Label>
            <Input
              id="xpReward"
              type="number"
              min={0}
              placeholder="1000"
              value={xpReward}
              onChange={(e) => setXpReward(e.target.value)}
            />
          </div>*/}


          <Separator/>

          {goalType === "PROGRESS" && (
            <div className="space-y-2">
              <Label>Текущий прогресс</Label>
              <Input
                type="number"
                min={0}
                value={numericCurrent}
                onChange={(e) => setNumericCurrent(e.target.value)}
              />

              <Label>Целевое значение</Label>
              <Input
                type="number"
                min={1}
                value={numericTarget}
                onChange={(e) => setNumericTarget(e.target.value)}
              />
            </div>
          )}

          {goalType === "TASK" && (<div className="space-y-3">
            <Label>Задачи для достижения цели</Label>

            {tasks.map((task) => (
              <TaskItem
                key={task.id}
                id={task.id}
                title={task.title}
                lastCompletedAt={task.lastCompletedAt}
                editMode={true}
                xpReward={task.xpReward}
                dueDate={task.dueDate}
                subtasks={task.subtasks} // Task[], а не TaskItemProps[]
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

            <div className="flex gap-2 mt-2">
              <Input
                placeholder="Название задачи"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTask();
                  }
                }}
              />
              <Input
                type="number"
                min={0}
                placeholder="XP"
                className="w-24"
                value={newTaskXp}
                onChange={(e) => setNewTaskXp(e.target.value)}
              />
              <Button type="button" onClick={() => handleAddTask()} size="icon">
                <Plus className="size-4"/>
              </Button>
            </div>

            {tasks.length === 0 && (
              <p className="text-muted-foreground text-center py-4">
                Добавьте задачи для вашей цели
              </p>
            )}
          </div>)}
        </div>

        <DialogFooter>
          {goal &&
            <Button variant="destructive" onClick={() => handleDelete(goal!.id)}>
              {t('common.delete')}
            </Button>
          }
          <Button variant="outline" onClick={handleClose}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleSave} disabled={!title}>
            {goal ? t('common.save') : t('common.create')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
