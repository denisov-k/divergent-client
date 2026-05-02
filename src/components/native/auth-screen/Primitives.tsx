import type { ReactNode } from "react";
import { Pressable, Text, View } from "react-native";

import { appPalette } from "@/theme/palette";

export function AuthScreenShell(props: { children: ReactNode }) {
  return (
    <View style={{ flex: 1, backgroundColor: "#ffffff", overflow: "hidden" }}>
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          inset: 0,
        }}
      >
        <View
          style={{
            position: "absolute",
            left: -96,
            top: -80,
            height: 224,
            width: 224,
            borderRadius: 999,
            backgroundColor: "#e0f2fe",
            opacity: 0.9,
          }}
        />
        <View
          style={{
            position: "absolute",
            right: -80,
            top: 96,
            height: 192,
            width: 192,
            borderRadius: 999,
            backgroundColor: "#dbeafe",
            opacity: 0.8,
          }}
        />
        <View
          style={{
            position: "absolute",
            bottom: -96,
            left: "50%",
            marginLeft: -128,
            height: 256,
            width: 256,
            borderRadius: 999,
            backgroundColor: "#e5e7eb",
            opacity: 0.7,
          }}
        />
      </View>
      {props.children}
    </View>
  );
}

export function AuthCard(props: { children: ReactNode }) {
  return (
    <View
      style={{
        width: "100%",
        borderRadius: 24,
        borderWidth: 1,
        borderColor: "#dbe3ee",
        backgroundColor: "rgba(255,255,255,0.96)",
        padding: 24,
        gap: 16,
        shadowColor: "#0f172a",
        shadowOpacity: 0.1,
        shadowRadius: 24,
        shadowOffset: { width: 0, height: 12 },
        elevation: 6,
      }}
    >
      {props.children}
    </View>
  );
}

export function ErrorBanner(props: { message?: string }) {
  if (!props.message) return null;

  return (
    <View style={{ backgroundColor: appPalette.semantic.dangerSurface, borderRadius: 12, padding: 12 }}>
      <Text style={{ color: appPalette.semantic.dangerText, fontFamily: "Montserrat", fontSize: 12, lineHeight: 18 }}>
        {props.message}
      </Text>
    </View>
  );
}

export function SuccessBanner(props: { message?: string }) {
  if (!props.message) return null;

  return (
    <View style={{ backgroundColor: appPalette.semantic.successSurface, borderRadius: 12, padding: 12 }}>
      <Text style={{ color: appPalette.semantic.successText, fontFamily: "Montserrat", fontSize: 12, lineHeight: 18 }}>
        {props.message}
      </Text>
    </View>
  );
}

export function CardTitle(props: { children: string }) {
  return (
    <Text style={{ fontSize: 28, fontWeight: "700", color: appPalette.semantic.textStrong, fontFamily: "Montserrat", textAlign: "center" }}>
      {props.children}
    </Text>
  );
}

export function CardSubtitle(props: { children: string }) {
  return (
    <Text
      style={{
        color: appPalette.semantic.textMuted,
        fontFamily: "Montserrat",
        fontSize: 13,
        lineHeight: 20,
        textAlign: "center",
      }}
    >
      {props.children}
    </Text>
  );
}

export function PrimaryButton(props: { label: string; onPress?: () => void; disabled?: boolean }) {
  return (
    <Pressable
      disabled={props.disabled}
      onPress={props.onPress}
      style={{
        minHeight: 44,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: props.disabled ? "#93c5fd" : appPalette.brand.primaryStrong,
        paddingHorizontal: 16,
        paddingVertical: 12,
      }}
    >
      <Text
        style={{
          color: "#ffffff",
          fontFamily: "Montserrat",
          fontSize: 14,
          fontWeight: "700",
        }}
      >
        {props.label}
      </Text>
    </Pressable>
  );
}

export function DividerLabel(props: { children: string }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
      <View style={{ flex: 1, height: 1, backgroundColor: appPalette.semantic.borderSubtle }} />
      <Text
        style={{
          fontSize: 10,
          fontWeight: "700",
          letterSpacing: 2,
          textTransform: "uppercase",
          color: appPalette.semantic.textMuted,
          fontFamily: "Montserrat",
        }}
      >
        {props.children}
      </Text>
      <View style={{ flex: 1, height: 1, backgroundColor: appPalette.semantic.borderSubtle }} />
    </View>
  );
}

export function InlineLink(props: { label: string; onPress?: () => void; tone?: "primary" | "muted" }) {
  return (
    <Pressable onPress={props.onPress}>
      <Text
        style={{
          color: props.tone === "muted" ? appPalette.semantic.textMuted : appPalette.brand.primaryStrong,
          fontFamily: "Montserrat",
          fontSize: 13,
          fontWeight: "600",
          textAlign: "center",
        }}
      >
        {props.label}
      </Text>
    </Pressable>
  );
}
