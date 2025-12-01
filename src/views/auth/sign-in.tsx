import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ReactSVG } from "react-svg"

import LogoIcon from '@/assets/images/logo-icon.svg'
import Logo from '@/assets/images/logo.svg'

import { useAppStore } from '@/stores/useAppStore'
import { z, ZodError } from 'zod'
import './index.css'

const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
})

export default function SignIn() {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState<{ email?: string; password?: string; submit?: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { user, loading, login } = useAppStore()
  // @ts-ignore
  const isTelegramClient = !!window.Telegram?.WebApp?.initData
  const redirect = searchParams.get('redirect')

  // Редирект если уже есть пользователь
  useEffect(() => {
    if (loading) return
    if (user) {
      if (redirect) window.location.replace(redirect)
      else navigate('/')
    }
  }, [user, loading, navigate, redirect])

  const handleSubmit = async (data: typeof formData) => {
    try {
      setIsSubmitting(true)
      setErrors({})
      const validatedData = signInSchema.parse(data)
      await Promise.resolve(validatedData); // FIXME
      //await signIn(validatedData.email, validatedData.password)
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors: Record<string, string> = {}
        error.errors.forEach(err => {
          const key = String(err.path[0])
          formattedErrors[key] = err.message
        })
        setErrors(formattedErrors)
      } else {
        setErrors({ submit: 'Failed to sign in. Please try again.' })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const handleTelegramAuth = async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      const data = window.Telegram.WebApp.initData
      await login(data)
    } catch (err) {
      console.error('Telegram auth failed', err)
    }
  }

  // Telegram авто-вход один раз при монтировании
  useEffect(() => {
    if (isTelegramClient && !user) {
      handleTelegramAuth()
    }
  }, [isTelegramClient, user])

  return (
    <div id="sign-in">
      <div className="logo">
        <ReactSVG src={Logo} className="title" />
        <ReactSVG src={LogoIcon} />
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSubmit(formData)
        }}
      >
        <span>Entry</span>
        <div>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Enter your email"
            className={errors.email ? 'border-red-500' : ''}
          />
          {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
        </div>
        <div>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Enter your password"
            className={errors.password ? 'border-red-500' : ''}
          />
          {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
        </div>
        {errors.submit && <p className="text-sm text-red-500 text-center">{errors.submit}</p>}
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Entering...' : 'Enter'}
        </button>
        {isTelegramClient && (
          <div className="telegram-entry-button" onClick={handleTelegramAuth}>
            Login via Telegram
          </div>
        )}
        <div className="form-footer">
          <a href="/signup" className="link">Registration</a>
          <a href="/reset" className="link">Forget password?</a>
        </div>
      </form>
    </div>
  )
}
