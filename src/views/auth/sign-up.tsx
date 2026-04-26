import { type ChangeEvent, useState } from 'react'
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

const signUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  name: z.string().optional()
})


export default function SignUp() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  })
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    name?: string;
    submit?: string;
  }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchParams] = useSearchParams();
  const navigate = useNavigate()
  const { signup } = useAppStore();

  const handleSubmit = async (data: typeof formData) => {
    try {
      setIsSubmitting(true)
      setErrors({})
      
      // Validate the form data
      const validatedData = signUpSchema.parse(data);

      const referrerId = searchParams.get('referrerId') as string;
      const referrerLinkId = searchParams.get('referrerLinkId') as string;

      console.log(referrerLinkId);

      // Attempt sign up
      await signup(validatedData.email, validatedData.password, validatedData.name, referrerId, referrerLinkId)
      navigate('/')
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
        setErrors({ submit: 'Failed to create account. Please try again.' })
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
          <div className="space-y-2">
            <CardTitle className="text-2xl text-foreground">Create account</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Start with email and password, then continue in the app.
            </CardDescription>
          </div>
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
              <label htmlFor="name" className="text-sm font-medium text-foreground">
                Name
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                aria-invalid={Boolean(errors.name)}
                className="h-11 border-border bg-input-background text-foreground placeholder:text-muted-foreground"
              />
              {errors.name && (
                <p className="text-sm text-red-400">{errors.name}</p>
              )}
            </div>

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

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <label htmlFor="password" className="text-sm font-medium text-foreground">
                  Password
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
                placeholder="Create a password"
                aria-invalid={Boolean(errors.password)}
                className="h-11 border-border bg-input-background text-foreground placeholder:text-muted-foreground"
              />
              {errors.password && (
                <p className="text-sm text-red-400">{errors.password}</p>
              )}
            </div>

            {errors.submit && (
              <p className="rounded-md border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                {errors.submit}
              </p>
            )}

            <Button type="submit" disabled={isBusy} size="lg" className="w-full">
              {isSubmitting ? 'Creating account...' : 'Create account'}
            </Button>

            <div className="pt-2 text-center text-sm">
              <a
                href="/signin"
                className="text-primary underline-offset-4 hover:underline"
              >
                Already have an account? Sign in
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
