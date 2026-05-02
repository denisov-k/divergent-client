import { useEffect, useState } from "react";
import { Linking, View } from "react-native";
import { useTranslation } from "react-i18next";
import { z, ZodError } from "zod";

import { parseNativeAuthRoute, type NativeAuthTab, type NativeResetMode } from "@/app/router.native";
import { AuthScreenShell } from "@/components/native/auth-screen/Primitives";
import {
  ResetSection,
  RuntimeNoticeSection,
  SignInSection,
  SignUpSection,
} from "@/components/native/auth-screen/Sections";
import { writeSessionToken } from "@/platform/session";
import { useAppStore } from "@/stores/useAppStore";

export default function NativeAuthRoot() {
  const { t } = useTranslation();
  const {
    loading,
    loginWithCredentials,
    signup,
    passwordReset,
    confirmPasswordReset,
    refreshUser,
  } = useAppStore();
  const [activeTab, setActiveTab] = useState<NativeAuthTab>("signin");
  const [signInData, setSignInData] = useState({ email: "", password: "" });
  const [signInError, setSignInError] = useState<string>();
  const [signInSuccess, setSignInSuccess] = useState<string>();
  const [signUpData, setSignUpData] = useState({ name: "", email: "", password: "" });
  const [signUpError, setSignUpError] = useState<string>();
  const [referrerData, setReferrerData] = useState<{ referrerId?: string; referrerLinkId?: string }>({});
  const [resetMode, setResetMode] = useState<NativeResetMode>("request");
  const [resetData, setResetData] = useState({ email: "", token: "", password: "", confirmPassword: "" });
  const [resetError, setResetError] = useState<string>();
  const [resetSuccess, setResetSuccess] = useState<string>();
  const [resetUrl, setResetUrl] = useState<string>();

  const signInSchema = z.object({
    email: z.string().email(t("auth.invalid_email")),
    password: z.string().min(1, t("auth.password_required")),
  });

  const signUpSchema = z.object({
    email: z.string().email(t("auth.invalid_email")),
    password: z
      .string()
      .min(8, t("auth.password_min"))
      .regex(/[A-Z]/, t("auth.password_upper"))
      .regex(/[a-z]/, t("auth.password_lower"))
      .regex(/[0-9]/, t("auth.password_number")),
    name: z.string().optional(),
  });

  const resetRequestSchema = z.object({
    email: z.string().email(t("auth.invalid_email")),
  });

  const resetConfirmSchema = z
    .object({
      token: z.string().min(1, t("auth.reset_token_required")),
      password: z
        .string()
        .min(8, t("auth.password_min"))
        .regex(/[A-Z]/, t("auth.password_upper"))
        .regex(/[a-z]/, t("auth.password_lower"))
        .regex(/[0-9]/, t("auth.password_number")),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      path: ["confirmPassword"],
      message: t("auth.passwords_no_match"),
    });

  useEffect(() => {
    const applyLink = (url: string) => {
      const state = parseNativeAuthRoute(url);
      if (!state) return;
      if (state.tab) setActiveTab(state.tab);
      if (state.email) {
        setSignInData((prev) => ({ ...prev, email: state.email || prev.email }));
        setSignUpData((prev) => ({ ...prev, email: state.email || prev.email }));
        setResetData((prev) => ({ ...prev, email: state.email || prev.email }));
      }
      if (state.authToken) {
        setSignInError(undefined);
        setSignInSuccess(undefined);
        void writeSessionToken(state.authToken).then(() => refreshUser());
        return;
      }
      if (state.referrerId || state.referrerLinkId) {
        setReferrerData({
          referrerId: state.referrerId,
          referrerLinkId: state.referrerLinkId,
        });
      }
      if (state.resetStatus === "success") {
        setActiveTab("signin");
        setSignInError(undefined);
        setSignInSuccess(t("auth.password_updated"));
      }
      if (state.error) {
        setActiveTab("signin");
        setSignInSuccess(undefined);
        setSignInError(
          state.error === "telegram_oauth_failed"
            ? `Telegram sign in failed. Please try again.${state.errorDetail ? ` (${state.errorDetail})` : ""}`
            : "Telegram sign in is not available right now."
        );
      }
      if (state.tab === "reset") {
        setResetMode(state.resetMode || "request");
        if (state.token) setResetData((prev) => ({ ...prev, token: state.token || prev.token }));
      }
    };

    void Linking.getInitialURL().then((url) => {
      if (url) applyLink(url);
    });
    const subscription = Linking.addEventListener("url", ({ url }) => {
      applyLink(url);
    });
    return () => subscription.remove();
  }, []);

  const handleValidationError = (error: unknown) =>
    error instanceof ZodError
      ? error.errors[0]?.message || t("auth.check_fields")
      : error instanceof Error
        ? error.message
        : t("auth.check_fields");

  const submitSignIn = async () => {
    try {
      setSignInError(undefined);
      setSignInSuccess(undefined);
      const validated = signInSchema.parse(signInData);
      await loginWithCredentials(validated.email, validated.password);
    } catch (error) {
      setSignInError(handleValidationError(error) || t("auth.signin_failed"));
    }
  };

  const submitSignUp = async () => {
    try {
      setSignUpError(undefined);
      const validated = signUpSchema.parse(signUpData);
      await signup(
        validated.email,
        validated.password,
        validated.name,
        referrerData.referrerId,
        referrerData.referrerLinkId
      );
    } catch (error) {
      setSignUpError(handleValidationError(error) || t("auth.signup_failed"));
    }
  };

  const submitResetRequest = async () => {
    try {
      setResetError(undefined);
      setResetSuccess(undefined);
      setResetUrl(undefined);
      const validated = resetRequestSchema.parse({ email: resetData.email });
      const response = await passwordReset(validated.email);
      setResetUrl(response.resetUrl);
      setResetSuccess(response.resetUrl ? t("auth.reset_link_ready") : t("auth.reset_link_prepared"));
      setResetMode("confirm");
    } catch (error) {
      setResetError(handleValidationError(error) || t("auth.reset_request_failed"));
    }
  };

  const submitResetConfirm = async () => {
    try {
      setResetError(undefined);
      setResetSuccess(undefined);
      const validated = resetConfirmSchema.parse(resetData);
      await confirmPasswordReset(validated.token, validated.password);
      setResetSuccess(t("auth.password_updated"));
      setActiveTab("signin");
      setSignInSuccess(t("auth.password_updated"));
      setResetMode("request");
      setResetData({ email: resetData.email, token: "", password: "", confirmPassword: "" });
    } catch (error) {
      setResetError(handleValidationError(error) || t("auth.reset_confirm_failed"));
    }
  };

  return (
    <AuthScreenShell>
      <View style={{ flex: 1, paddingHorizontal: 16, paddingVertical: 40, justifyContent: "center" }}>
        <View style={{ width: "100%", maxWidth: 440, alignSelf: "center", gap: 12 }}>
        <RuntimeNoticeSection />

        {activeTab === "signin" && (
          <SignInSection
            email={signInData.email}
            password={signInData.password}
            error={signInError}
            success={signInSuccess}
            loading={loading}
            onChangeEmail={(value) => setSignInData((prev) => ({ ...prev, email: value }))}
            onChangePassword={(value) => setSignInData((prev) => ({ ...prev, password: value }))}
            onSubmit={submitSignIn}
            onOpenSignUp={() => setActiveTab("signup")}
            onOpenReset={() => setActiveTab("reset")}
          />
        )}

        {activeTab === "signup" && (
          <SignUpSection
            name={signUpData.name}
            email={signUpData.email}
            password={signUpData.password}
            error={signUpError}
            loading={loading}
            onChangeName={(value) => setSignUpData((prev) => ({ ...prev, name: value }))}
            onChangeEmail={(value) => setSignUpData((prev) => ({ ...prev, email: value }))}
            onChangePassword={(value) => setSignUpData((prev) => ({ ...prev, password: value }))}
            onSubmit={submitSignUp}
            onOpenSignIn={() => setActiveTab("signin")}
          />
        )}

        {activeTab === "reset" && (
          <ResetSection
            resetMode={resetMode}
            email={resetData.email}
            token={resetData.token}
            tokenProvided={Boolean(resetData.token)}
            password={resetData.password}
            confirmPassword={resetData.confirmPassword}
            error={resetError}
            success={resetSuccess}
            resetUrl={resetUrl}
            loading={loading}
            onChangeMode={setResetMode}
            onChangeEmail={(value) => setResetData((prev) => ({ ...prev, email: value }))}
            onChangeToken={(value) => setResetData((prev) => ({ ...prev, token: value }))}
            onChangePassword={(value) => setResetData((prev) => ({ ...prev, password: value }))}
            onChangeConfirmPassword={(value) => setResetData((prev) => ({ ...prev, confirmPassword: value }))}
            onSubmitRequest={submitResetRequest}
            onSubmitConfirm={submitResetConfirm}
            onBackToSignIn={() => setActiveTab("signin")}
          />
        )}
        </View>
      </View>
    </AuthScreenShell>
  );
}
