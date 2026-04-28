import { useEffect, useState } from "react";
import { Linking, ScrollView, View } from "react-native";
import { z, ZodError } from "zod";

import { parseNativeAuthRoute, type NativeAuthTab, type NativeResetMode } from "@/app/router.native";
import { ScreenHeader } from "@/components/native/ScreenHeader";
import { SectionTabs } from "@/components/native/SectionTabs";
import {
  ResetSection,
  RuntimeNoticeSection,
  SignInSection,
  SignUpSection,
} from "@/components/native/auth-screen/Sections";
import { useAppStore } from "@/stores/useAppStore";
import { appPalette } from "@/theme/palette";

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});
const signUpSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  name: z.string().optional(),
});
const resetRequestSchema = z.object({ email: z.string().email("Invalid email address") });
const resetConfirmSchema = z
  .object({
    token: z.string().min(1, "Reset token is required"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export default function NativeAuthRoot() {
  const { loading, loginWithCredentials, signup, passwordReset, confirmPasswordReset } = useAppStore();
  const [activeTab, setActiveTab] = useState<NativeAuthTab>("signin");
  const [signInData, setSignInData] = useState({ email: "", password: "" });
  const [signInError, setSignInError] = useState<string>();
  const [signUpData, setSignUpData] = useState({ name: "", email: "", password: "" });
  const [signUpError, setSignUpError] = useState<string>();
  const [resetMode, setResetMode] = useState<NativeResetMode>("request");
  const [resetData, setResetData] = useState({ email: "", token: "", password: "", confirmPassword: "" });
  const [resetError, setResetError] = useState<string>();
  const [resetSuccess, setResetSuccess] = useState<string>();
  const [resetUrl, setResetUrl] = useState<string>();

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
      ? error.errors[0]?.message || "Check the form fields."
      : error instanceof Error
        ? error.message
        : "Something went wrong.";

  const submitSignIn = async () => {
    try {
      setSignInError(undefined);
      const validated = signInSchema.parse(signInData);
      await loginWithCredentials(validated.email, validated.password);
    } catch (error) {
      setSignInError(handleValidationError(error) || "Failed to sign in.");
    }
  };

  const submitSignUp = async () => {
    try {
      setSignUpError(undefined);
      const validated = signUpSchema.parse(signUpData);
      await signup(validated.email, validated.password, validated.name);
    } catch (error) {
      setSignUpError(handleValidationError(error) || "Failed to create account.");
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
      setResetSuccess(
        response.resetUrl
          ? "Reset link created. You can open it directly or paste the token below."
          : "If an account exists, a reset link has been prepared.",
      );
      setResetMode("confirm");
    } catch (error) {
      setResetError(handleValidationError(error) || "Failed to request password reset.");
    }
  };

  const submitResetConfirm = async () => {
    try {
      setResetError(undefined);
      setResetSuccess(undefined);
      const validated = resetConfirmSchema.parse(resetData);
      await confirmPasswordReset(validated.token, validated.password);
      setResetSuccess("Password updated. You can now sign in with the new password.");
      setActiveTab("signin");
      setResetMode("request");
      setResetData({ email: resetData.email, token: "", password: "", confirmPassword: "" });
    } catch (error) {
      setResetError(handleValidationError(error) || "Failed to confirm password reset.");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: appPalette.surface.background }}>
      <ScreenHeader title="Авторизация" subtitle="Email/password flow уже работает в shared store и теперь доступен в mobile shell." />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
        <RuntimeNoticeSection />
        <SectionTabs
          tabs={[
            { key: "signin", label: "Вход" },
            { key: "signup", label: "Регистрация" },
            { key: "reset", label: "Reset" },
          ]}
          activeTab={activeTab}
          onChange={(value) => setActiveTab(value as NativeAuthTab)}
        />

        {activeTab === "signin" && (
          <SignInSection
            email={signInData.email}
            password={signInData.password}
            error={signInError}
            loading={loading}
            onChangeEmail={(value) => setSignInData((prev) => ({ ...prev, email: value }))}
            onChangePassword={(value) => setSignInData((prev) => ({ ...prev, password: value }))}
            onSubmit={submitSignIn}
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
      </ScrollView>
    </View>
  );
}
