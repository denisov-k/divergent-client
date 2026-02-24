"use client";

import { useEffect, useRef } from "react";
import dayjs from "dayjs";

import isoWeek from "dayjs/plugin/isoWeek";
import {Goal, GoalActivity} from "@/types";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./ui/card";
import {Activity} from "lucide-react";


dayjs.extend(isoWeek);

const DAYS_OF_WEEK = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

type Props = {
  goal: Goal;
  activity: GoalActivity;
  loading?: boolean;
};

export function PeriodCalendar({ goal, activity, loading }: Props) {
  if (!goal) return null;

  const scrollRef = useRef<HTMLDivElement>(null);

  const daysToShow = 365;
  const today = dayjs();

  // Нормализуем даты для сопоставления
  const dateMap = new Map(
    activity.data.map(d => [dayjs(d.periodStart).format("YYYY-MM-DD"), d.status])
  );

  // 1. Генерация дат с выравниванием по понедельнику
  const firstDate = today.subtract(daysToShow - 1, "day").startOf("isoWeek");
  const lastDate = today;

  const dates: dayjs.Dayjs[] = [];
  let current = firstDate;
  while (current.isBefore(lastDate) || current.isSame(lastDate, "day")) {
    dates.push(current);
    current = current.add(1, "day");
  }

  // 2. Разбиваем на недели
  const weeks: (dayjs.Dayjs | null)[][] = [];
  let currentWeek: (dayjs.Dayjs | null)[] = [];

  dates.forEach(date => {
    currentWeek.push(date);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push(null);
    }
    weeks.push(currentWeek);
  }

  // 3. Строим верхнюю строку месяцев
  const monthLabels: { month: string; colspan: number }[] = [];
  let lastMonth = weeks[0].find(d => d !== null)?.month();
  let colspan = 0;

  weeks.forEach(w => {
    const firstDay = w.find(d => d !== null);
    const month = firstDay?.month();
    if (month === lastMonth) {
      colspan++;
    } else {
      if (lastMonth !== undefined) {
        monthLabels.push({
          month: dayjs().month(lastMonth).format("MMM").replace(".", ""),
          colspan,
        });
      }
      lastMonth = month;
      colspan = 1;
    }
  });

  if (lastMonth !== undefined) {
    monthLabels.push({
      month: dayjs().month(lastMonth).format("MMM").replace(".", ""),
      colspan,
    });
  }

  // 4. Скролл в конец при монтировании
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, []);

  return (
    <Card className="">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-sm">Активность</CardTitle>
          <CardDescription>Прогресс в календарном виде</CardDescription>
        </div>
        <Activity className="size-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="py-6 text-sm text-muted-foreground">
            Загрузка активности...
          </div>
        ) : (
          <div className="overflow-x-auto w-full" ref={scrollRef}>
            <div className="min-w-max mx-auto flex justify-center">
              <table className="table-auto border-separate border-spacing-[2px]">
                <thead>
                <tr>
                  <td></td>
                  {monthLabels.map((m, idx) => (
                    <td
                      key={idx}
                      colSpan={m.colspan}
                      className="text-xs text-center"
                    >
                      {m.colspan > 1 ? m.month : ""}
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

                      const status =
                        dateMap.get(date.format("YYYY-MM-DD")) || "empty";

                      let bgColor = "bg-gray-200";
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
