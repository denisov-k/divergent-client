import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { CategoryBadge } from "./CategoryBadge";
import { ProgressRing } from "./ProgressRing";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Calendar, Target, Edit, ChevronDown, ChevronUp, AlarmClock } from "lucide-react";
import { TaskItem } from "./TaskItem";
import {useEffect, useRef, useState} from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import {useTranslation} from "react-i18next";

import {Challenge, GoalPeriod, GoalType, Reward, Task} from "@/types";
import {useNavigate} from "react-router-dom";

export type CategoryType = string;


interface GoalCardProps {
  id: string;
  title: string;
  description?: string;
  category: CategoryType;
  categoryLabel: string;

  goalType?: GoalType;
  goalPeriod?: GoalPeriod;
  challenge?: Challenge;

  currentValue?: number;
  targetValue?: number;

  tasks?: Task[];
  dueDate?: string;
  xpReward?: number;
  reward?: Reward | null;
  editMode?: boolean;
  onEdit?: (id: string) => void;
  onTaskToggle?: (goalId: string, taskId: string, parentId?: string) => void;
  onAddReminder?: (id: string) => void;
  onAddProgress?: (goalId: string, delta: number) => void;
  autoExpand?: boolean;
}

export function GoalCard({
                           id,
                           title,
                           description,
                           category,
                           categoryLabel,
                           tasks,
                           challenge,
                           goalType,
                           goalPeriod,
                           currentValue,
                           targetValue,
                           dueDate,
                           xpReward,
                           reward,
                           editMode = false,
                           onEdit,
                           onTaskToggle,
                           onAddReminder,
                           onAddProgress,
                            autoExpand
                         }: GoalCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedTasks, setExpandedTasks] = useState<Record<string, boolean>>({});
  const [newSubTaskTitles, setNewSubTaskTitles] = useState<Record<string, string>>({});
  const [newSubTaskXps, setNewSubTaskXps] = useState<Record<string, string>>({});
  const [progressDelta, setProgressDelta] = useState<number>();

  const navigate = useNavigate();

  const isFromChallenge = Boolean(challenge);

  const { t } = useTranslation();

  const safeTasks = tasks ?? [];

  function countTasks(tasks?: Task[]): number {
    if (!tasks || tasks.length === 0) return 0;
    return tasks.reduce((sum, t) => sum + 1 + countTasks(t.subtasks), 0);
  }

  function countCompleted(tasks?: Task[]): number {
    if (!tasks || tasks.length === 0) return 0;
    return tasks.reduce((sum, t) => sum + (t.lastCompletedAt ? 1 : 0) + countCompleted(t.subtasks), 0);
  }

  const isNumeric = goalType === "PROGRESS";

  const totalTasks = countTasks(safeTasks);
  const completedTasks = countCompleted(safeTasks);

  const progress = isNumeric
    ? targetValue && targetValue > 0
      ? Math.min(((currentValue ?? 0) / targetValue) * 100, 100)
      : 0
    : totalTasks > 0
      ? (completedTasks / totalTasks) * 100
      : 0;

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
        goalPeriod={goalPeriod ?? "NONE"}
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

  const [highlight, setHighlight] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!autoExpand) return;

    // Открываем задачи, если цель типа TASK
    if (goalType === "TASK") {
      setIsOpen(true);
    }

    // Скроллим к карточке
    if (cardRef.current) {
      cardRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      // Включаем подсветку
      setHighlight(true);

      const timeout = setTimeout(() => setHighlight(false), 2000); // подсветка 2 сек
      return () => clearTimeout(timeout);
    }
  }, [autoExpand, goalType]);

  return (
    <Card className={`hover:shadow-md transition-all
      ${ highlight ? "bg-blue-50": "bg-white"}`}
          ref={cardRef}>
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
              {onEdit && !isFromChallenge && <Button variant="ghost" size="icon" onClick={() => onEdit(id)}><Edit className="size-4" /></Button>}
              {onAddReminder && <Button variant="ghost" size="icon" onClick={() => onAddReminder(id)} className="shrink-0" title="Создать напоминание"><AlarmClock className="size-4" /></Button>}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-muted-foreground">{t('goals.progress')}</span>
            {goalType === "TASK" && (
              <span className="text-muted-foreground">
                {completedTasks} / {totalTasks} {t('goals.tasks_count')}
              </span>
            )}
            {goalType === "PROGRESS" && (
              <span className="text-muted-foreground">
                {currentValue ?? 0} / {targetValue ?? 0}
              </span>
            )}
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {goalType === "PROGRESS" && (
          <div className="flex items-center gap-2 mt-2">
            <input
              type="number"
              className="border rounded px-2 py-1 w-full text-sm"
              value={progressDelta}
              onChange={(e) => setProgressDelta(Number(e.target.value))}
              placeholder="Добавить значение"
              min={0}
            />
            <Button
              size="sm"
              onClick={() => {
                if (progressDelta !== 0) {
                  onAddProgress?.(id, progressDelta!);
                  setProgressDelta(0);
                }
              }}
            >
              +
            </Button>
          </div>
        )}

        {goalType === "TASK" && (
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                <span>{t('goals.tasks')}</span>
                {isOpen ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2 mt-2">
              {renderTasks(safeTasks)}
            </CollapsibleContent>
          </Collapsible>
        )}

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex gap-2 flex-col">
            {goalPeriod !== "NONE" && (
              <Badge variant="outline">
                {goalPeriod === "DAILY" && "Ежедневная"}
                {goalPeriod === "WEEKLY" && "Еженедельная"}
                {goalPeriod === "MONTHLY" && "Ежемесячная"}
              </Badge>
            )}
            {isFromChallenge && challenge && (
              <Badge
                className="cursor-pointer bg-primary text-white hover:bg-primary/80"
                onClick={() => navigate({
                  pathname: "/challenges",
                  search: `?id=${challenge.id}`,
                })}
                title="Перейти к челленджу"
              >
                Челлендж: {challenge.title}
              </Badge>
            )}

            {dueDate && (
              <div className="flex items-center gap-2 text-muted-foreground mr-4">
                <Calendar className="size-4" />
                <span className="whitespace-nowrap">{new Date(dueDate).toISOString().split('T')[0]}</span>
              </div>
            )}
          </div>
          {(xpReward || reward) && (
            <div className="flex items-center flex-wrap justify-end mb-auto">
              <span className="mr-1">Награда: </span>
              <div className="flex flex-wrap justify-center">
                {reward && (
                  <Badge
                    className="mr-1 my-0.5 bg-purple-600 cursor-pointer hover:bg-purple-500"
                    onClick={() => navigate({
                      pathname: "/rewards",
                      search: `?id=${reward.id}`,
                    })}
                    title="Перейти к награде"
                  >
                    {reward.title}
                  </Badge>
                )}
                {xpReward && <Badge className="my-0.5">+{xpReward} XP</Badge>}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
    );
  }
