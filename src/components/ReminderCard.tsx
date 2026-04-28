import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Bell, Clock, Repeat, Edit, Target, CircleCheck } from "lucide-react";
import { Switch } from "./ui/switch";

import { Goal, Task } from "@/types";
import { useNavigate } from "react-router-dom";

const DAY_LABEL_MAP: Record<string, string> = {
  mon: "Пн",
  tue: "Вт",
  wed: "Ср",
  thu: "Чт",
  fri: "Пт",
  sat: "Сб",
  sun: "Вс",
  "1": "Пн",
  "2": "Вт",
  "3": "Ср",
  "4": "Чт",
  "5": "Пт",
  "6": "Сб",
  "7": "Вс",
};

function formatReminderDayLabel(day: string) {
  return DAY_LABEL_MAP[String(day).toLowerCase()] ?? day;
}

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

        {hasDays && (
          <div className="flex items-center gap-2">
            <Repeat className="size-4 text-muted-foreground" />
            <div className="flex flex-wrap gap-1">
              {daysOfWeek.map((day) => (
                <Badge key={day} variant="outline" className="text-xs">
                  {formatReminderDayLabel(day)}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {hasDates && (
          <div className="flex items-center gap-2">
            <Repeat className="size-4 text-muted-foreground" />
            <div className="flex flex-wrap gap-1">
              {daysOfMonth?.sort((dayX, dayY) => dayX - dayY).map((day) => (
                <Badge key={day} variant="outline" className="text-xs">
                  {day}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {(task || goal) && (
          <div className="pt-2 border-t gap-2 flex flex-wrap">
            {goal && (
              <Badge
                className="cursor-pointer bg-primary text-white hover:bg-primary/80"
                onClick={() =>
                  navigate({
                    pathname: "/goals",
                    search: `?id=${goal.id}`,
                  })
                }
                title="Перейти к цели"
              >
                <Target />
                <span>{goal.title}</span>
              </Badge>
            )}
            {goal && task && (
              <Badge
                className="cursor-pointer bg-primary text-white hover:bg-primary/80"
                onClick={() =>
                  navigate({
                    pathname: "/goals",
                    search: `?id=${goal.id}`,
                  })
                }
                title="Перейти к задаче"
              >
                <CircleCheck />
                <span>{task.title}</span>
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
