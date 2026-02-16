import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function StatCard({ title, value, icon: Icon, description, trend }: StatCardProps) {
  return (
    <Card className="my-1">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm">{title}</CardTitle>
        <Icon className="size-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl">{value}</span>
            {trend && (
              <span className={`text-sm ${trend.isPositive ? "text-green-600" : "text-red-600"}`}>
                {trend.isPositive ? "+" : ""}{trend.value}%
              </span>
            )}
          </div>
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
