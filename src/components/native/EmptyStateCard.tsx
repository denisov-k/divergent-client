import { Text } from "react-native";

import { ActionChip } from "@/components/native/ActionChip";
import { SurfaceCard } from "@/components/native/SurfaceCard";

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
      <Text style={{ fontSize: 16, fontWeight: "600", color: "#0f172a", marginBottom: 8 }}>{title}</Text>
      <Text style={{ color: "#64748b", marginBottom: 16 }}>{description}</Text>
      <ActionChip onPress={onAction} tone="primary">
        {actionLabel}
      </ActionChip>
    </SurfaceCard>
  );
}
