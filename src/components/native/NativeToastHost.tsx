import { useEffect, useRef } from "react";
import { Animated, Text, View } from "react-native";

import { useAppStore } from "@/stores/useAppStore";
import { appPalette } from "@/theme/palette";

function getToastPalette(tone: "success" | "danger" | "info") {
  if (tone === "success") {
    return {
      backgroundColor: appPalette.semantic.successSurface,
      borderColor: appPalette.semantic.successBorder,
      titleColor: appPalette.semantic.successText,
      messageColor: appPalette.semantic.successText,
    };
  }

  if (tone === "danger") {
    return {
      backgroundColor: appPalette.semantic.dangerSurface,
      borderColor: appPalette.semantic.dangerBorder,
      titleColor: appPalette.semantic.dangerText,
      messageColor: appPalette.semantic.dangerText,
    };
  }

  return {
    backgroundColor: appPalette.semantic.infoSurfaceStrong,
    borderColor: appPalette.semantic.infoBorder,
    titleColor: appPalette.semantic.infoTextStrong,
    messageColor: appPalette.semantic.infoText,
  };
}

export function NativeToastHost() {
  const toast = useAppStore((state) => state.nativeToast);
  const translateY = useRef(new Animated.Value(-24)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!toast) {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: -24,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start();
      return;
    }

    translateY.setValue(-24);
    opacity.setValue(0);

    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        damping: 18,
        stiffness: 220,
        mass: 0.9,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, toast, translateY]);

  if (!toast) {
    return null;
  }

  const palette = getToastPalette(toast.tone);

  return (
    <View
      pointerEvents="box-none"
      style={{
        position: "absolute",
        top: 14,
        left: 12,
        right: 12,
        zIndex: 1000,
      }}
    >
      <Animated.View
        style={{
          transform: [{ translateY }],
          opacity,
          borderRadius: 18,
          borderWidth: 1,
          borderColor: palette.borderColor,
          backgroundColor: palette.backgroundColor,
          paddingHorizontal: 14,
          paddingVertical: 12,
          shadowColor: "#000000",
          shadowOpacity: 0.12,
          shadowRadius: 16,
          shadowOffset: { width: 0, height: 6 },
          elevation: 6,
        }}
      >
        <Text
          style={{
            color: palette.titleColor,
            fontFamily: "Montserrat",
            fontSize: 13,
            fontWeight: "800",
          }}
        >
          {toast.title}
        </Text>
        {!!toast.message && (
          <Text
            style={{
              marginTop: 4,
              color: palette.messageColor,
              fontFamily: "Montserrat",
              fontSize: 12,
              lineHeight: 17,
            }}
          >
            {toast.message}
          </Text>
        )}
      </Animated.View>
    </View>
  );
}
