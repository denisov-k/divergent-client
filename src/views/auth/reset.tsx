import { type ChangeEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import { z, ZodError } from "zod";

import { AuthCard, AuthField, AuthHeader, AuthScreenShell, ErrorBanner, InlineLink, PrimaryButton, SuccessBanner } from "@/components/web/auth-screen/Primitives";
import { useAppStore } from "@/stores/useAppStore";

const requestResetSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const confirmResetSchema = z
  .object({
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

export default function Reset() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const resetToken = searchParams.get("token");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
    submit?: string;
    success?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user, passwordReset, confirmPasswordReset } = useAppStore();
  const [resetUrl, setResetUrl] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [navigate, user]);

  const handleSubmit = async (data: typeof formData) => {
    try {
      setIsSubmitting(true);
      setErrors({});

      if (resetToken) {
        const validatedData = confirmResetSchema.parse(data);
        await confirmPasswordReset(resetToken, validatedData.password);
        navigate("/signin?reset=success");
        return;
      }

      const validatedData = requestResetSchema.parse(data);
      const response = await passwordReset(validatedData.email);
      setResetUrl(response.resetUrl || null);
        setErrors({
          success: response.resetUrl
            ? t("auth.reset_link_ready")
            : t("auth.reset_link_prepared"),
        });
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
        setErrors({
          submit: resetToken
            ? "Failed to reset password. The link may be invalid or expired."
            : "Failed to request password reset. Please try again.",
        });
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

  const isBusy = isSubmitting;
  const isConfirm = Boolean(resetToken);

  return (
    <AuthScreenShell>
      <AuthCard>
        <div className="space-y-6">
          <AuthHeader
            title={t("auth.reset_title")}
            subtitle={isConfirm ? t("auth.reset_confirm_subtitle") : t("auth.reset_request_subtitle")}
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
              required={!resetToken}
              disabled={Boolean(resetToken)}
              label={t("common.email")}
              placeholder={t("auth.email_placeholder")}
              error={errors.email}
              autoComplete="email"
            />

            {isConfirm && (
              <>
                <AuthField
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  label={t("common.new_password")}
                  placeholder={t("auth.new_password_placeholder")}
                  error={errors.password}
                  autoComplete="new-password"
                />

                <AuthField
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  label={t("common.confirm_password")}
                  placeholder={t("auth.confirm_password_placeholder")}
                  error={errors.confirmPassword}
                  autoComplete="new-password"
                />
              </>
            )}

            <ErrorBanner message={errors.submit} />
            <SuccessBanner
              message={
                errors.success ? (
                  <div className="space-y-2">
                    <p>{errors.success}</p>
                    {resetUrl && (
                      <a
                        href={resetUrl}
                        className="inline-block text-sm font-semibold text-emerald-700 underline underline-offset-4"
                      >
                        Open reset link
                      </a>
                    )}
                  </div>
                ) : undefined
              }
            />

            <PrimaryButton type="submit" disabled={isBusy}>
              {isSubmitting
                ? isConfirm
                  ? t("auth.reset_confirm_submitting")
                  : t("auth.reset_request_submitting")
                : isConfirm
                  ? t("auth.reset_confirm_submit")
                  : t("auth.reset_request_submit")}
            </PrimaryButton>

            <div className="flex items-center justify-between gap-3 pt-1 text-sm">
              {!resetToken ? (
                <InlineLink to="/signup">{t("auth.create_account_link")}</InlineLink>
              ) : (
                <InlineLink to="/reset">
                  {t("auth.back_to_reset_request")}
                </InlineLink>
              )}
              <InlineLink to="/signin" muted>
                {t("auth.back_to_signin")}
              </InlineLink>
            </div>
          </form>
        </div>
      </AuthCard>
    </AuthScreenShell>
  );
}
