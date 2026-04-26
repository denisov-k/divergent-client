import { type ChangeEvent, useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { z, ZodError } from 'zod'

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAppStore } from '@/stores/useAppStore';

const requestResetSchema = z.object({
  email: z.string().email('Invalid email address'),
})

const confirmResetSchema = z.object({
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  path: ['confirmPassword'],
  message: 'Passwords do not match',
})

export default function Reset() {
  const [searchParams] = useSearchParams();
  const resetToken = searchParams.get('token');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
    submit?: string;
    success?: string;
  }>({})
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user, passwordReset, confirmPasswordReset } = useAppStore();
  const [resetUrl, setResetUrl] = useState<string | null>(null);


  useEffect(() => {
    if (user) {
      navigate('/')
    }
  }, [navigate, user])

  const handleSubmit = async (data: typeof formData) => {
    try {
      setIsSubmitting(true)
      setErrors({})

      if (resetToken) {
        const validatedData = confirmResetSchema.parse(data)
        await confirmPasswordReset(resetToken, validatedData.password)
        navigate('/signin?reset=success')
        return
      }

      const validatedData = requestResetSchema.parse(data)
      const response = await passwordReset(validatedData.email)
      setResetUrl(response.resetUrl || null)
      setErrors({
        success: response.resetUrl
          ? 'Reset link generated. Continue with the link below.'
          : 'If an account with this email exists, a reset link has been created.',
      })
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors: Record<string, string> = {}
        error.errors.forEach((err) => {
          if (err.path) {
            formattedErrors[String(err.path[0])] = err.message
          }
        })
        setErrors(formattedErrors)
      } else {
        setErrors({ submit: resetToken ? 'Failed to reset password. The link may be invalid or expired.' : 'Failed to request password reset. Please try again.' })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const isBusy = isSubmitting;

  return (
    <div className="relative flex min-h-svh items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top,#eef6ff_0%,#ffffff_42%,#f3f4f6_100%)] px-4 py-10">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-6rem] top-[-5rem] h-56 w-56 rounded-full bg-sky-100 blur-3xl" />
        <div className="absolute right-[-5rem] top-20 h-48 w-48 rounded-full bg-blue-100/80 blur-3xl" />
        <div className="absolute bottom-[-6rem] left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-zinc-200/70 blur-3xl" />
      </div>

      <Card className="relative z-10 w-full max-w-md border-border/80 bg-card/95 shadow-[0_24px_80px_rgba(15,23,42,0.10)] backdrop-blur">
        <CardHeader className="space-y-2 pb-0 text-center">
          <CardTitle className="text-2xl text-foreground">Reset password</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            {resetToken
              ? 'Choose a new password for your account.'
              : 'Enter your email and we will generate a password reset link.'}
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault()
              handleSubmit(formData)
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
                required={!resetToken}
                disabled={Boolean(resetToken)}
                placeholder="you@example.com"
                aria-invalid={Boolean(errors.email)}
                className="h-11 border-border bg-input-background text-foreground placeholder:text-muted-foreground"
              />
              {errors.email && (
                <p className="text-sm text-red-400">{errors.email}</p>
              )}
            </div>

            {resetToken && (
              <>
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <label htmlFor="password" className="text-sm font-medium text-foreground">
                      New password
                    </label>
                    <span className="text-xs text-muted-foreground">
                      8+ chars, upper/lowercase and number
                    </span>
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Create a new password"
                    aria-invalid={Boolean(errors.password)}
                    className="h-11 border-border bg-input-background text-foreground placeholder:text-muted-foreground"
                  />
                  {errors.password && (
                    <p className="text-sm text-red-400">{errors.password}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                    Confirm password
                  </label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    placeholder="Repeat the new password"
                    aria-invalid={Boolean(errors.confirmPassword)}
                    className="h-11 border-border bg-input-background text-foreground placeholder:text-muted-foreground"
                  />
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-400">{errors.confirmPassword}</p>
                  )}
                </div>
              </>
            )}

            {errors.submit && (
              <p className="rounded-md border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                {errors.submit}
              </p>
            )}

            {errors.success && (
              <div className="rounded-md border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-700">
                <p>{errors.success}</p>
                {resetUrl && (
                  <a
                    href={resetUrl}
                    className="mt-2 inline-block text-emerald-700 underline underline-offset-4"
                  >
                    Open reset link
                  </a>
                )}
              </div>
            )}

            <Button
              type="submit"
              disabled={isBusy}
              size="lg"
              className="w-full"
            >
              {isSubmitting ? 'Submitting...' : resetToken ? 'Save new password' : 'Request reset'}
            </Button>

            <div className="flex items-center justify-between gap-3 pt-2 text-sm">
              <a
                href="/signup"
                className="text-primary underline-offset-4 hover:underline"
              >
                Create account
              </a>
              <a
                href="/signin"
                className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                Back to sign in
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
