import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {ReactSVG} from "react-svg";

import LogoIcon from '@/assets/images/logo-icon.svg';
import Logo from '@/assets/images/logo.svg';

import { useAppStore } from '@/stores/useAppStore';
import { z, ZodError } from 'zod'
import './index.css';

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
        <span>Password reset</span>
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
        {errors.submit && (
          <p className="text-sm text-red-500 text-center">{errors.submit}</p>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Reseting...' : 'Reset'}
        </button>
        <div className="form-footer">
          <a
            href="/signup"
            className="link"
          >
            Registration
          </a>
		  <a
            href="/signin"
            className="link"
          >
            Login
          </a>
        </div>
      </form>
    </div>
  )
}
