import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface ProgressChartProps {
  type: "line" | "bar";
  title: string;
  description?: string;
  data: Array<{ name: string; value: number; [key: string]: unknown }>;
  dataKey?: string;
  xAxisKey?: string;
}

export function ProgressChart({ 
  type, 
  title, 
  description, 
  data, 
  dataKey = "value",
  xAxisKey = "name" 
}: ProgressChartProps) {
  return (
    <Card className="relative overflow-hidden my-1">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          {type === "line" ? (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey={xAxisKey} 
                className="text-xs"
                tick={{ fill: 'var(--muted-foreground)' }}
              />
              <YAxis 
                className="text-xs"
                tick={{ fill: 'var(--muted-foreground)' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '6px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey={dataKey} 
                stroke="rgb(var(--primary))"
                strokeWidth={2}
                dot={{ fill: 'rgb(var(--primary))' }}
              />
            </LineChart>
          ) : (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey={xAxisKey} 
                className="text-xs"
                tick={{ fill: 'var(--muted-foreground)' }}
              />
              <YAxis 
                className="text-xs"
                tick={{ fill: 'var(--muted-foreground)' }}
              />
              <Tooltip
                contentStyle={{ 
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '6px'
                }}
              />
              <Bar 
                dataKey={dataKey} 
                fill="rgb(var(--primary))"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
