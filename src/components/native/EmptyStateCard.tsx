import { Text } from "react-native";

import { ActionChip } from "@/components/native/ActionChip";
import { SurfaceCard } from "@/components/native/SurfaceCard";
import { appPalette } from "@/theme/palette";

export function EmptyStateCard({
  title,
  description,
  actionLabel,
  onAction,
}: {
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
}) {
  return (
    <SurfaceCard>
      <Text style={{ fontSize: 16, fontWeight: "600", color: appPalette.semantic.textStrong, marginBottom: 8, fontFamily: "Montserrat" }}>{title}</Text>
      <Text style={{ color: appPalette.semantic.textMuted, marginBottom: 16, fontFamily: "Montserrat", fontSize: 12, lineHeight: 18 }}>{description}</Text>
      <ActionChip onPress={onAction} tone="primary">
        {actionLabel}
      </ActionChip>
    </SurfaceCard>
  );
}
