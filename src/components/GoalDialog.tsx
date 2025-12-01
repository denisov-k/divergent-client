import {useEffect, useState} from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { TaskItem } from "./TaskItem";
import { Plus, X } from "lucide-react";
import { Separator } from "./ui/separator";

import { type CategoryType } from "@/components/GoalCard.tsx";
import { Reward } from "@/components/RewardDialog.tsx";

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  xpReward?: number;
  dueDate?: string;
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

export function GoalDialog({ open, onOpenChange, onSave, goal, categories, rewards, onAddCategory }: GoalDialogProps) {
  const [title, setTitle] = useState(goal?.title || "");
  const [description, setDescription] = useState(goal?.description || "");
  const [category, setCategory] = useState<CategoryType>(goal?.category || "personal");
  const [dueDate, setDueDate] = useState(goal?.dueDate || "");
  const [xpReward, setXpReward] = useState(goal?.xpReward?.toString() || "");
  const [tasks, setTasks] = useState<Task[]>(goal?.tasks || []);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskXp, setNewTaskXp] = useState("");
  const [rewardId, setRewardId] = useState(
    rewards.find(r => r.goalId === goal?.id)?.id || "none"
  );

  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  useEffect(() => {
    if (goal) {
      setTitle(goal.title || "");
      setDescription(goal.description || "");
      setCategory(goal.category || "personal");
      setDueDate(goal.dueDate || "");
      setXpReward(goal.xpReward?.toString() || "");
      setTasks(goal.tasks || []);
      setRewardId(rewards.find(r => r.goalId === goal?.id)?.id || "none");
    } else {
      // режим создания — очищаем форму
      setTitle("");
      setDescription("");
      setCategory("personal");
      setDueDate("");
      setXpReward("");
      setTasks([]);
      setRewardId("");
    }
  }, [goal, open]);

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;

    const value = newCategoryName.toLowerCase().replace(/\s+/g, "-");
    const newCategory = { value, label: newCategoryName };

    onAddCategory(newCategory);
    setCategory(value);
    setNewCategoryName("");
    setIsCreatingCategory(false);
  };

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;

    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      completed: false,
      xpReward: newTaskXp ? parseInt(newTaskXp) : undefined,
    };

    setTasks([...tasks, newTask]);
    setNewTaskTitle("");
    setNewTaskXp("");
  };

  const handleRemoveTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const handleToggleTask = (id: string) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleSave = () => {
    const categoryLabel = categories.find(opt => opt.value === category)?.label || category;

    const goalData: GoalFormData = {
      id: goal?.id || Date.now().toString(),
      title,
      description,
      category,
      categoryLabel,
      tasks,
      dueDate: dueDate || undefined,
      xpReward: xpReward ? parseInt(xpReward) : undefined,
      rewardId: rewardId === "none" ? null : rewardId, // <-- ВАЖНО
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
    }
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) handleClose(); // закрытие
        else onOpenChange(true);   // открытие
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
            <Button
              variant="link"
              className="h-auto p-0 text-xs flex mr-0 ml-auto"
              onClick={() => {}}
            >
              Узнать у ИИ, как достичь цели
            </Button>
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
                  <Button type="button" onClick={handleAddCategory} disabled={!newCategoryName.trim()}>
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

          <Separator/>

          <div className="space-y-3">
            <Label>Задачи для достижения цели</Label>

            <div className="flex gap-2">
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
              <Button type="button" onClick={handleAddTask} size="icon">
                <Plus className="size-4"/>
              </Button>
            </div>

            {tasks.length > 0 && (
              <div className="">
                {tasks.map((task) => (
                  <div key={task.id} className="flex items-center gap-2 my-2">
                    <div className="flex-1">
                      <TaskItem
                        {...task}
                        onToggle={handleToggleTask}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveTask(task.id)}
                    >
                      <X className="size-4"/>
                    </Button>
                  </div>
                ))}
              </div>
            )}

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
