import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Bell, Clock, Repeat, Edit, Target } from "lucide-react";
import { Switch } from "./ui/switch";

interface ReminderCardProps {
  id: string;
  title: string;
  time: string;
  days?: string[];
  isActive: boolean;
  goalTitle?: string;
  taskTitle?: string;
  onToggle?: () => void;
  onEdit?: (id: string) => void;
}

export function ReminderCard({ 
  id,
  title, 
  time, 
  days, 
  isActive,
  goalTitle,
  taskTitle,
  onToggle,
  onEdit,
}: ReminderCardProps) {
  return (
    <Card className={`transition-all ${isActive ? "border-primary" : "opacity-60"}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className={`size-4 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
            <CardTitle>{title}</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={isActive} onCheckedChange={onToggle} />
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
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <Clock className="size-4 text-muted-foreground" />
          <span>{time}</span>
        </div>
        
        {days && days.length > 0 && (
          <div className="flex items-center gap-2">
            <Repeat className="size-4 text-muted-foreground" />
            <div className="flex flex-wrap gap-1">
              {days.map((day) => (
                <Badge key={day} variant="outline" className="text-xs">
                  {day}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {(goalTitle || taskTitle) && (
          <div className="pt-2 border-t">
            <div className="flex items-start gap-2">
              <Target className="size-4 text-primary mt-0.5" />
              <div className="flex-1 min-w-0">
                {goalTitle && (
                  <p className="text-sm">
                    <span className="text-muted-foreground">Цель:</span> {goalTitle}
                  </p>
                )}
                {taskTitle && (
                  <p className="text-sm text-muted-foreground">
                    {taskTitle}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}