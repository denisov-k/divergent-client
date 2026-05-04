import { ActivityIndicator, View } from "react-native";

import { appPalette } from "@/theme/palette";

export function AppLoader({
  fullScreen = false,
}: {
  fullScreen?: boolean;
}) {
  return (
    <View
      style={{
        flex: fullScreen ? 1 : undefined,
        flexGrow: fullScreen ? undefined : 1,
        width: "100%",
        alignSelf: "stretch",
        minHeight: fullScreen ? undefined : 160,
        backgroundColor: appPalette.surface.background,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 24,
      }}
    >
      <ActivityIndicator size="large" color={appPalette.brand.primary} />
    </View>
  );
}
