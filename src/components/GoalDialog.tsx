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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { TaskItem } from "./TaskItem";
import { Plus } from "lucide-react";
import { Separator } from "./ui/separator";

import { type CategoryType } from "@/components/GoalCard";
import { Reward } from "@/components/RewardDialog";

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  xpReward?: number;
  dueDate?: string;
  subtasks?: Task[];
  expanded?: boolean;
  parentId?: string | null;
}

export interface Goal {
  id: string;
  title: string;
  description?: string;
  category: CategoryType;
  categoryLabel: string;
  tasks: Task[];
  dueDate?: string;
  xpReward?: number;
}

export interface GoalFormData extends Goal {
  rewardId?: string | null;
}

export interface CategoryOption {
  value: string;
  label: string;
}

interface GoalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: GoalFormData) => void;
  goal?: Goal;
  categories: CategoryOption[];
  rewards: Reward[];
  onAddCategory: (category: CategoryOption) => void;
}

export function GoalDialog({
                             open,
                             onOpenChange,
                             onSave,
                             goal,
                             categories,
                             rewards,
                             onAddCategory: onAddCategoryProp,
                           }: GoalDialogProps) {
  const [title, setTitle] = useState(goal?.title || "");
  const [description, setDescription] = useState(goal?.description || "");
  const [category, setCategory] = useState<CategoryType>(goal?.category || "personal");
  const [dueDate, setDueDate] = useState(toInputDate(goal?.dueDate));
  const [xpReward, setXpReward] = useState(goal?.xpReward?.toString() || "");
  const [tasks, setTasks] = useState<Task[]>(goal?.tasks || []);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskXp, setNewTaskXp] = useState("");
  const [rewardId, setRewardId] = useState(
    rewards.find((r) => r.goalId === goal?.id)?.id || "none"
  );

  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [expandedTasks, setExpandedTasks] = useState<Record<string, boolean>>({});

  const [newSubTaskTitles, setNewSubTaskTitles] = useState<Record<string, string>>({});
  const [newSubTaskXps, setNewSubTaskXps] = useState<Record<string, string>>({});

  useEffect(() => {
    if (goal) {
      setTitle(goal.title || "");
      setDescription(goal.description || "");
      setCategory(goal.category || "personal");
      setDueDate(toInputDate(goal.dueDate));
      setXpReward(goal.xpReward?.toString() || "");
      setTasks(goal.tasks || []);
      setRewardId(rewards.find((r) => r.goalId === goal?.id)?.id || "none");
    } else {
      setTitle("");
      setDescription("");
      setCategory("personal");
      setDueDate("");
      setXpReward("");
      setTasks([]);
      setRewardId("none");
      setExpandedTasks({});
      setNewSubTaskTitles({});
      setNewSubTaskXps({});
    }
  }, [goal, open]);

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
      completed: false,
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
      completed: false,
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

  const handleToggleTask = (id: string, parentId?: string) => {
    if (parentId) {
      setTasks(
        tasks.map((t) =>
          t.id === parentId
            ? {
              ...t,
              subtasks: t.subtasks?.map((st) =>
                st.id === id ? { ...st, completed: !st.completed } : st
              ),
            }
            : t
        )
      );
    } else {
      setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)));
    }
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
      tasks,
      dueDate: dueDate || undefined,
      xpReward: xpReward ? parseInt(xpReward) : undefined,
      rewardId: rewardId === "none" ? null : rewardId,
    };

    onSave(goalData);
    handleClose();
  };

  const handleClose = () => {
    if (!goal) {
      setTitle("");
      setDescription("");
      setCategory("personal");
      setDueDate("");
      setXpReward("");
      setTasks([]);
      setNewTaskTitle("");
      setNewTaskXp("");
      setIsCreatingCategory(false);
      setNewCategoryName("");
      setExpandedTasks({});
      setNewSubTaskTitles({});
      setNewSubTaskXps({});
    }
    onOpenChange(false);
  };

  function toInputDate(value?: string | null) {
    if (!value) return "";
    return value.split("T")[0]; // YYYY-MM-DD
  }

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
              <Label htmlFor="dueDate">Срок выполнения</Label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reward">Награда за цель</Label>
            <Select value={rewardId} onValueChange={(value) => setRewardId(value)}>
              <SelectTrigger id="reward">
                <SelectValue placeholder="Выберите награду" />
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

          <div className="space-y-2">
            <Label htmlFor="xpReward">Награда за цель (XP)</Label>
            <Input
              id="xpReward"
              type="number"
              min={0}
              placeholder="1000"
              value={xpReward}
              onChange={(e) => setXpReward(e.target.value)}
            />
          </div>

          <Separator />

          <div className="space-y-3">
            <Label>Задачи для достижения цели</Label>

            {tasks.map((task) => (
              <TaskItem
                key={task.id}
                id={task.id}
                title={task.title}
                completed={task.completed}
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
                <Plus className="size-4" />
              </Button>
            </div>

            {tasks.length === 0 && (
              <p className="text-muted-foreground text-center py-4">
                Добавьте задачи для вашей цели
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Отмена
          </Button>
          <Button onClick={handleSave} disabled={!title || tasks.length === 0}>
            {goal ? "Сохранить" : "Создать цель"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
