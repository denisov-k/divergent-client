import { type ChangeEvent, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
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

const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
})

export default function Reset() {
  const [formData, setFormData] = useState({
    email: '',
  })
  const [errors, setErrors] = useState<{
    email?: string;
    submit?: string;
  }>({})
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user, passwordReset } = useAppStore();


  useEffect(() => {
    console.log('[sign-in] user:', user)
    if (user) {
      navigate('/')
    }
  }, [navigate, user])

  const handleSubmit = async (data: typeof formData) => {
    try {
      setIsSubmitting(true)
      setErrors({})
      
      // Validate the form data
      const validatedData = signInSchema.parse(data)
      
      // Attempt sign in
      await passwordReset(validatedData.email)
      console.log('[sign-in] signed in!')
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors: Record<string, string> = {}
        error.errors.forEach((err) => {
          if (err.path) {
            formattedErrors[err.path[0]] = err.message
          }
        })
        setErrors(formattedErrors)
      } else {
        setErrors({ submit: 'Password reset is not available yet in the new auth flow.' })
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
            Password reset is not wired yet, but you can leave your email here for the future flow.
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
                required
                placeholder="you@example.com"
                aria-invalid={Boolean(errors.email)}
                className="h-11 border-border bg-input-background text-foreground placeholder:text-muted-foreground"
              />
              {errors.email && (
                <p className="text-sm text-red-400">{errors.email}</p>
              )}
            </div>

            {errors.submit && (
              <p className="rounded-md border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                {errors.submit}
              </p>
            )}

            <Button
              type="submit"
              disabled={isBusy}
              size="lg"
              className="w-full"
            >
              {isSubmitting ? 'Submitting...' : 'Request reset'}
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
