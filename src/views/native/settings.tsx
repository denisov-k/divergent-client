import { Alert, ScrollView, Text, View } from "react-native";

import { ActionChip } from "@/components/native/ActionChip";
import { FieldInput } from "@/components/native/FieldInput";
import { InfoRow } from "@/components/native/InfoRow";
import { ScreenHeader } from "@/components/native/ScreenHeader";
import { SurfaceCard } from "@/components/native/SurfaceCard";
import { useSettingsScreen } from "@/shared/screens/settings/useSettingsScreen";

export default function NativeSettingsScreen() {
  const {
    user,
    formData,
    error,
    success,
    isSubmitting,
    isSavingProfile,
    hasPassword,
    credentialsTitle,
    deviceTimeZone,
    language,
    timeZone,
    setField,
    submitCredentials,
    changeLanguage,
    changeTimeZone,
    signOut,
  } = useSettingsScreen();

  if (!user) {
    return null;
  }

  const handleSubmit = async () => {
    const ok = await submitCredentials();
    if (ok) {
      Alert.alert("Готово", hasPassword ? "Пароль обновлён." : "Учётные данные сохранены.");
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f8fafc" }}>
      <ScreenHeader title="Настройки" subtitle="Профиль, язык, часовой пояс и вход." />

      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
        <SurfaceCard>
          <Text style={{ fontSize: 16, fontWeight: "600", color: "#0f172a" }}>Профиль</Text>
          <InfoRow label="ID" value={user.id} />
          <InfoRow label="Роль" value={user.role || "user"} />
          <InfoRow label="Email" value={user.email || "Не указан"} />
        </SurfaceCard>

        <SurfaceCard>
          <Text style={{ fontSize: 16, fontWeight: "600", color: "#0f172a" }}>Язык</Text>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <ActionChip onPress={() => void changeLanguage("en")} tone={language === "en" ? "primary" : "secondary"}>
              English
            </ActionChip>
            <ActionChip onPress={() => void changeLanguage("ru")} tone={language === "ru" ? "primary" : "secondary"}>
              Русский
            </ActionChip>
          </View>
          {isSavingProfile && <Text style={{ color: "#64748b" }}>Сохраняем профиль…</Text>}
        </SurfaceCard>

        <SurfaceCard>
          <Text style={{ fontSize: 16, fontWeight: "600", color: "#0f172a" }}>Часовой пояс</Text>
          <InfoRow label="Текущий" value={timeZone} />
          <InfoRow label="Устройство" value={deviceTimeZone} />
          <ActionChip onPress={() => void changeTimeZone(deviceTimeZone)} tone="secondary">
            Использовать timezone устройства
          </ActionChip>
        </SurfaceCard>

        <SurfaceCard>
          <Text style={{ fontSize: 16, fontWeight: "600", color: "#0f172a" }}>{credentialsTitle}</Text>

          <FieldInput
            label="Email"
            value={formData.email}
            onChangeText={(value) => setField("email", value)}
            placeholder="you@example.com"
          />

          {hasPassword && (
            <FieldInput
              label="Current password"
              value={formData.currentPassword}
              onChangeText={(value) => setField("currentPassword", value)}
              placeholder="Enter current password"
              secureTextEntry
            />
          )}

          <FieldInput
            label={hasPassword ? "New password" : "Password"}
            value={formData.password}
            onChangeText={(value) => setField("password", value)}
            placeholder={hasPassword ? "Create a new password" : "Create a password"}
            secureTextEntry
          />

          <FieldInput
            label="Confirm password"
            value={formData.confirmPassword}
            onChangeText={(value) => setField("confirmPassword", value)}
            placeholder="Repeat the password"
            secureTextEntry
          />

          {!!error && (
            <View style={{ backgroundColor: "#fef2f2", borderRadius: 12, padding: 12 }}>
              <Text style={{ color: "#b91c1c" }}>{error}</Text>
            </View>
          )}

          {!!success && (
            <View style={{ backgroundColor: "#dcfce7", borderRadius: 12, padding: 12 }}>
              <Text style={{ color: "#166534" }}>{success}</Text>
            </View>
          )}

          <ActionChip onPress={() => void handleSubmit()} tone="primary">
            {isSubmitting ? "Saving..." : hasPassword ? "Update password" : "Save credentials"}
          </ActionChip>
        </SurfaceCard>

        <SurfaceCard>
          <ActionChip onPress={() => void handleSignOut()} tone="danger">
            Выйти из аккаунта
          </ActionChip>
        </SurfaceCard>
      </ScrollView>
    </View>
  );
}
