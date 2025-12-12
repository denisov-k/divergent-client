import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { CategoryBadge } from "./CategoryBadge";
import { ProgressRing } from "./ProgressRing";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Calendar, Target, Edit, ChevronDown, ChevronUp, AlarmClock } from "lucide-react";
import { TaskItem } from "./TaskItem";
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import {useTranslation} from "react-i18next";

import {Reward} from "@/types";

export type CategoryType = string;

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  xpReward?: number;
  dueDate?: string;
  subtasks?: Task[];
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
  reward?: Reward | null;
  variant?: "compact" | "detailed";
  editMode?: boolean;
  onEdit?: (id: string) => void;
  onTaskToggle?: (goalId: string, taskId: string, parentId?: string) => void;
  onAddReminder?: (id: string) => void;
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
                           reward,
                           variant = "detailed",
                           editMode = false,
                           onEdit,
                           onTaskToggle,
                           onAddReminder,
                         }: GoalCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedTasks, setExpandedTasks] = useState<Record<string, boolean>>({});
  const [newSubTaskTitles, setNewSubTaskTitles] = useState<Record<string, string>>({});
  const [newSubTaskXps, setNewSubTaskXps] = useState<Record<string, string>>({});

  const { t } = useTranslation();

  function countTasks(tasks?: Task[]): number {
    if (!tasks || tasks.length === 0) return 0;
    return tasks.reduce((sum, t) => sum + 1 + countTasks(t.subtasks), 0);
  }

  function countCompleted(tasks?: Task[]): number {
    if (!tasks || tasks.length === 0) return 0;
    return tasks.reduce((sum, t) => sum + (t.completed ? 1 : 0) + countCompleted(t.subtasks), 0);
  }

  const totalTasks = tasks.length;
  const completedTasks = tasks.reduce((sum, t) => sum + (t.completed ? 1 : 0) + countCompleted(t.subtasks), 0);
  const progress = totalTasks > 0 ? (completedTasks / countTasks(tasks)) * 100 : 0;

  const handleToggleExpand = (taskId: string) => {
    setExpandedTasks({ ...expandedTasks, [taskId]: !expandedTasks[taskId] });
  };

  const handleAddSubTask = (parentId: string) => {
    console.log("Add subtask to", parentId, newSubTaskTitles[parentId], newSubTaskXps[parentId]);
    setNewSubTaskTitles({ ...newSubTaskTitles, [parentId]: "" });
    setNewSubTaskXps({ ...newSubTaskXps, [parentId]: "" });
  };

  const handleRemoveTask = (taskId: string, parentId?: string) => {
    console.log("Remove task", taskId, "parent:", parentId);
  };

  const renderTasks = (tasks: Task[], parentId?: string) => {
    return tasks.map((task) => (
      <TaskItem
        key={task.id}
        {...task}
        parentId={parentId}
        onToggle={(taskId, pId) => onTaskToggle?.(id, taskId, pId)}
        onRemove={handleRemoveTask}
        onToggleExpand={handleToggleExpand}
        newSubTaskTitles={newSubTaskTitles}
        newSubTaskXps={newSubTaskXps}
        setNewSubTaskTitles={setNewSubTaskTitles}
        setNewSubTaskXps={setNewSubTaskXps}
        handleAddSubTask={handleAddSubTask}
        expanded={expandedTasks[task.id]}
        editMode={editMode}
      />
    ));
  };

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
                <Button variant="ghost" size="icon" onClick={() => onEdit(id)} className="shrink-0">
                  <Edit className="size-4" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">{completedTasks} / {countTasks(tasks)} задач</span>
            {xpReward && <Badge variant="secondary">+{xpReward} XP</Badge>}
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
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          <div className="flex items-center gap-2">
            <ProgressRing progress={progress} size={70} strokeWidth={6} />
            <div className="flex flex-col">
              {onEdit && <Button variant="ghost" size="icon" onClick={() => onEdit(id)}><Edit className="size-4" /></Button>}
              {onAddReminder && <Button variant="ghost" size="icon" onClick={() => onAddReminder(id)} className="shrink-0" title="Создать напоминание"><AlarmClock className="size-4" /></Button>}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-muted-foreground">{t('goals.progress')}</span>
            <span className="text-muted-foreground">{completedTasks} / {countTasks(tasks)} {t('goals.tasks_count')}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              <span>{t('goals.tasks')}</span>
              {isOpen ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 mt-3">
            {renderTasks(tasks)}
          </CollapsibleContent>
        </Collapsible>

        <div className="flex items-center justify-between pt-2 border-t">
          {dueDate && (
            <div className="flex items-center gap-2 text-muted-foreground mr-4">
              <Calendar className="size-4" />
              <span className="whitespace-nowrap">{new Date(dueDate).toISOString().split('T')[0]}</span>
            </div>
          )}
          {(xpReward || reward) && (
            <div className="flex items-center flex-wrap justify-center">
              <span className="mr-1">Награда: </span>
              <div className="flex flex-wrap justify-center">
                {reward && <Badge className="mr-1 my-0.5 bg-purple-500">{reward?.title}</Badge>}
                {xpReward && <Badge className="my-0.5">+{xpReward} XP</Badge>}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
