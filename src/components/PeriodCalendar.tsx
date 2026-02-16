"use client";

import { useEffect, useRef } from "react";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import { Goal, GridItem } from "@/types";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./ui/card";

dayjs.locale("ru");

const DAYS_OF_WEEK = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

type Props = {
  goal: Goal;
  data: GridItem[];
  loading?: boolean;
};

export function PeriodCalendar({ goal, data, loading }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const daysToShow = 365;
  const today = dayjs();

  // Генерация дат
  const dates = Array.from({ length: daysToShow }).map((_, i) =>
    today.subtract(daysToShow - 1 - i, "day")
  );

  const dateMap = new Map(data.map(d => [d.periodStart, d.status]));

  // Разбиваем на недели
  const weeks: (dayjs.Dayjs | null)[][] = [];
  let week: (dayjs.Dayjs | null)[] = [];

  dates.forEach(date => {
    week.push(date);
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  });
  if (week.length) {
    while (week.length < 7) week.push(null);
    weeks.push(week);
  }

  // Месяцы для верхней строки
  const monthLabels: { month: string; colspan: number }[] = [];
  let lastMonth = weeks[0].find(d => d)?.month();
  let colspan = 0;

  weeks.forEach(w => {
    const firstDay = w.find(d => d !== null);
    const month = firstDay?.month();
    if (month === lastMonth) {
      colspan++;
    } else {
      monthLabels.push({
        month: dayjs().month(lastMonth!).format("MMM").replace(".", ""),
        colspan,
      });
      lastMonth = month;
      colspan = 1;
    }
  });
  monthLabels.push({
    month: dayjs().month(lastMonth!).format("MMM").replace(".", ""),
    colspan,
  });

  // Скролл в конец при монтировании
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, []);

  if (!goal) return null;

  return (
    <Card className="my-1">
      <CardHeader>
        <CardTitle>Активность</CardTitle>
        <CardDescription>Отслеживайте выполнение задач</CardDescription>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="py-6 text-sm text-muted-foreground">
            Загрузка активности...
          </div>
        ) : (
          <div className="overflow-x-auto w-full" ref={scrollRef}>
            <div className="min-w-max mx-auto">
              <table className="table-auto border-separate border-spacing-[2px]">
                <thead>
                <tr>
                  <td></td>
                  {monthLabels.map((m, idx) => (
                    <td key={idx} colSpan={m.colspan} className="text-xs text-center">
                      {m.month}
                    </td>
                  ))}
                </tr>
                </thead>

                <tbody>
                {DAYS_OF_WEEK.map((day, rowIdx) => (
                  <tr key={day} className="h-4">
                    <td className="text-xs align-middle pr-1">{day}</td>
                    {weeks.map((week, colIdx) => {
                      const date = week[rowIdx];
                      if (!date)
                        return (
                          <td key={colIdx}>
                            <span className="inline-block w-4 h-4"></span>
                          </td>
                        );

                      const status = dateMap.get(date.format("YYYY-MM-DD")) || "empty";

                      let bgColor = "bg-gray-200"; // empty
                      if (status === "partial") bgColor = "bg-yellow-300";
                      if (status === "full") bgColor = "bg-green-300";

                      return (
                        <td key={colIdx} className="align-middle">
                            <span
                              className={`align-middle inline-block w-4 h-4 rounded-sm cursor-pointer ${bgColor}`}
                              title={date.format("DD.MM.YYYY")}
                            ></span>
                        </td>
                      );
                    })}
                    <td className="text-xs align-middle pl-1">{day}</td>
                  </tr>
                ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
