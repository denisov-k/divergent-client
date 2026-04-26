import { useEffect, useState } from "react";
import { Linking, ScrollView, Text, View } from "react-native";
import { z, ZodError } from "zod";

import { ActionChip } from "@/components/native/ActionChip";
import { FieldInput } from "@/components/native/FieldInput";
import { platformCapabilities } from "@/platform/capabilities";
import { ScreenHeader } from "@/components/native/ScreenHeader";
import { SectionTabs } from "@/components/native/SectionTabs";
import { SurfaceCard } from "@/components/native/SurfaceCard";
import { parseNativeAuthRoute, type NativeAuthTab, type NativeResetMode } from "@/app/router.native";
import { useAppStore } from "@/stores/useAppStore";

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

const resetRequestSchema = z.object({
  email: z.string().email("Invalid email address"),
});

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

function ErrorBanner({ message }: { message?: string }) {
  if (!message) return null;

  return (
    <View style={{ backgroundColor: "#fef2f2", borderRadius: 12, padding: 12 }}>
      <Text style={{ color: "#b91c1c" }}>{message}</Text>
    </View>
  );
}

function SuccessBanner({ message }: { message?: string }) {
  if (!message) return null;

  return (
    <View style={{ backgroundColor: "#dcfce7", borderRadius: 12, padding: 12 }}>
      <Text style={{ color: "#166534" }}>{message}</Text>
    </View>
  );
}

