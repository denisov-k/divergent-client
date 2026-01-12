import { Checkbox } from "./ui/checkbox";
import { Badge } from "./ui/badge";
import { Calendar, ChevronDown, ChevronRight, Plus, X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import React, { useState } from "react";
import { Task } from "@/types";

export interface TaskItemProps {
  id: string;
  title: string;
  completed: boolean;
  xpReward?: number;
  dueDate?: string;
  subtasks?: Task[];
  expanded?: boolean;
  editMode?: boolean;

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
                           completed,
                           xpReward,
                           dueDate,
                           subtasks = [],
                           expanded = false,
                           editMode = false,
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
    <div className="flex flex-col p-3 rounded-lg border bg-card-group hover:bg-accent/50 transition-colors">
      <div className="flex items-center gap-3">
        {(hasSubtasks || editMode) && (
          <Button variant="ghost" size="icon" onClick={() => onToggleExpand(id)}>
            {expanded ? <ChevronDown /> : <ChevronRight />}
          </Button>
        )}

        <Checkbox
          id={id}
          checked={completed}
          onCheckedChange={() => onToggle(id, parentId)}
        />

        <div className="flex-1 min-w-0">
          <label
            htmlFor={id}
            className={`block cursor-pointer ${completed ? "line-through text-muted-foreground" : ""}`}
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
        )}

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
