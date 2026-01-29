import { Checkbox } from "./ui/checkbox";
import { Badge } from "./ui/badge";
import { Calendar, ChevronDown, ChevronRight, Plus, X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import React, { useState } from "react";
import { Task } from "@/types";

import { startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";

function isTaskDoneForPeriod(task: { lastCompletedAt?: string }, goalPeriod: string) {
  if (!task.lastCompletedAt) return false;

  const last = new Date(task.lastCompletedAt!);

  switch(goalPeriod) {
    case "DAILY": {
      const today = new Date();
      today.setHours(0,0,0,0);
      return last >= today && last < new Date(today.getTime() + 24*60*60*1000);
    }
    case "WEEKLY": {
      const start = startOfWeek(new Date());
      const end = endOfWeek(new Date());
      return last >= start && last <= end;
    }
    case "MONTHLY": {
      const start = startOfMonth(new Date());
      const end = endOfMonth(new Date());
      return last >= start && last <= end;
    }
    case "NONE":
    default:
      return true; // разовая цель
  }
}


export interface TaskItemProps {
  id: string;
  title: string;
  lastCompletedAt?: string;
  xpReward?: number;
  dueDate?: string;
  subtasks?: Task[];
  expanded?: boolean;
  editMode?: boolean;
  goalPeriod: string;

  onToggle: (id: string, parentId?: string) => void;
  onRemove: (id: string, parentId?: string) => void;
  onToggleExpand: (id: string) => void;

  newSubTaskTitles: Record<string, string>;
  newSubTaskXps: Record<string, string>;
  setNewSubTaskTitles: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  setNewSubTaskXps: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  handleAddSubTask: (parentId: string) => void;

  parentId?: string;
}

export function TaskItem({
                           id,
                           title,
                           lastCompletedAt,
                           xpReward,
                           dueDate,
                           subtasks = [],
                           expanded = false,
                           editMode = false,
                           goalPeriod,
                           onToggle,
                           onRemove,
                           onToggleExpand,
                           newSubTaskTitles,
                           newSubTaskXps,
                           setNewSubTaskTitles,
                           setNewSubTaskXps,
                           handleAddSubTask,
                           parentId
                         }: TaskItemProps) {
  const hasSubtasks = subtasks.length > 0;
  const [expandedTasks, setExpandedTasks] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedTasks({ ...expandedTasks, [id]: !expandedTasks[id] });
  };

  return (
    <div className="flex flex-col p-2 rounded-lg border bg-card-group hover:bg-accent/50 transition-colors">
      <div className="flex items-center gap-3">
        {(hasSubtasks || editMode) && (
          <Button variant="ghost" size="icon" onClick={() => onToggleExpand(id)}>
            {expanded ? <ChevronDown /> : <ChevronRight />}
          </Button>
        )}

        <Checkbox
          id={id}
          checked={isTaskDoneForPeriod({ lastCompletedAt }, goalPeriod)}
          onCheckedChange={() => onToggle(id, parentId)}
        />

        <div className="flex-1 min-w-0">
          <label
            htmlFor={id}
            className={`block cursor-pointer ${isTaskDoneForPeriod({ lastCompletedAt }, goalPeriod) ? "line-through text-muted-foreground" : ""}`}
          >
            {title}
          </label>

          {dueDate && (
            <div className="flex items-center gap-1 mt-1 text-muted-foreground">
              <Calendar className="size-3" />
              <span>{dueDate}</span>
            </div>
          )}
        </div>

        {xpReward && (
          <Badge variant="secondary" className="shrink-0">
            +{xpReward} XP
          </Badge>
        ) || null}

        {editMode && (
          <Button variant="ghost" size="icon" onClick={() => onRemove(id, parentId)}>
            <X className="size-4" />
          </Button>
        )}
      </div>

      {/* Подзадачи */}
      {expanded && hasSubtasks && (
        <div className="mt-4 space-y-1">
          {subtasks.map((subtask) => (
            <TaskItem
              key={subtask.id}
              {...subtask}
              goalPeriod={goalPeriod}
              onToggle={onToggle}
              onRemove={onRemove}
              onToggleExpand={toggleExpand}
              newSubTaskTitles={newSubTaskTitles}
              newSubTaskXps={newSubTaskXps}
              setNewSubTaskTitles={setNewSubTaskTitles}
              setNewSubTaskXps={setNewSubTaskXps}
              handleAddSubTask={handleAddSubTask}
              parentId={id}
              expanded={expandedTasks[subtask.id]}
              editMode={editMode}
            />
          ))}
        </div>
      )}

      {/* Добавление новой подзадачи */}
      {expanded && editMode && (
        <div className="flex gap-2 mt-2">
          <Input
            placeholder="Подзадача"
            value={newSubTaskTitles[id] || ""}
            onChange={(e) =>
              setNewSubTaskTitles({ ...newSubTaskTitles, [id]: e.target.value })
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddSubTask(id);
              }
            }}
          />
          <Input
            type="number"
            min={0}
            placeholder="XP"
            className="w-24"
            value={newSubTaskXps[id] || ""}
            onChange={(e) =>
              setNewSubTaskXps({ ...newSubTaskXps, [id]: e.target.value })
            }
          />
          <Button type="button" onClick={() => handleAddSubTask(id)} size="icon">
            <Plus className="size-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
