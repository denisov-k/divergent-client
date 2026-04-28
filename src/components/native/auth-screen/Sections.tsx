import { Linking, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { ActionChip } from "@/components/native/ActionChip";
import { FieldInput } from "@/components/native/FieldInput";
import { SectionTabs } from "@/components/native/SectionTabs";
import { SurfaceCard } from "@/components/native/SurfaceCard";
import { platformCapabilities } from "@/platform/capabilities";
import { appPalette } from "@/theme/palette";

import { CardTitle, ErrorBanner, SuccessBanner } from "./Primitives";

export function RuntimeNoticeSection() {
  const { t } = useTranslation();

  if (platformCapabilities.telegramLogin) {
    return null;
  }

  return (
    <SurfaceCard>
      <CardTitle>{t("auth.runtime_title")}</CardTitle>
      <Text style={{ color: appPalette.semantic.textMuted, fontFamily: "Montserrat", fontSize: 12, lineHeight: 18 }}>
        {t("auth.runtime_description")}
      </Text>
    </SurfaceCard>
  );
}

export function SignInSection(props: {
  email: string;
  password: string;
  error?: string;
  loading: boolean;
  onChangeEmail: (value: string) => void;
  onChangePassword: (value: string) => void;
  onSubmit: () => Promise<void>;
  onOpenReset: () => void;
}) {
  const { t } = useTranslation();

  return (
    <SurfaceCard>
      <CardTitle>{t("auth.signin_title")}</CardTitle>
      <FieldInput label="Email" value={props.email} onChangeText={props.onChangeEmail} placeholder={t("auth.email_placeholder")} />
      <FieldInput
        label={t("common.password")}
        value={props.password}
        onChangeText={props.onChangePassword}
        placeholder={t("auth.password_placeholder")}
        secureTextEntry
      />
      <ErrorBanner message={props.error} />
      <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
        <ActionChip onPress={() => void props.onSubmit()} tone="primary">
          {props.loading ? t("auth.signin_submitting") : t("auth.signin_submit")}
        </ActionChip>
        <ActionChip onPress={props.onOpenReset}>{t("auth.reset_password")}</ActionChip>
      </View>
    </SurfaceCard>
  );
}

export function SignUpSection(props: {
  name: string;
  email: string;
  password: string;
  error?: string;
  loading: boolean;
  onChangeName: (value: string) => void;
  onChangeEmail: (value: string) => void;
  onChangePassword: (value: string) => void;
  onSubmit: () => Promise<void>;
  onOpenSignIn: () => void;
}) {
  const { t } = useTranslation();

  return (
    <SurfaceCard>
      <CardTitle>{t("auth.signup_title")}</CardTitle>
      <FieldInput label={t("common.name")} value={props.name} onChangeText={props.onChangeName} placeholder={t("auth.your_name")} />
      <FieldInput label="Email" value={props.email} onChangeText={props.onChangeEmail} placeholder={t("auth.email_placeholder")} />
      <FieldInput
        label={t("common.password")}
        value={props.password}
        onChangeText={props.onChangePassword}
        placeholder={t("auth.password_create_placeholder")}
        secureTextEntry
      />
      <ErrorBanner message={props.error} />
      <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
        <ActionChip onPress={() => void props.onSubmit()} tone="primary">
          {props.loading ? t("auth.signup_submitting") : t("auth.signup_submit")}
        </ActionChip>
        <ActionChip onPress={props.onOpenSignIn}>{t("auth.already_have_account")}</ActionChip>
      </View>
    </SurfaceCard>
  );
}

export function ResetSection(props: {
  resetMode: "request" | "confirm";
  email: string;
  token: string;
  password: string;
  confirmPassword: string;
  error?: string;
  success?: string;
  resetUrl?: string;
  loading: boolean;
  onChangeMode: (value: "request" | "confirm") => void;
  onChangeEmail: (value: string) => void;
  onChangeToken: (value: string) => void;
  onChangePassword: (value: string) => void;
  onChangeConfirmPassword: (value: string) => void;
  onSubmitRequest: () => Promise<void>;
  onSubmitConfirm: () => Promise<void>;
  onBackToSignIn: () => void;
}) {
  const { t } = useTranslation();

  return (
    <SurfaceCard>
      <CardTitle>{t("auth.reset_title")}</CardTitle>
      <SectionTabs
        tabs={[
          { key: "request", label: t("auth.reset_request_tab") },
          { key: "confirm", label: t("auth.reset_confirm_tab") },
        ]}
        activeTab={props.resetMode}
        onChange={(value) => props.onChangeMode(value as "request" | "confirm")}
      />
      <FieldInput label="Email" value={props.email} onChangeText={props.onChangeEmail} placeholder={t("auth.email_placeholder")} />
      {props.resetMode === "confirm" && (
        <>
          <FieldInput label={t("auth.reset_confirm_tab")} value={props.token} onChangeText={props.onChangeToken} placeholder={t("auth.reset_token_placeholder")} />
          <FieldInput
            label={t("common.new_password")}
            value={props.password}
            onChangeText={props.onChangePassword}
            placeholder={t("auth.new_password_placeholder")}
            secureTextEntry
          />
          <FieldInput
            label={t("common.confirm_password")}
            value={props.confirmPassword}
            onChangeText={props.onChangeConfirmPassword}
            placeholder={t("auth.confirm_password_placeholder")}
            secureTextEntry
          />
        </>
      )}
      <ErrorBanner message={props.error} />
      <SuccessBanner message={props.success} />
      {!!props.resetUrl && (
        <View style={{ gap: 8 }}>
          <Text style={{ color: appPalette.semantic.successText, fontFamily: "Montserrat", fontSize: 12, lineHeight: 18 }} selectable>
            {props.resetUrl}
          </Text>
          <ActionChip onPress={() => void Linking.openURL(props.resetUrl!)}>{t("common.open")}</ActionChip>
        </View>
      )}
      <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
        {props.resetMode === "request" ? (
          <ActionChip onPress={() => void props.onSubmitRequest()} tone="primary">
            {props.loading ? t("auth.reset_request_submitting") : t("auth.reset_request_submit")}
          </ActionChip>
        ) : (
          <ActionChip onPress={() => void props.onSubmitConfirm()} tone="primary">
            {props.loading ? t("auth.reset_confirm_submitting") : t("auth.reset_confirm_submit")}
          </ActionChip>
        )}
        <ActionChip onPress={props.onBackToSignIn}>{t("auth.back_to_signin")}</ActionChip>
      </View>
    </SurfaceCard>
  );
}
