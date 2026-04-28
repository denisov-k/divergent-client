import { Alert, Text, View } from "react-native";

import { ActionChip } from "@/components/native/ActionChip";
import { FieldInput } from "@/components/native/FieldInput";
import { InfoRow } from "@/components/native/InfoRow";
import { SurfaceCard } from "@/components/native/SurfaceCard";

import { MessageBanner, SectionTitle } from "./Primitives";

export function ProfileSection(props: {
  user: { id: string; role?: string | null; email?: string | null };
}) {
  return (
    <SurfaceCard>
      <SectionTitle>Профиль</SectionTitle>
      <InfoRow label="ID" value={props.user.id} />
      <InfoRow label="Роль" value={props.user.role || "user"} />
      <InfoRow label="Email" value={props.user.email || "Не указан"} />
    </SurfaceCard>
  );
}

export function LanguageSection(props: {
  language: string;
  isSavingProfile: boolean;
  onChangeLanguage: (language: "en" | "ru") => void;
}) {
  return (
    <SurfaceCard>
      <SectionTitle>Язык</SectionTitle>
      <View style={{ flexDirection: "row", gap: 8 }}>
        <ActionChip onPress={() => props.onChangeLanguage("en")} tone={props.language === "en" ? "primary" : "secondary"}>
          English
        </ActionChip>
        <ActionChip onPress={() => props.onChangeLanguage("ru")} tone={props.language === "ru" ? "primary" : "secondary"}>
          Русский
        </ActionChip>
      </View>
      {props.isSavingProfile && (
        <Text style={{ color: "#64748b", fontFamily: "Montserrat", fontSize: 12, lineHeight: 18 }}>Сохраняем профиль…</Text>
      )}
    </SurfaceCard>
  );
}

export function TimeZoneSection(props: {
  timeZone: string;
  deviceTimeZone: string;
  onUseDeviceTimeZone: () => void;
}) {
  return (
    <SurfaceCard>
      <SectionTitle>Часовой пояс</SectionTitle>
      <InfoRow label="Текущий" value={props.timeZone} />
      <InfoRow label="Устройство" value={props.deviceTimeZone} />
      <ActionChip onPress={props.onUseDeviceTimeZone} tone="secondary">
        Использовать timezone устройства
      </ActionChip>
    </SurfaceCard>
  );
}

export function CredentialsSection(props: {
  title: string;
  formData: {
    email: string;
    currentPassword: string;
    password: string;
    confirmPassword: string;
  };
  hasPassword: boolean;
  error?: string | null;
  success?: string | null;
  isSubmitting: boolean;
  onSetField: (name: "email" | "currentPassword" | "password" | "confirmPassword", value: string) => void;
  onSubmit: () => Promise<void>;
}) {
  return (
    <SurfaceCard>
      <SectionTitle>{props.title}</SectionTitle>
      <FieldInput
        label="Email"
        value={props.formData.email}
        onChangeText={(value) => props.onSetField("email", value)}
        placeholder="you@example.com"
      />
      {props.hasPassword && (
        <FieldInput
          label="Current password"
          value={props.formData.currentPassword}
          onChangeText={(value) => props.onSetField("currentPassword", value)}
          placeholder="Enter current password"
          secureTextEntry
        />
      )}
      <FieldInput
        label={props.hasPassword ? "New password" : "Password"}
        value={props.formData.password}
        onChangeText={(value) => props.onSetField("password", value)}
        placeholder={props.hasPassword ? "Create a new password" : "Create a password"}
        secureTextEntry
      />
      <FieldInput
        label="Confirm password"
        value={props.formData.confirmPassword}
        onChangeText={(value) => props.onSetField("confirmPassword", value)}
        placeholder="Repeat the password"
        secureTextEntry
      />

      {!!props.error && <MessageBanner tone="danger" message={props.error} />}
      {!!props.success && <MessageBanner tone="success" message={props.success} />}

      <ActionChip onPress={() => void props.onSubmit()} tone="primary">
        {props.isSubmitting ? "Saving..." : props.hasPassword ? "Update password" : "Save credentials"}
      </ActionChip>
    </SurfaceCard>
  );
}

export function SignOutSection(props: { onSignOut: () => Promise<void> }) {
  return (
    <SurfaceCard>
      <ActionChip onPress={() => void props.onSignOut()} tone="danger">
        Выйти из аккаунта
      </ActionChip>
    </SurfaceCard>
  );
}

export async function handleSettingsSubmit(submitCredentials: () => Promise<boolean>, hasPassword: boolean) {
  const ok = await submitCredentials();
  if (ok) {
    Alert.alert("Готово", hasPassword ? "Пароль обновлён." : "Учётные данные сохранены.");
  }
}
