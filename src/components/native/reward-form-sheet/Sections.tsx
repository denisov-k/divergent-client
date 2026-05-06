import { useState, type ReactNode } from "react";
import { Modal, ScrollView, Text, View } from "react-native";
import { HapticPressable as Pressable } from "@/components/native/HapticPressable";
import { useTranslation } from "react-i18next";

import { ChevronDown } from "@/components/native/Icons";
import { NativeRewardIcon } from "@/components/native/NativeRewardIcon";
import { formSectionLabelStyle } from "@/components/native/form-sheet/Layout";
import { appPalette } from "@/theme/palette";
import type { Goal, RewardIcon } from "@/types";

export const iconOptions: RewardIcon[] = ["trophy", "star", "gift", "crown", "award", "zap"];

function PickerTrigger(props: { value: ReactNode; onPress: () => void }) {
  return (
    <Pressable
      onPress={props.onPress}
      style={{
        borderWidth: 1,
        borderColor: appPalette.semantic.borderStrong,
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 12,
        backgroundColor: appPalette.surface.background,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 8,
      }}
    >
      <View style={{ flex: 1, minWidth: 0 }}>{props.value}</View>
      <ChevronDown size={16} color={appPalette.semantic.textSubtle} />
    </Pressable>
  );
}

function OptionPickerModal(props: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const { t } = useTranslation();

  return (
    <Modal visible={props.open} transparent animationType="none" onRequestClose={props.onClose}>
      <View style={{ flex: 1, backgroundColor: appPalette.surface.overlay, justifyContent: "center", padding: 20 }}>
        <View
          style={{
            backgroundColor: appPalette.surface.background,
            borderRadius: 20,
            padding: 16,
            gap: 12,
            maxHeight: "80%",
          }}
        >
          <Text style={{ color: appPalette.semantic.textStrong, fontSize: 18, fontWeight: "600", fontFamily: "Montserrat" }}>
            {props.title}
          </Text>
          <ScrollView style={{ flexGrow: 0 }} contentContainerStyle={{ gap: 8 }} showsVerticalScrollIndicator={false}>
            {props.children}
          </ScrollView>
          <Pressable
            onPress={props.onClose}
            style={{
              borderWidth: 1,
              borderColor: appPalette.semantic.borderSubtle,
              backgroundColor: appPalette.surface.background,
              borderRadius: 10,
              paddingHorizontal: 12,
              paddingVertical: 10,
              alignSelf: "flex-start",
            }}
          >
            <Text style={{ color: appPalette.semantic.text, fontWeight: "500", fontSize: 12, lineHeight: 18, fontFamily: "Montserrat" }}>
              {t("common.close")}
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

export function RewardIconSection(props: { icon: RewardIcon; onChange: (value: RewardIcon) => void }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <View style={{ gap: 8 }}>
      <Text style={formSectionLabelStyle}>{t("rewards.dialog.icon_label")}</Text>
      <PickerTrigger
        onPress={() => setOpen(true)}
        value={
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <NativeRewardIcon icon={props.icon} />
            <Text
              style={{
                color: appPalette.semantic.textStrong,
                fontSize: 14,
                lineHeight: 20,
                fontFamily: "Montserrat",
              }}
            >
              {props.icon}
            </Text>
          </View>
        }
      />
      <OptionPickerModal open={open} title={t("rewards.dialog.icon_label")} onClose={() => setOpen(false)}>
        {iconOptions.map((option) => {
          const active = props.icon === option;

          return (
            <Pressable
              key={option}
              onPress={() => {
                props.onChange(option);
                setOpen(false);
              }}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                borderWidth: 1,
                borderColor: active ? appPalette.semantic.infoBorder : appPalette.semantic.borderSubtle,
                backgroundColor: active ? appPalette.semantic.infoSurface : appPalette.surface.background,
                borderRadius: 12,
                paddingHorizontal: 14,
                paddingVertical: 12,
              }}
            >
              <NativeRewardIcon icon={option} />
              <Text
                style={{
                  color: active ? appPalette.semantic.infoText : appPalette.semantic.textStrong,
                  fontSize: 14,
                  lineHeight: 20,
                  fontFamily: "Montserrat",
                }}
              >
                {option}
              </Text>
            </Pressable>
          );
        })}
      </OptionPickerModal>
    </View>
  );
}

export function RewardGoalSection(props: { goals: Goal[]; goalId: string; onChange: (value: string) => void }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const currentGoalTitle = props.goalId
    ? props.goals.find((goal) => goal.id === props.goalId)?.title ?? t("common.no_goal")
    : t("common.no_goal");

  return (
    <View style={{ gap: 8 }}>
      <Text style={formSectionLabelStyle}>{t("rewards.dialog.goal_label")}</Text>
      <PickerTrigger
        onPress={() => setOpen(true)}
        value={
          <Text
            style={{
              color: appPalette.semantic.textStrong,
              fontSize: 14,
              lineHeight: 20,
              fontFamily: "Montserrat",
            }}
            numberOfLines={1}
          >
            {currentGoalTitle}
          </Text>
        }
      />
      <OptionPickerModal open={open} title={t("rewards.dialog.goal_label")} onClose={() => setOpen(false)}>
        <Pressable
          onPress={() => {
            props.onChange("");
            setOpen(false);
          }}
          style={{
            borderWidth: 1,
            borderColor: !props.goalId ? appPalette.semantic.infoBorder : appPalette.semantic.borderSubtle,
            backgroundColor: !props.goalId ? appPalette.semantic.infoSurface : appPalette.surface.background,
            borderRadius: 12,
            paddingHorizontal: 14,
            paddingVertical: 12,
          }}
        >
          <Text
            style={{
              color: !props.goalId ? appPalette.semantic.infoText : appPalette.semantic.textStrong,
              fontSize: 14,
              lineHeight: 20,
              fontFamily: "Montserrat",
            }}
          >
            {t("common.no_goal")}
          </Text>
        </Pressable>
        {props.goals.map((goal) => {
          const active = props.goalId === goal.id;

          return (
            <Pressable
              key={goal.id}
              onPress={() => {
                props.onChange(goal.id);
                setOpen(false);
              }}
              style={{
                borderWidth: 1,
                borderColor: active ? appPalette.semantic.infoBorder : appPalette.semantic.borderSubtle,
                backgroundColor: active ? appPalette.semantic.infoSurface : appPalette.surface.background,
                borderRadius: 12,
                paddingHorizontal: 14,
                paddingVertical: 12,
              }}
            >
              <Text
                style={{
                  color: active ? appPalette.semantic.infoText : appPalette.semantic.textStrong,
                  fontSize: 14,
                  lineHeight: 20,
                  fontFamily: "Montserrat",
                }}
              >
                {goal.title}
              </Text>
            </Pressable>
          );
        })}
      </OptionPickerModal>
    </View>
  );
}
