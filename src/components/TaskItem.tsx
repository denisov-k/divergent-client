import { Checkbox } from "./ui/checkbox";
import { Badge } from "./ui/badge";
import { Calendar } from "lucide-react";

interface TaskItemProps {
  id: string;
  title: string;
  completed: boolean;
  xpReward?: number;
  dueDate?: string;
  onToggle?: (id: string) => void;
}

export function TaskItem({ 
  id, 
  title, 
  completed, 
  xpReward, 
  dueDate,
  onToggle 
}: TaskItemProps) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
      <Checkbox
        id={id}
        checked={completed}
        onCheckedChange={() => onToggle?.(id)}
      />
      <div className="flex-1 min-w-0">
        <label
          htmlFor={id}
          className={`block cursor-pointer ${
            completed ? "line-through text-muted-foreground" : ""
          }`}
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
    </div>
  );
}
