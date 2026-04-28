"use client";

import { useEffect, useRef } from "react";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

import isoWeek from "dayjs/plugin/isoWeek";
import { Goal, GoalActivity } from "@/types";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./ui/card";
import { Activity } from "lucide-react";

dayjs.extend(isoWeek);

type Props = {
  goal: Goal;
  activity: GoalActivity;
  loading?: boolean;
};

export function PeriodCalendar({ goal, activity, loading }: Props) {
  const { t } = useTranslation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const dayLabels = [
    t("progress.activity_day_labels.mon"),
    t("progress.activity_day_labels.tue"),
    t("progress.activity_day_labels.wed"),
    t("progress.activity_day_labels.thu"),
    t("progress.activity_day_labels.fri"),
    t("progress.activity_day_labels.sat"),
    t("progress.activity_day_labels.sun"),
  ];

  useEffect(() => {
    if (!goal) return;

    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, [goal]);

  if (!goal) return null;

  const daysToShow = 365;
  const today = dayjs();

  const dateMap = new Map(
    activity.data.map((d) => [dayjs(d.periodStart).format("YYYY-MM-DD"), d.status])
  );

  const firstDate = today.subtract(daysToShow - 1, "day").startOf("isoWeek");
  const lastDate = today;

  const dates: dayjs.Dayjs[] = [];
  let current = firstDate;
  while (current.isBefore(lastDate) || current.isSame(lastDate, "day")) {
    dates.push(current);
    current = current.add(1, "day");
  }

  const weeks: (dayjs.Dayjs | null)[][] = [];
  let currentWeek: (dayjs.Dayjs | null)[] = [];

  dates.forEach((date) => {
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

  const monthLabels: { month: string; colspan: number }[] = [];
  let lastMonth = weeks[0].find((d) => d !== null)?.month();
  let colspan = 0;

  weeks.forEach((w) => {
    const firstDay = w.find((d) => d !== null);
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

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-sm">{t("progress.activity_widget_title")}</CardTitle>
          <CardDescription>{t("progress.activity_widget_description")}</CardDescription>
        </div>
        <Activity className="size-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="py-6 text-sm text-muted-foreground">{t("progress.activity_loading")}</div>
        ) : (
          <div className="overflow-x-auto w-full" ref={scrollRef}>
            <div className="mx-auto flex min-w-max justify-center">
              <table className="table-auto border-separate border-spacing-[2px]">
                <thead>
                  <tr>
                    <td></td>
                    {monthLabels.map((m, idx) => (
                      <td key={idx} colSpan={m.colspan} className="text-center text-xs">
                        {m.colspan > 1 ? m.month : ""}
                      </td>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {dayLabels.map((day, rowIdx) => (
                    <tr key={day} className="h-4">
                      <td className="align-middle pr-1 text-xs">{day}</td>
                      {weeks.map((week, colIdx) => {
                        const date = week[rowIdx];
                        if (!date) {
                          return (
                            <td key={colIdx}>
                              <span className="inline-block h-4 w-4"></span>
                            </td>
                          );
                        }

                        const status = dateMap.get(date.format("YYYY-MM-DD")) || "empty";

                        let bgColor = "bg-gray-200";
                        if (status === "partial") bgColor = "bg-yellow-300";
                        if (status === "full") bgColor = "bg-green-300";

                        return (
                          <td key={colIdx} className="align-middle">
                            <span
                              className={`inline-block h-4 w-4 cursor-pointer rounded-sm align-middle ${bgColor}`}
                              title={date.format("DD.MM.YYYY")}
                            ></span>
                          </td>
                        );
                      })}
                      <td className="align-middle pl-1 text-xs">{day}</td>
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
