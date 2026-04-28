import { Pressable, ScrollView, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { EmptyStateCard } from "@/components/native/EmptyStateCard";
import { Plus } from "@/components/native/icons";
import { NativeChallengeCardView } from "@/components/native/NativeChallengeCardView";
import { appPalette } from "@/theme/palette";
import type { Challenge } from "@/types";

export function ChallengesScreenHeader({ onCreate }: { onCreate: () => void }) {
  const { t } = useTranslation();

  return (
    <View
      style={{
        paddingHorizontal: 8,
        paddingVertical: 8,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 8,
        backgroundColor: appPalette.surface.background,
      }}
    >
      <Text
        style={{
          fontSize: 19,
          fontWeight: "500",
          color: appPalette.semantic.textStrong,
          fontFamily: "Montserrat",
          lineHeight: 29,
        }}
      >
        {t("challenges.title")}
      </Text>

      <Pressable
        onPress={onCreate}
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          backgroundColor: appPalette.semantic.infoSurface,
          borderWidth: 1,
          borderColor: appPalette.semantic.infoBorder,
          borderRadius: 10,
          paddingHorizontal: 12,
          paddingVertical: 10,
        }}
      >
        <Plus size={16} color={appPalette.semantic.infoText} />
        <Text
          style={{
            color: appPalette.semantic.infoText,
            fontSize: 12,
            fontWeight: "500",
            lineHeight: 18,
            fontFamily: "Montserrat",
          }}
        >
          {t("challenges.create")}
        </Text>
      </Pressable>
    </View>
  );
}

export function ChallengesScreenContent({
  challenges,
  focusedChallengeId,
  onCreate,
  onEdit,
  onShare,
  onAccept,
  onLeave,
  onOpenLink,
  onOpenParticipants,
}: {
  challenges: Challenge[];
  focusedChallengeId?: string | null;
  onCreate: () => void;
  onEdit: (id: string) => void;
  onShare: (id: string) => void;
  onAccept: (id: string) => void;
  onLeave: (id: string) => void;
  onOpenLink: (id: string) => void;
  onOpenParticipants: (id: string) => void;
}) {
  const { t } = useTranslation();

  return (
    <ScrollView contentContainerStyle={{ paddingHorizontal: 8, gap: 8 }}>
      {challenges.length === 0 ? (
        <EmptyStateCard
          title={t("challenges.empty")}
          description={t("challenges.empty_native_description")}
          actionLabel={t("challenges.create_first")}
          onAction={onCreate}
        />
      ) : (
        challenges.map((challenge) => (
          <NativeChallengeCardView
            key={challenge.id}
            challenge={challenge}
            focused={challenge.id === focusedChallengeId}
            onEdit={onEdit}
            onShare={onShare}
            onAccept={onAccept}
            onLeave={onLeave}
            onOpenLink={onOpenLink}
            onOpenParticipants={onOpenParticipants}
          />
        ))
      )}
    </ScrollView>
  );
}