export default function NativeAuthRoot() {
  const { loading, loginWithCredentials, signup, passwordReset, confirmPasswordReset } = useAppStore();
  const [activeTab, setActiveTab] = useState<NativeAuthTab>("signin");

  const [signInData, setSignInData] = useState({ email: "", password: "" });
  const [signInError, setSignInError] = useState<string>();

  const [signUpData, setSignUpData] = useState({ name: "", email: "", password: "" });
  const [signUpError, setSignUpError] = useState<string>();

  const [resetMode, setResetMode] = useState<NativeResetMode>("request");
  const [resetData, setResetData] = useState({
    email: "",
    token: "",
    password: "",
    confirmPassword: "",
  });
  const [resetError, setResetError] = useState<string>();
  const [resetSuccess, setResetSuccess] = useState<string>();
  const [resetUrl, setResetUrl] = useState<string>();

  useEffect(() => {
    const applyLink = (url: string) => {
      const state = parseNativeAuthRoute(url);
      if (!state) {
        return;
      }

      if (state.tab) {
        setActiveTab(state.tab);
      }

      if (state.email) {
        setSignInData((prev) => ({ ...prev, email: state.email || prev.email }));
        setSignUpData((prev) => ({ ...prev, email: state.email || prev.email }));
        setResetData((prev) => ({ ...prev, email: state.email || prev.email }));
      }

      if (state.tab === "reset") {
        setResetMode(state.resetMode || "request");
        if (state.token) {
          setResetData((prev) => ({ ...prev, token: state.token || prev.token }));
        }
      }
    };

    void Linking.getInitialURL().then((url) => {
      if (url) {
        applyLink(url);
      }
    });

    const subscription = Linking.addEventListener("url", ({ url }) => {
      applyLink(url);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const handleValidationError = (error: unknown) => {
    if (error instanceof ZodError) {
      return error.errors[0]?.message || "Check the form fields.";
    }

    return error instanceof Error ? error.message : "Something went wrong.";
  };

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
          : "If an account exists, a reset link has been prepared."
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
    <View style={{ flex: 1, backgroundColor: "#f8fafc" }}>
      <ScreenHeader
        title="Авторизация"
        subtitle="Email/password flow уже работает в shared store и теперь доступен в mobile shell."
      />

      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
        {!platformCapabilities.telegramLogin && (
          <SurfaceCard>
            <Text style={{ fontSize: 16, fontWeight: "700", color: "#0f172a" }}>Возможности mobile runtime</Text>
            <Text style={{ color: "#64748b" }}>
              Telegram login сейчас остаётся web-only сценарием и не включён в standalone mobile runtime.
            </Text>
          </SurfaceCard>
        )}

        <SectionTabs
          tabs={[
            { key: "signin", label: "Вход" },
            { key: "signup", label: "Регистрация" },
            { key: "reset", label: "Reset" },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        {activeTab === "signin" && (
          <SurfaceCard>
            <Text style={{ fontSize: 18, fontWeight: "700", color: "#0f172a" }}>Войти в аккаунт</Text>
            <FieldInput
              label="Email"
              value={signInData.email}
              onChangeText={(value) => setSignInData((prev) => ({ ...prev, email: value }))}
              placeholder="you@example.com"
            />
            <FieldInput
              label="Password"
              value={signInData.password}
              onChangeText={(value) => setSignInData((prev) => ({ ...prev, password: value }))}
              placeholder="Enter your password"
              secureTextEntry
            />
            <ErrorBanner message={signInError} />
            <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
              <ActionChip onPress={() => void submitSignIn()} tone="primary">
                {loading ? "Signing in..." : "Sign in"}
              </ActionChip>
              <ActionChip onPress={() => setActiveTab("reset")}>Reset password</ActionChip>
            </View>
          </SurfaceCard>
        )}

        {activeTab === "signup" && (
          <SurfaceCard>
            <Text style={{ fontSize: 18, fontWeight: "700", color: "#0f172a" }}>Создать аккаунт</Text>
            <FieldInput
              label="Name"
              value={signUpData.name}
              onChangeText={(value) => setSignUpData((prev) => ({ ...prev, name: value }))}
              placeholder="Your name"
            />
            <FieldInput
              label="Email"
              value={signUpData.email}
              onChangeText={(value) => setSignUpData((prev) => ({ ...prev, email: value }))}
              placeholder="you@example.com"
            />
            <FieldInput
              label="Password"
              value={signUpData.password}
              onChangeText={(value) => setSignUpData((prev) => ({ ...prev, password: value }))}
              placeholder="8+ chars, upper/lowercase and number"
              secureTextEntry
            />
            <ErrorBanner message={signUpError} />
            <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
              <ActionChip onPress={() => void submitSignUp()} tone="primary">
                {loading ? "Creating..." : "Create account"}
              </ActionChip>
              <ActionChip onPress={() => setActiveTab("signin")}>Already have account</ActionChip>
            </View>
          </SurfaceCard>
        )}

        {activeTab === "reset" && (
          <SurfaceCard>
            <Text style={{ fontSize: 18, fontWeight: "700", color: "#0f172a" }}>Reset password</Text>

            <SectionTabs
              tabs={[
                { key: "request", label: "Запрос" },
                { key: "confirm", label: "Подтверждение" },
              ]}
              activeTab={resetMode}
              onChange={setResetMode}
            />

            <FieldInput
              label="Email"
              value={resetData.email}
              onChangeText={(value) => setResetData((prev) => ({ ...prev, email: value }))}
              placeholder="you@example.com"
            />

            {resetMode === "confirm" && (
              <>
                <FieldInput
                  label="Reset token"
                  value={resetData.token}
                  onChangeText={(value) => setResetData((prev) => ({ ...prev, token: value }))}
                  placeholder="Paste token from the link"
                />
                <FieldInput
                  label="New password"
                  value={resetData.password}
                  onChangeText={(value) => setResetData((prev) => ({ ...prev, password: value }))}
                  placeholder="Create a new password"
                  secureTextEntry
                />
                <FieldInput
                  label="Confirm password"
                  value={resetData.confirmPassword}
                  onChangeText={(value) => setResetData((prev) => ({ ...prev, confirmPassword: value }))}
                  placeholder="Repeat the new password"
                  secureTextEntry
                />
              </>
            )}

            <ErrorBanner message={resetError} />
            <SuccessBanner message={resetSuccess} />

            {!!resetUrl && (
              <View style={{ gap: 8 }}>
                <Text style={{ color: "#0f766e" }} selectable>
                  {resetUrl}
                </Text>
                <ActionChip onPress={() => void Linking.openURL(resetUrl)}>Open reset link</ActionChip>
              </View>
            )}

            <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
              {resetMode === "request" ? (
                <ActionChip onPress={() => void submitResetRequest()} tone="primary">
                  {loading ? "Submitting..." : "Request reset"}
                </ActionChip>
              ) : (
                <ActionChip onPress={() => void submitResetConfirm()} tone="primary">
                  {loading ? "Saving..." : "Save new password"}
                </ActionChip>
              )}
              <ActionChip onPress={() => setActiveTab("signin")}>Back to sign in</ActionChip>
            </View>
          </SurfaceCard>
        )}
      </ScrollView>
    </View>
  );
}

