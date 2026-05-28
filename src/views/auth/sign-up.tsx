import { type ChangeEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import { z, ZodError } from "zod";

import { AuthCard, AuthField, AuthHeader, AuthScreenShell, ErrorBanner, InlineLink, PrimaryButton } from "@/components/web/auth-screen/Primitives";
import { useAppStore } from "@/stores/useAppStore";

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

export default function SignUp() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { signup } = useAppStore();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    name?: string;
    submit?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: typeof formData) => {
    try {
      setIsSubmitting(true);
      setErrors({});

      const validatedData = signUpSchema.parse(data);
      const referrerId = searchParams.get("referrerId") as string;
      const referrerLinkId = searchParams.get("referrerLinkId") as string;

      await signup(
        validatedData.email,
        validatedData.password,
        validatedData.name,
        referrerId,
        referrerLinkId
      );
      navigate("/");
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
        setErrors({ submit: "Failed to create account. Please try again." });
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

  return (
    <AuthScreenShell>
      <AuthCard>
        <div className="space-y-6">
          <AuthHeader title={t("auth.signup_title")} subtitle={t("auth.signup_subtitle")} />

          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(formData);
            }}
          >
            <AuthField
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              label={t("common.name")}
              placeholder={t("auth.your_name")}
              error={errors.name}
              autoComplete="name"
              autoCapitalize="words"
            />

            <AuthField
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              label={t("common.email")}
              placeholder={t("auth.email_placeholder")}
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
              placeholder={t("auth.password_create_placeholder")}
              error={errors.password}
              autoComplete="new-password"
            />

            <ErrorBanner message={errors.submit} />

            <PrimaryButton type="submit" disabled={isBusy}>
              {isSubmitting ? t("auth.signup_submitting") : t("auth.signup_submit")}
            </PrimaryButton>

            <div className="pt-1 text-center">
              <InlineLink to="/signin">{t("auth.already_have_account_signin")}</InlineLink>
            </div>
          </form>
        </div>
      </AuthCard>
    </AuthScreenShell>
  );
}
