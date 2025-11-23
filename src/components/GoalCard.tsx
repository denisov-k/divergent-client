import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { CategoryBadge } from "./CategoryBadge";
import { ProgressRing } from "./ProgressRing";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Calendar, Target, Edit, ChevronDown, ChevronUp } from "lucide-react";
import { TaskItem } from "./TaskItem";
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";

export type CategoryType = string;

interface Task {
  id: string;
  title: string;
  completed: boolean;
  xpReward?: number;
  dueDate?: string;
}

interface GoalCardProps {
  id: string;
  title: string;
  description?: string;
  category: CategoryType;
  categoryLabel: string;
  tasks: Task[];
  dueDate?: string;
  xpReward?: number;
  variant?: "compact" | "detailed";
  onEdit?: (id: string) => void;
  onTaskToggle?: (goalId: string, taskId: string) => void;
}

export function GoalCard({
  id,
  title,
  description,
  category,
  categoryLabel,
  tasks,
  dueDate,
  xpReward,
  variant = "detailed",
  onEdit,
  onTaskToggle,
}: GoalCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const completedTasks = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  if (variant === "compact") {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <CardTitle className="line-clamp-1">{title}</CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <CategoryBadge category={category} label={categoryLabel} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ProgressRing progress={progress} size={50} strokeWidth={4} />
              {onEdit && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(id)}
                  className="shrink-0"
                >
                  <Edit className="size-4" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">
              {completedTasks} / {totalTasks} задач
            </span>
            {xpReward && (
              <Badge variant="secondary">+{xpReward} XP</Badge>
            )}
          </div>
          {dueDate && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="size-4" />
              <span>{dueDate}</span>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-center gap-2">
              <Target className="size-5 text-primary" />
              <CategoryBadge category={category} label={categoryLabel} />
            </div>
            <CardTitle>{title}</CardTitle>
            {description && (
              <CardDescription>{description}</CardDescription>
            )}
          </div>
          <div className="flex items-center gap-2">
            <ProgressRing progress={progress} size={70} strokeWidth={6} />
            {onEdit && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(id)}
              >
                <Edit className="size-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-muted-foreground">Прогресс выполнения</span>
            <span className="text-muted-foreground">
              {completedTasks} / {totalTasks} задач
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              <span>Задачи цели</span>
              {isOpen ? (
                <ChevronUp className="size-4" />
              ) : (
                <ChevronDown className="size-4" />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 mt-3">
            {tasks.map((task) => (
              <TaskItem
                key={task.id}
                {...task}
                onToggle={() => onTaskToggle?.(id, task.id)}
              />
            ))}
          </CollapsibleContent>
        </Collapsible>
        
        <div className="flex items-center justify-between pt-2 border-t">
          {dueDate && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="size-4" />
              <span>{dueDate}</span>
            </div>
          )}
          {xpReward && (
            <Badge>При выполнении: +{xpReward} XP</Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
