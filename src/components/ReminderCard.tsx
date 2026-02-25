import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {Bell, Clock, Repeat, Edit, Target, CircleCheck} from "lucide-react";
import { Switch } from "./ui/switch";

import {DAYS_OF_WEEK, Goal, Task} from "@/types";
import {useNavigate} from "react-router-dom";

const DAY_LABEL_MAP = Object.fromEntries(
  DAYS_OF_WEEK.map(d => [d.key, d.label])
) as Record<string, string>;

interface ReminderCardProps {
  id: string;
  title: string;
  time: string;
  goal?: Goal;
  task?: Task;
  daysOfWeek?: string[];
  daysOfMonth?: number[];
  isActive: boolean;
  onToggle?: () => void;
  onEdit?: (id: string) => void;
}

export function ReminderCard({
     id,
     title,
     time,
     goal,
     task,
     daysOfWeek = [],
     daysOfMonth = [],
     isActive,
     onToggle,
     onEdit,
   }: ReminderCardProps) {
  const hasDays = daysOfWeek.length > 0;
  const hasDates = daysOfMonth.length > 0;

  const navigate = useNavigate();

  return (
    <Card className={`mb-2 break-inside-avoid transition-all ${isActive ? "border-primary" : "opacity-60"}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className={`size-4 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
            <CardTitle>{title}</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={isActive} onCheckedChange={onToggle} />
            {onEdit && (
              <Button variant="ghost" size="icon" onClick={() => onEdit(id)}>
                <Edit className="size-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <Clock className="size-4 text-muted-foreground" />
          <span>{time}</span>
        </div>

        {/* Дни недели */}
        {hasDays && (
          <div className="flex items-center gap-2">
            <Repeat className="size-4 text-muted-foreground" />
            <div className="flex flex-wrap gap-1">
              {daysOfWeek.map(day => (
                <Badge key={day} variant="outline" className="text-xs">
                  {DAY_LABEL_MAP[day] ?? day}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Числа месяца */}
        {hasDates && (
          <div className="flex items-center gap-2">
            <Repeat className="size-4 text-muted-foreground" />
            <div className="flex flex-wrap gap-1">
              {daysOfMonth?.sort((dayX, dayY) => dayX - dayY).map(day => (
                <Badge key={day} variant="outline" className="text-xs">
                  {day}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Цель и задача */}
        {(task || goal) && (
          <div className="pt-2 border-t gap-2 flex flex-wrap">
            {goal && (
              <Badge
                className="cursor-pointer bg-primary text-white hover:bg-primary/80"
                onClick={() => navigate({
                  pathname: "/goals",
                  search: `?id=${goal.id}`,
                })}
                title="Перейти к цели"
              >
                <Target />
                <span className="">{goal.title}</span>
              </Badge>
            )}
            {goal && task && (
              <Badge
                className="cursor-pointer bg-primary text-white hover:bg-primary/80"
                onClick={() => navigate({
                  pathname: "/goals",
                  search: `?id=${goal.id}`,
                })}
                title="Перейти к задаче"
              >
                <CircleCheck />
                <span className="">{task.title}</span>
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
