import { type ChangeEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import { z, ZodError } from "zod";

import { AuthCard, AuthField, AuthHeader, AuthScreenShell, DividerLabel, ErrorBanner, InlineLink, PrimaryButton, SuccessBanner, TelegramButton } from "@/components/web/auth-screen/Primitives";
import { platformCapabilities } from "@/platform/capabilities";
import { createTelegramLoginUrl } from "@/platform/telegram";
import { redirectToUrl } from "@/platform/browser";
import { useAppStore } from "@/stores/useAppStore";

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export default function SignIn() {
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, loading, loginWithCredentials } = useAppStore();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    submit?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirect = searchParams.get("redirect");
  const telegramError = searchParams.get("error");
  const telegramErrorDetail = searchParams.get("error_detail");
  const resetStatus = searchParams.get("reset");

  useEffect(() => {
    if (loading) return;
    if (user) {
      if (redirect) window.location.replace(redirect);
      else navigate("/");
    }
  }, [user, loading, navigate, redirect]);

  useEffect(() => {
    if (!telegramError && !resetStatus) return;

    if (resetStatus === "success") {
      setErrors({});
      return;
    }

    setErrors({
      submit:
        telegramError === "telegram_oauth_failed"
          ? `${t("auth.telegram_signin_failed")}${telegramErrorDetail ? ` (${telegramErrorDetail})` : ""}`
          : t("auth.telegram_signin_unavailable"),
    });
  }, [telegramError, telegramErrorDetail, resetStatus, t]);

  const handleSubmit = async (data: typeof formData) => {
    try {
      setIsSubmitting(true);
      setErrors({});

      const validatedData = signInSchema.parse(data);
      await loginWithCredentials(validatedData.email, validatedData.password);
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path) {
            formattedErrors[String(err.path[0])] = err.message;
          }
        });
        setErrors(formattedErrors);
      } else {
        setErrors({ submit: "Failed to sign in. Please check your credentials." });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const isBusy = isSubmitting || loading;

  return (
    <AuthScreenShell>
      <AuthCard>
        <div className="space-y-6">
          <AuthHeader
            title={t("auth.signin_welcome_title")}
            subtitle={t("auth.signin_welcome_subtitle")}
          />

          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(formData);
            }}
          >
            <AuthField
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              label={t("common.email")}
              placeholder={t("auth.email_placeholder")}
              aria-invalid={Boolean(errors.email)}
              error={errors.email}
              autoComplete="email"
            />

            <AuthField
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              label={t("common.password")}
              placeholder={t("auth.password_placeholder")}
              aria-invalid={Boolean(errors.password)}
              error={errors.password}
              autoComplete="current-password"
            />

            <ErrorBanner message={errors.submit} />
            <SuccessBanner message={resetStatus === "success" ? t("auth.password_updated") : undefined} />

            <PrimaryButton type="submit" disabled={isBusy}>
              {isSubmitting ? t("auth.signin_submitting") : t("auth.signin_submit")}
            </PrimaryButton>

            {platformCapabilities.telegramLogin && (
              <div className="space-y-3">
                <DividerLabel>{t("auth.or_divider")}</DividerLabel>
                <TelegramButton
                  type="button"
                  disabled={isBusy}
                  onClick={() => redirectToUrl(createTelegramLoginUrl(redirect || "/"))}
                >
                  {t("auth.telegram_signin")}
                </TelegramButton>
              </div>
            )}

            <div className="flex items-center justify-between gap-3 pt-1 text-sm">
              <InlineLink to="/signup">{t("auth.create_account_link")}</InlineLink>
              <InlineLink to="/reset" muted>
                {t("auth.reset_password")}
              </InlineLink>
            </div>
          </form>
        </div>
      </AuthCard>
    </AuthScreenShell>
  );
}
