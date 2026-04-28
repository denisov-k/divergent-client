import { ChartSpline } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ProgressChartProps {
  type: "line" | "bar";
  title: string;
  description?: string;
  data: Array<{ name: string; value: number; [key: string]: unknown }>;
  dataKey?: string;
  xAxisKey?: string;
}

export function ProgressChart({ type, title, description, data, dataKey = "value", xAxisKey = "name" }: ProgressChartProps) {
  return (
    <Card className="relative mb-2 break-inside-avoid overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-sm">{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        <ChartSpline className="size-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          {type === "line" ? (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey={xAxisKey} className="text-xs" tick={{ fill: "var(--muted-foreground)" }} />
              <YAxis className="text-xs" tick={{ fill: "var(--muted-foreground)" }} />
              <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "6px" }} />
              <Line type="monotone" dataKey={dataKey} stroke="rgb(var(--primary))" strokeWidth={2} dot={{ fill: "rgb(var(--primary))" }} />
            </LineChart>
          ) : (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey={xAxisKey} className="text-xs" tick={{ fill: "var(--muted-foreground)" }} />
              <YAxis className="text-xs" tick={{ fill: "var(--muted-foreground)" }} />
              <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "6px" }} />
              <Bar dataKey={dataKey} fill="rgb(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
