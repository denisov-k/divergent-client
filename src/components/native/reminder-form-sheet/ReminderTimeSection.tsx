import { useEffect, useMemo, useState } from "react";
import { Text, TextInput, View } from "react-native";
import { useTranslation } from "react-i18next";

import { appPalette } from "@/theme/palette";

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function normalizeTimeUnit(raw: string, max: number) {
  const digits = raw.replace(/\D/g, "").slice(0, 2);
  const numeric = Number(digits || "0");
  return clamp(numeric, 0, max).toString().padStart(2, "0");
}

function splitTime(value: string) {
  const [hour = "09", minute = "00"] = value.split(":");

  return {
    hour: normalizeTimeUnit(hour, 23),
    minute: normalizeTimeUnit(minute, 59),
  };
}

function buildTime(hour: string, minute: string) {
  return `${normalizeTimeUnit(hour, 23)}:${normalizeTimeUnit(minute, 59)}`;
}

export function ReminderTimeSection({
  value,
  onChange,
}: {
  value: string;
  onChange: (nextValue: string) => void;
}) {
  const { t } = useTranslation();
  const parsed = useMemo(() => splitTime(value), [value]);
  const [hourText, setHourText] = useState(parsed.hour);
  const [minuteText, setMinuteText] = useState(parsed.minute);

  useEffect(() => {
    setHourText(parsed.hour);
    setMinuteText(parsed.minute);
  }, [parsed.hour, parsed.minute]);

  const commitTime = (nextHour: string, nextMinute: string) => {
    onChange(buildTime(nextHour, nextMinute));
  };

  const handleHourChange = (nextValue: string) => {
    const nextHour = nextValue.replace(/\D/g, "").slice(0, 2);
    setHourText(nextHour);
    commitTime(nextHour, minuteText);
  };

  const handleMinuteChange = (nextValue: string) => {
    const nextMinute = nextValue.replace(/\D/g, "").slice(0, 2);
    setMinuteText(nextMinute);
    commitTime(hourText, nextMinute);
  };

  const handleHourBlur = () => {
    const normalized = normalizeTimeUnit(hourText, 23);
    setHourText(normalized);
    commitTime(normalized, minuteText);
  };

  const handleMinuteBlur = () => {
    const normalized = normalizeTimeUnit(minuteText, 59);
    setMinuteText(normalized);
    commitTime(hourText, normalized);
  };

  return (
    <View style={{ gap: 10 }}>
      <Text style={{ fontSize: 14, fontWeight: "600", color: appPalette.semantic.text }}>
        {t("common.time")}
      </Text>

      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <TextInput
          value={hourText}
          onChangeText={handleHourChange}
          onBlur={handleHourBlur}
          keyboardType="number-pad"
          maxLength={2}
          placeholder="09"
          textAlign="center"
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: appPalette.semantic.borderStrong,
            borderRadius: 14,
            paddingHorizontal: 14,
            paddingVertical: 14,
            backgroundColor: appPalette.surface.background,
            color: appPalette.semantic.textStrong,
            fontSize: 24,
            fontWeight: "700",
            fontFamily: "Montserrat",
          }}
          placeholderTextColor={appPalette.semantic.textSubtle}
        />

        <Text
          style={{
            color: appPalette.semantic.textStrong,
            fontSize: 24,
            fontWeight: "700",
            fontFamily: "Montserrat",
          }}
        >
          :
        </Text>

        <TextInput
          value={minuteText}
          onChangeText={handleMinuteChange}
          onBlur={handleMinuteBlur}
          keyboardType="number-pad"
          maxLength={2}
          placeholder="00"
          textAlign="center"
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: appPalette.semantic.borderStrong,
            borderRadius: 14,
            paddingHorizontal: 14,
            paddingVertical: 14,
            backgroundColor: appPalette.surface.background,
            color: appPalette.semantic.textStrong,
            fontSize: 24,
            fontWeight: "700",
            fontFamily: "Montserrat",
          }}
          placeholderTextColor={appPalette.semantic.textSubtle}
        />
      </View>
    </View>
  );
}
