import { useTranslation } from "react-i18next";
import { useEffect, useRef } from "react";
import { ScrollView, Text, View } from "react-native";

import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";

import { Activity } from "@/components/native/icons";
import { SurfaceCard } from "@/components/native/SurfaceCard";
import { appPalette } from "@/theme/palette";
import type { Goal, GoalActivity } from "@/types";

dayjs.extend(isoWeek);

type Props = {
  goal: Goal;
  activity: GoalActivity;
  loading?: boolean;
};

export function NativePeriodCalendar({ goal, activity, loading }: Props) {
  const { t } = useTranslation();
  const dayLabels = [
    t("weekdays.mon"),
    t("weekdays.tue"),
    t("weekdays.wed"),
    t("weekdays.thu"),
    t("weekdays.fri"),
    t("weekdays.sat"),
    t("weekdays.sun"),
  ];
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (!goal) {
      return;
    }

    const timer = setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: false });
    }, 0);

    return () => clearTimeout(timer);
  }, [goal]);

  const daysToShow = 365;
  const today = dayjs();
  const dateMap = new Map(activity.data.map((d) => [dayjs(d.periodStart).format("YYYY-MM-DD"), d.status]));
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
  let lastMonth = weeks[0]?.find((d) => d !== null)?.month();
  let colspan = 0;

  weeks.forEach((week) => {
    const firstDay = week.find((d) => d !== null);
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
    <SurfaceCard gap={12} padding={16} radius={12}>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <View>
          <Text style={{ color: appPalette.semantic.textStrong, fontSize: 14, fontWeight: "500", lineHeight: 20, fontFamily: "Montserrat" }}>
            {t("progress.activity_widget_title")}
          </Text>
          <Text style={{ color: appPalette.semantic.textMuted, fontSize: 12, fontWeight: "400", lineHeight: 18, fontFamily: "Montserrat" }}>
            {t("progress.activity_widget_description")}
          </Text>
        </View>
        <Activity size={20} color={appPalette.semantic.textMuted} />
      </View>

      {loading ? (
        <Text style={{ color: appPalette.semantic.textMuted, fontSize: 12, fontWeight: "400", lineHeight: 18, fontFamily: "Montserrat" }}>
          {t("progress.activity_loading")}
        </Text>
      ) : (
        <ScrollView ref={scrollRef} horizontal showsHorizontalScrollIndicator={false}>
          <View style={{ gap: 6 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={{ width: 24 }} />
              {monthLabels.map((label, index) => (
                <View key={`${label.month}-${index}`} style={{ width: label.colspan * 16, alignItems: "center" }}>
                  <Text style={{ color: appPalette.semantic.textMuted, fontSize: 10, fontWeight: "400", lineHeight: 14, fontFamily: "Montserrat" }}>
                    {label.colspan > 1 ? label.month : ""}
                  </Text>
                </View>
              ))}
              <View style={{ width: 24 }} />
            </View>

            {dayLabels.map((day, rowIdx) => (
              <View key={day} style={{ flexDirection: "row", alignItems: "center", minHeight: 16 }}>
                <View style={{ width: 24, alignItems: "flex-end", paddingRight: 6 }}>
                  <Text style={{ color: appPalette.semantic.textMuted, fontSize: 10, fontWeight: "400", lineHeight: 14, fontFamily: "Montserrat" }}>{day}</Text>
                </View>

                {weeks.map((week, colIdx) => {
                  const date = week[rowIdx];
                  if (!date) {
                    return <View key={`${day}-${colIdx}`} style={{ width: 16, height: 16 }} />;
                  }

                  const status = dateMap.get(date.format("YYYY-MM-DD")) || "empty";
                  const backgroundColor = status === "full" ? appPalette.semantic.successSurfaceStrong : status === "partial" ? appPalette.semantic.warningSurfaceStrong : appPalette.semantic.neutralBorder;

                  return (
                    <View key={`${day}-${colIdx}`} style={{ width: 16, height: 16, alignItems: "center", justifyContent: "center" }}>
                      <View style={{ width: 12, height: 12, borderRadius: 2, backgroundColor }} />
                    </View>
                  );
                })}

                <View style={{ width: 24, alignItems: "flex-start", paddingLeft: 6 }}>
                  <Text style={{ color: appPalette.semantic.textMuted, fontSize: 10, fontWeight: "400", lineHeight: 14, fontFamily: "Montserrat" }}>{day}</Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      )}
    </SurfaceCard>
  );
}
