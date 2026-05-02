import { Linking, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { ActionChip } from "@/components/native/ActionChip";
import { FieldInput } from "@/components/native/FieldInput";
import { redirectToUrl } from "@/platform/browser";
import { platformCapabilities } from "@/platform/capabilities";
import { createTelegramLoginUrl } from "@/platform/telegram";
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
  onOpenSignUp: () => void;
  onOpenReset: () => void;
}) {
  const { t } = useTranslation();

  return (
    <AuthCard>
      <View style={{ gap: 8 }}>
        <CardTitle>Welcome back</CardTitle>
        <CardSubtitle>Sign in with email or continue with Telegram.</CardSubtitle>
      </View>
      <FieldInput
        label="Email"
        value={props.email}
        onChangeText={props.onChangeEmail}
        placeholder={t("auth.email_placeholder")}
        keyboardType="email-address"
        autoComplete="email"
        textContentType="emailAddress"
      />
      <FieldInput
        label="Password"
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
        label={props.loading ? "Signing in..." : "Sign in"}
      />
      {platformCapabilities.telegramLogin && (
        <>
          <DividerLabel>or</DividerLabel>
          <View
            style={{
              borderRadius: 16,
              borderWidth: 1,
              borderColor: appPalette.semantic.borderSubtle,
              backgroundColor: "#f8fafc",
              padding: 16,
              gap: 12,
            }}
          >
            <Text style={{ color: appPalette.semantic.textStrong, fontFamily: "Montserrat", fontSize: 14 }}>
              Continue with Telegram
            </Text>
            <ActionChip onPress={() => redirectToUrl(createTelegramLoginUrl("/"))}>
              Sign in with Telegram
            </ActionChip>
          </View>
        </>
      )}
      <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 12, paddingTop: 4 }}>
        <InlineLink label="Create account" onPress={props.onOpenSignUp} />
        <InlineLink label="Reset password" onPress={props.onOpenReset} tone="muted" />
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
        <CardTitle>Create account</CardTitle>
        <CardSubtitle>Start with email and password, then continue in the app.</CardSubtitle>
      </View>
      <FieldInput label="Name" value={props.name} onChangeText={props.onChangeName} placeholder={t("auth.your_name")} autoCapitalize="words" />
      <FieldInput
        label="Email"
        value={props.email}
        onChangeText={props.onChangeEmail}
        placeholder={t("auth.email_placeholder")}
        keyboardType="email-address"
        autoComplete="email"
        textContentType="emailAddress"
      />
      <FieldInput
        label="Password"
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
        label={props.loading ? "Creating account..." : "Create account"}
      />
      <View style={{ paddingTop: 4 }}>
        <InlineLink label="Already have an account? Sign in" onPress={props.onOpenSignIn} />
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
        <CardTitle>Reset password</CardTitle>
        <CardSubtitle>
          {isConfirm
            ? "Choose a new password for your account."
            : "Enter your email and we will generate a password reset link."}
        </CardSubtitle>
      </View>
      <FieldInput
        label="Email"
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
              label="Token"
              value={props.token}
              onChangeText={props.onChangeToken}
              placeholder={t("auth.reset_token_placeholder")}
            />
          )}
          <FieldInput
            label="New password"
            value={props.password}
            onChangeText={props.onChangePassword}
            placeholder={t("auth.new_password_placeholder")}
            secureTextEntry
            autoComplete="new-password"
            textContentType="newPassword"
          />
          <FieldInput
            label="Confirm password"
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
        label={props.loading ? "Submitting..." : isConfirm ? "Save new password" : "Request reset"}
      />
      <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 12, paddingTop: 4 }}>
        {!props.tokenProvided && (
          <InlineLink
            label={isConfirm ? "Back to request reset" : "Have a token? Enter it manually"}
            onPress={() => props.onChangeMode(isConfirm ? "request" : "confirm")}
          />
        )}
        <InlineLink label="Back to sign in" onPress={props.onBackToSignIn} tone="muted" />
      </View>
    </AuthCard>
  );
}
