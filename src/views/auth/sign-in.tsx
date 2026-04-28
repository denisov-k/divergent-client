import { type ChangeEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import { z, ZodError } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
      setErrors({
        submit: "Password updated. You can sign in with your new password now.",
      });
      return;
    }

    setErrors({
      submit:
        telegramError === "telegram_oauth_failed"
          ? `Telegram sign in failed. Please try again.${telegramErrorDetail ? ` (${telegramErrorDetail})` : ""}`
          : "Telegram sign in is not available right now.",
    });
  }, [telegramError, telegramErrorDetail, resetStatus]);

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
    <div className="relative flex min-h-svh items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top,#eef6ff_0%,#ffffff_42%,#f3f4f6_100%)] px-4 py-10">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-6rem] top-[-5rem] h-56 w-56 rounded-full bg-sky-100 blur-3xl" />
        <div className="absolute right-[-5rem] top-20 h-48 w-48 rounded-full bg-blue-100/80 blur-3xl" />
        <div className="absolute bottom-[-6rem] left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-zinc-200/70 blur-3xl" />
      </div>

      <Card className="relative z-10 w-full max-w-md border-border/80 bg-card/95 shadow-[0_24px_80px_rgba(15,23,42,0.10)] backdrop-blur">
        <CardHeader className="space-y-2 pb-0 text-center">
          <div className="space-y-2">
            <CardTitle className="text-2xl text-foreground">Welcome back</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Sign in with email or continue with Telegram.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(formData);
            }}
          >
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder={t("auth.email_placeholder")}
                aria-invalid={Boolean(errors.email)}
                className="h-11 border-border bg-input-background text-foreground placeholder:text-muted-foreground"
              />
              {errors.email && <p className="text-sm text-red-400">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder={t("auth.password_placeholder")}
                aria-invalid={Boolean(errors.password)}
                className="h-11 border-border bg-input-background text-foreground placeholder:text-muted-foreground"
              />
              {errors.password && <p className="text-sm text-red-400">{errors.password}</p>}
            </div>

            {errors.submit && (
              <p className="rounded-md border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                {errors.submit}
              </p>
            )}

            <Button type="submit" disabled={isBusy} size="lg" className="w-full">
              {isSubmitting ? "Signing in..." : "Sign in"}
            </Button>

            {platformCapabilities.telegramLogin && (
              <>
                <div className="flex items-center gap-3 py-1">
                  <div className="h-px flex-1 bg-border" />
                  <span className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                    or
                  </span>
                  <div className="h-px flex-1 bg-border" />
                </div>

                <div className="rounded-xl border border-border bg-muted/40 p-4">
                  <p className="mb-3 text-sm text-foreground">Continue with Telegram</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    className="w-full bg-background"
                    disabled={isBusy}
                    onClick={() => redirectToUrl(createTelegramLoginUrl(redirect || "/"))}
                  >
                    Sign in with Telegram
                  </Button>
                </div>
              </>
            )}

            <div className="flex items-center justify-between gap-3 pt-2 text-sm">
              <a href="/signup" className="text-primary underline-offset-4 hover:underline">
                Create account
              </a>
              <a href="/reset" className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
                Reset password
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
