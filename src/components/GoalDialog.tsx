import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { TaskItem } from "./TaskItem";
import { Plus, X } from "lucide-react";
import { Separator } from "./ui/separator";

type CategoryType = "work" | "health" | "learning" | "fitness" | "creative" | "personal";

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

interface GoalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (goal: Goal) => void;
  goal?: Goal;
}

const categoryOptions = [
  { value: "work", label: "Работа" },
  { value: "health", label: "Здоровье" },
  { value: "learning", label: "Обучение" },
  { value: "fitness", label: "Фитнес" },
  { value: "creative", label: "Творчество" },
  { value: "personal", label: "Личное" },
];

export function GoalDialog({ open, onOpenChange, onSave, goal }: GoalDialogProps) {
  const [title, setTitle] = useState(goal?.title || "");
  const [description, setDescription] = useState(goal?.description || "");
  const [category, setCategory] = useState<CategoryType>(goal?.category || "personal");
  const [dueDate, setDueDate] = useState(goal?.dueDate || "");
  const [xpReward, setXpReward] = useState(goal?.xpReward?.toString() || "");
  const [tasks, setTasks] = useState<Task[]>(goal?.tasks || []);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskXp, setNewTaskXp] = useState("");

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
    const categoryLabel = categoryOptions.find(opt => opt.value === category)?.label || "";
    
    const goalData: Goal = {
      id: goal?.id || Date.now().toString(),
      title,
      description,
      category,
      categoryLabel,
      tasks,
      dueDate: dueDate || undefined,
      xpReward: xpReward ? parseInt(xpReward) : undefined,
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
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
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
              <Label htmlFor="category">Категория *</Label>
              <Select value={category} onValueChange={(value) => setCategory(value as CategoryType)}>
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
            <Label htmlFor="xpReward">Награда за цель (XP)</Label>
            <Input
              id="xpReward"
              type="number"
              placeholder="1000"
              value={xpReward}
              onChange={(e) => setXpReward(e.target.value)}
            />
          </div>

          <Separator />

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
                placeholder="XP"
                className="w-24"
                value={newTaskXp}
                onChange={(e) => setNewTaskXp(e.target.value)}
              />
              <Button type="button" onClick={handleAddTask} size="icon">
                <Plus className="size-4" />
              </Button>
            </div>

            {tasks.length > 0 && (
              <div className="space-y-2 border rounded-lg p-3">
                {tasks.map((task) => (
                  <div key={task.id} className="flex items-center gap-2">
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
                      <X className="size-4" />
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
