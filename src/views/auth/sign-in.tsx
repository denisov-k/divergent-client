import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {ReactSVG} from "react-svg";

import LogoIcon from '@/assets/images/logo-icon.svg';
import Logo from '@/assets/images/logo.svg';

import { useAuth } from '@/hooks/use-auth'
import { z, ZodError } from 'zod'
import './index.css';

const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
})

export default function SignIn() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    submit?: string;
  }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchParams] = useSearchParams();
  const navigate = useNavigate()
  const { user, signIn, telegramAuth } = useAuth()
  // @ts-ignore
  const isTelegramClient = !!window.Telegram.WebApp.initData;
  const redirect = searchParams.get('redirect');

  useEffect(() => {
    console.log('[sign-in] user:', user)
    if (user) {
      if (redirect)
        window.location.replace(redirect)
      else
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
      await signIn(validatedData.email, validatedData.password)
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
        setErrors({ submit: 'Failed to sign in. Please try again.' })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const handleTelegramAuth = () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const data = window.Telegram.WebApp.initData;

    return telegramAuth(data);
  }

  useEffect(() => {
    if (isTelegramClient)
      handleTelegramAuth();
  }, []);

  return (
    <div id="sign-in">
      <div className="logo">
        <ReactSVG src={Logo} className="title"></ReactSVG>
        <ReactSVG src={LogoIcon}></ReactSVG>
      </div>
      <form onSubmit={(e) => {
        e.preventDefault()
        handleSubmit(formData)
      }}>
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
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email}</p>
          )}
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
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password}</p>
          )}
        </div>
        {errors.submit && (
          <p className="text-sm text-red-500 text-center">{errors.submit}</p>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Entering...' : 'Enter'}
        </button>
		{isTelegramClient ? (<div
            className="telegram-entry-button"
            onClick={handleTelegramAuth}
          >
            Login via Telegram
          </div>) : null
          }
        <div className="form-footer">
          <a
            href="/signup"
            className="link"
          >
            Registration
          </a>
		  <a
			  href="/reset"
			  className="link"
			>
			  Forget password?
			</a>
        </div>
      </form>
    </div>
  )
}
