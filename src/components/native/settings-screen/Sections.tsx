import { Alert, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { ActionChip } from "@/components/native/ActionChip";
import { FieldInput } from "@/components/native/FieldInput";
import { InfoRow } from "@/components/native/InfoRow";
import { SurfaceCard } from "@/components/native/SurfaceCard";
import { appPalette } from "@/theme/palette";

import { MessageBanner, SectionTitle } from "./Primitives";

export function ProfileSection(props: {
  user: { id: string; role?: string | null; email?: string | null };
}) {
  const { t } = useTranslation();

  return (
    <SurfaceCard>
      <SectionTitle>{t("settings.profile")}</SectionTitle>
      <InfoRow label={t("settings.id")} value={props.user.id} />
      <InfoRow label={t("settings.role")} value={props.user.role || t("settings.role_user")} />
      <InfoRow label={t("common.email")} value={props.user.email || t("common.not_specified")} />
    </SurfaceCard>
  );
}

export function LanguageSection(props: {
  language: string | null | undefined;
  isSavingProfile: boolean;
  onChangeLanguage: (language: "en" | "ru" | null) => void;
}) {
  const { t } = useTranslation();

  return (
    <SurfaceCard>
      <SectionTitle>{t("settings.language")}</SectionTitle>
      <View style={{ flexDirection: "row", gap: 8 }}>
        <ActionChip onPress={() => props.onChangeLanguage(null)} tone={props.language == null ? "primary" : "secondary"}>
          {t("settings.language_system")}
        </ActionChip>
        <ActionChip onPress={() => props.onChangeLanguage("en")} tone={props.language === "en" ? "primary" : "secondary"}>
          {t("settings.language_english")}
        </ActionChip>
        <ActionChip onPress={() => props.onChangeLanguage("ru")} tone={props.language === "ru" ? "primary" : "secondary"}>
          {t("settings.language_russian")}
        </ActionChip>
      </View>
      {props.isSavingProfile && (
        <Text style={{ color: appPalette.semantic.textMuted, fontFamily: "Montserrat", fontSize: 12, lineHeight: 18 }}>{t("settings.saving_profile")}</Text>
      )}
    </SurfaceCard>
  );
}

export function TimeZoneSection(props: {
  timeZone: string;
  deviceTimeZone: string;
  onUseDeviceTimeZone: () => void;
}) {
  const { t } = useTranslation();

  return (
    <SurfaceCard>
      <SectionTitle>{t("settings.timezone")}</SectionTitle>
      <InfoRow label={t("settings.current")} value={props.timeZone} />
      <InfoRow label={t("settings.device")} value={props.deviceTimeZone} />
      <ActionChip onPress={props.onUseDeviceTimeZone} tone="secondary">
        {t("settings.use_device_timezone")}
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
  const { t } = useTranslation();

  return (
    <SurfaceCard>
      <SectionTitle>{props.title}</SectionTitle>
      <FieldInput
        label={t("common.email")}
        value={props.formData.email}
        onChangeText={(value) => props.onSetField("email", value)}
        placeholder={t("auth.email_placeholder")}
      />
      {props.hasPassword && (
        <FieldInput
          label={t("common.current_password")}
          value={props.formData.currentPassword}
          onChangeText={(value) => props.onSetField("currentPassword", value)}
          placeholder={t("common.current_password")}
          secureTextEntry
        />
      )}
      <FieldInput
        label={props.hasPassword ? t("common.new_password") : t("common.password")}
        value={props.formData.password}
        onChangeText={(value) => props.onSetField("password", value)}
        placeholder={props.hasPassword ? t("auth.new_password_placeholder") : t("auth.password_create_placeholder")}
        secureTextEntry
      />
      <FieldInput
        label={t("common.confirm_password")}
        value={props.formData.confirmPassword}
        onChangeText={(value) => props.onSetField("confirmPassword", value)}
        placeholder={t("auth.confirm_password_placeholder")}
        secureTextEntry
      />

      {!!props.error && <MessageBanner tone="danger" message={props.error} />}
      {!!props.success && <MessageBanner tone="success" message={props.success} />}

      <ActionChip onPress={() => void props.onSubmit()} tone="primary">
        {props.isSubmitting ? t("common.saving") : props.hasPassword ? t("settings.update_password") : t("settings.save_credentials")}
      </ActionChip>
    </SurfaceCard>
  );
}

export function SignOutSection(props: { onSignOut: () => Promise<void> }) {
  const { t } = useTranslation();

  return (
    <SurfaceCard>
      <ActionChip onPress={() => void props.onSignOut()} tone="danger">
        {t("settings.sign_out")}
      </ActionChip>
    </SurfaceCard>
  );
}

export function DeleteAccountSection(props: {
  isDeletingAccount: boolean;
  onDeleteAccount: () => Promise<boolean>;
}) {
  const { t } = useTranslation();

  return (
    <SurfaceCard>
      <SectionTitle>{t("settings.delete_account_title")}</SectionTitle>
      <Text style={{ color: appPalette.semantic.textMuted, fontFamily: "Montserrat", fontSize: 12, lineHeight: 18, marginBottom: 12 }}>
        {t("settings.delete_account_description")}
      </Text>
      <ActionChip
        onPress={() => {
          Alert.alert(
            t("settings.delete_account_title"),
            t("settings.delete_account_confirm"),
            [
              { text: t("common.cancel"), style: "cancel" },
              {
                text: t("common.delete"),
                style: "destructive",
                onPress: () => {
                  void props.onDeleteAccount();
                },
              },
            ]
          );
        }}
        tone="danger"
        disabled={props.isDeletingAccount}
      >
        {props.isDeletingAccount ? t("settings.deleting_account") : t("settings.delete_account")}
      </ActionChip>
    </SurfaceCard>
  );
}

export async function handleSettingsSubmit(
  submitCredentials: () => Promise<boolean>,
  hasPassword: boolean,
  t: (key: string) => string,
) {
  const ok = await submitCredentials();
  if (ok) {
    Alert.alert(t("common.done"), hasPassword ? t("settings.password_updated") : t("settings.credentials_saved"));
  }
}
