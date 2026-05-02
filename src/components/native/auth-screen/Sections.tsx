import { Linking, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { ActionChip } from "@/components/native/ActionChip";
import { FieldInput } from "@/components/native/FieldInput";
import { platformCapabilities } from "@/platform/capabilities";
import { appPalette } from "@/theme/palette";

import {
  AuthCard,
  CardSubtitle,
  CardTitle,
  DividerLabel,
  ErrorBanner,
  InlineLink,
  PrimaryButton,
  SuccessBanner,
  TelegramButton,
} from "./Primitives";

export function RuntimeNoticeSection() {
  return null;
}

export function SignInSection(props: {
  email: string;
  password: string;
  error?: string;
  success?: string;
  loading: boolean;
  onChangeEmail: (value: string) => void;
  onChangePassword: (value: string) => void;
  onSubmit: () => Promise<void>;
  onTelegramSignIn: () => Promise<void>;
  onOpenSignUp: () => void;
  onOpenReset: () => void;
}) {
  const { t } = useTranslation();

  return (
    <AuthCard>
      <View style={{ gap: 8 }}>
        <CardTitle>{t("auth.signin_welcome_title")}</CardTitle>
        <CardSubtitle>{t("auth.signin_welcome_subtitle")}</CardSubtitle>
      </View>
      <FieldInput
        label={t("common.email")}
        value={props.email}
        onChangeText={props.onChangeEmail}
        placeholder={t("auth.email_placeholder")}
        keyboardType="email-address"
        autoComplete="email"
        textContentType="emailAddress"
      />
      <FieldInput
        label={t("common.password")}
        value={props.password}
        onChangeText={props.onChangePassword}
        placeholder={t("auth.password_placeholder")}
        secureTextEntry
        autoComplete="current-password"
        textContentType="password"
      />
      <ErrorBanner message={props.error} />
      <SuccessBanner message={props.success} />
      <PrimaryButton
        onPress={() => void props.onSubmit()}
        disabled={props.loading}
        label={props.loading ? t("auth.signin_submitting") : t("auth.signin_submit")}
      />
      {platformCapabilities.telegramLogin && (
        <>
          <DividerLabel>{t("auth.or_divider")}</DividerLabel>
          <TelegramButton
            onPress={() => void props.onTelegramSignIn()}
            disabled={props.loading}
            label={t("auth.telegram_signin")}
          />
        </>
      )}
      <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 12, paddingTop: 4 }}>
        <InlineLink label={t("auth.create_account_link")} onPress={props.onOpenSignUp} />
        <InlineLink label={t("auth.reset_password")} onPress={props.onOpenReset} tone="muted" />
      </View>
    </AuthCard>
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
    <AuthCard>
      <View style={{ gap: 8 }}>
        <CardTitle>{t("auth.signup_title")}</CardTitle>
        <CardSubtitle>{t("auth.signup_subtitle")}</CardSubtitle>
      </View>
      <FieldInput label={t("common.name")} value={props.name} onChangeText={props.onChangeName} placeholder={t("auth.your_name")} autoCapitalize="words" />
      <FieldInput
        label={t("common.email")}
        value={props.email}
        onChangeText={props.onChangeEmail}
        placeholder={t("auth.email_placeholder")}
        keyboardType="email-address"
        autoComplete="email"
        textContentType="emailAddress"
      />
      <FieldInput
        label={t("common.password")}
        value={props.password}
        onChangeText={props.onChangePassword}
        placeholder={t("auth.password_create_placeholder")}
        secureTextEntry
        autoComplete="new-password"
        textContentType="newPassword"
      />
      <ErrorBanner message={props.error} />
      <PrimaryButton
        onPress={() => void props.onSubmit()}
        disabled={props.loading}
        label={props.loading ? t("auth.signup_submitting") : t("auth.signup_submit")}
      />
      <View style={{ paddingTop: 4 }}>
        <InlineLink label={t("auth.already_have_account_signin")} onPress={props.onOpenSignIn} />
      </View>
    </AuthCard>
  );
}

export function ResetSection(props: {
  resetMode: "request" | "confirm";
  email: string;
  token: string;
  tokenProvided?: boolean;
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
  const showTokenField = props.resetMode === "confirm" && !props.tokenProvided;
  const isConfirm = props.resetMode === "confirm";

  return (
    <AuthCard>
      <View style={{ gap: 8 }}>
        <CardTitle>{t("auth.reset_title")}</CardTitle>
        <CardSubtitle>{isConfirm ? t("auth.reset_confirm_subtitle") : t("auth.reset_request_subtitle")}</CardSubtitle>
      </View>
      <FieldInput
        label={t("common.email")}
        value={props.email}
        onChangeText={props.onChangeEmail}
        placeholder={t("auth.email_placeholder")}
        keyboardType="email-address"
        autoComplete="email"
        textContentType="emailAddress"
        editable={!isConfirm || !props.tokenProvided}
      />
      {isConfirm && (
        <>
          {showTokenField && (
            <FieldInput
              label={t("auth.reset_token_label")}
              value={props.token}
              onChangeText={props.onChangeToken}
              placeholder={t("auth.reset_token_placeholder")}
            />
          )}
          <FieldInput
            label={t("common.new_password")}
            value={props.password}
            onChangeText={props.onChangePassword}
            placeholder={t("auth.new_password_placeholder")}
            secureTextEntry
            autoComplete="new-password"
            textContentType="newPassword"
          />
          <FieldInput
            label={t("common.confirm_password")}
            value={props.confirmPassword}
            onChangeText={props.onChangeConfirmPassword}
            placeholder={t("auth.confirm_password_placeholder")}
            secureTextEntry
            autoComplete="new-password"
            textContentType="newPassword"
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
      <PrimaryButton
        onPress={() => void (isConfirm ? props.onSubmitConfirm() : props.onSubmitRequest())}
        disabled={props.loading}
        label={props.loading ? t("auth.reset_request_submitting") : isConfirm ? t("auth.reset_confirm_submit") : t("auth.reset_request_submit")}
      />
      <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 12, paddingTop: 4 }}>
        {!props.tokenProvided && (
          <InlineLink
            label={isConfirm ? t("auth.back_to_reset_request") : t("auth.have_token")}
            onPress={() => props.onChangeMode(isConfirm ? "request" : "confirm")}
          />
        )}
        <InlineLink label={t("auth.back_to_signin")} onPress={props.onBackToSignIn} tone="muted" />
      </View>
    </AuthCard>
  );
}
