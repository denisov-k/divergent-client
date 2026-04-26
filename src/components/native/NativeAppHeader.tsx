import { Image, Pressable, Text, View } from "react-native";

import { Settings } from "@/components/native/icons";
import type { User } from "@/types";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function NativeAppHeader({
  user,
  onOpenSettings,
}: {
  user: User;
  onOpenSettings: () => void;
}) {
  const progress = user.requiredXp > 0 ? Math.min((user.xp / user.requiredXp) * 100, 100) : 0;
  const initials = getInitials(user.name || user.email || "U");

  return (
    <View
      style={{
        paddingHorizontal: 8,
        paddingTop: 8,
        paddingBottom: 0,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 16,
          borderWidth: 1,
          borderColor: "#e2e8f0",
          borderRadius: 12,
          padding: 8,
          backgroundColor: "#ffffff",
        }}
      >
        <View style={{ position: "relative" }}>
          {user.photoUrl ? (
            <Image
              source={{ uri: user.photoUrl }}
              style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: "#e2e8f0" }}
            />
          ) : (
            <View
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: "#dbeafe",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ color: "#1d4ed8", fontSize: 19, fontWeight: "500", fontFamily: "Montserrat", lineHeight: 29 }}>{initials}</Text>
            </View>
          )}

          <View
            style={{
              position: "absolute",
              right: -4,
              bottom: -4,
              width: 24,
              height: 24,
              borderRadius: 12,
              backgroundColor: "#2563eb",
              borderWidth: 2,
              borderColor: "#ffffff",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "#ffffff", fontSize: 12, fontWeight: "500", fontFamily: "Montserrat", lineHeight: 18 }}>{user.level}</Text>
          </View>
        </View>

        <View style={{ flex: 1, gap: 10 }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <Text
              numberOfLines={1}
              style={{ flex: 1, color: "#0f172a", fontSize: 15, fontWeight: "500", fontFamily: "Montserrat", lineHeight: 23 }}
            >
              {user.name || user.email || "User"}
            </Text>

            <Pressable
              onPress={onOpenSettings}
              hitSlop={8}
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "transparent",
              }}
            >
              <Settings size={20} color="#64748b" />
            </Pressable>
          </View>

          <View style={{ gap: 6 }}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
              <Text style={{ color: "#64748b", fontSize: 12, fontWeight: "400", fontFamily: "Montserrat", lineHeight: 18 }}>Level {user.level}</Text>
              <Text style={{ color: "#64748b", fontSize: 12, fontWeight: "400", fontFamily: "Montserrat", lineHeight: 18 }}>
                {user.xp} / {user.requiredXp} XP
              </Text>
            </View>

            <View style={{ height: 8, borderRadius: 999, backgroundColor: "#e2e8f0", overflow: "hidden" }}>
              <View
                style={{
                  width: `${progress}%`,
                  height: "100%",
                  backgroundColor: "#2563eb",
                  borderRadius: 999,
                }}
              />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
