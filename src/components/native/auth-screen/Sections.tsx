import { Linking, Text, View } from "react-native";

import { ActionChip } from "@/components/native/ActionChip";
import { FieldInput } from "@/components/native/FieldInput";
import { SectionTabs } from "@/components/native/SectionTabs";
import { SurfaceCard } from "@/components/native/SurfaceCard";
import { platformCapabilities } from "@/platform/capabilities";
import { appPalette } from "@/theme/palette";

import { CardTitle, ErrorBanner, SuccessBanner } from "./Primitives";

export function RuntimeNoticeSection() {
  if (platformCapabilities.telegramLogin) {
    return null;
  }

  return (
    <SurfaceCard>
      <CardTitle>Возможности mobile runtime</CardTitle>
      <Text style={{ color: appPalette.semantic.textMuted, fontFamily: "Montserrat", fontSize: 12, lineHeight: 18 }}>
        Telegram login сейчас остаётся web-only сценарием и не включён в standalone mobile runtime.
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
  return (
    <SurfaceCard>
      <CardTitle>Войти в аккаунт</CardTitle>
      <FieldInput label="Email" value={props.email} onChangeText={props.onChangeEmail} placeholder="you@example.com" />
      <FieldInput
        label="Password"
        value={props.password}
        onChangeText={props.onChangePassword}
        placeholder="Enter your password"
        secureTextEntry
      />
      <ErrorBanner message={props.error} />
      <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
        <ActionChip onPress={() => void props.onSubmit()} tone="primary">
          {props.loading ? "Signing in..." : "Sign in"}
        </ActionChip>
        <ActionChip onPress={props.onOpenReset}>Reset password</ActionChip>
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
  return (
    <SurfaceCard>
      <CardTitle>Создать аккаунт</CardTitle>
      <FieldInput label="Name" value={props.name} onChangeText={props.onChangeName} placeholder="Your name" />
      <FieldInput label="Email" value={props.email} onChangeText={props.onChangeEmail} placeholder="you@example.com" />
      <FieldInput
        label="Password"
        value={props.password}
        onChangeText={props.onChangePassword}
        placeholder="8+ chars, upper/lowercase and number"
        secureTextEntry
      />
      <ErrorBanner message={props.error} />
      <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
        <ActionChip onPress={() => void props.onSubmit()} tone="primary">
          {props.loading ? "Creating..." : "Create account"}
        </ActionChip>
        <ActionChip onPress={props.onOpenSignIn}>Already have account</ActionChip>
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
  return (
    <SurfaceCard>
      <CardTitle>Reset password</CardTitle>
      <SectionTabs
        tabs={[
          { key: "request", label: "Запрос" },
          { key: "confirm", label: "Подтверждение" },
        ]}
        activeTab={props.resetMode}
        onChange={(value) => props.onChangeMode(value as "request" | "confirm")}
      />
      <FieldInput label="Email" value={props.email} onChangeText={props.onChangeEmail} placeholder="you@example.com" />
      {props.resetMode === "confirm" && (
        <>
          <FieldInput label="Reset token" value={props.token} onChangeText={props.onChangeToken} placeholder="Paste token from the link" />
          <FieldInput
            label="New password"
            value={props.password}
            onChangeText={props.onChangePassword}
            placeholder="Create a new password"
            secureTextEntry
          />
          <FieldInput
            label="Confirm password"
            value={props.confirmPassword}
            onChangeText={props.onChangeConfirmPassword}
            placeholder="Repeat the new password"
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
          <ActionChip onPress={() => void Linking.openURL(props.resetUrl!)}>Open reset link</ActionChip>
        </View>
      )}
      <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
        {props.resetMode === "request" ? (
          <ActionChip onPress={() => void props.onSubmitRequest()} tone="primary">
            {props.loading ? "Submitting..." : "Request reset"}
          </ActionChip>
        ) : (
          <ActionChip onPress={() => void props.onSubmitConfirm()} tone="primary">
            {props.loading ? "Saving..." : "Save new password"}
          </ActionChip>
        )}
        <ActionChip onPress={props.onBackToSignIn}>Back to sign in</ActionChip>
      </View>
    </SurfaceCard>
  );
}
