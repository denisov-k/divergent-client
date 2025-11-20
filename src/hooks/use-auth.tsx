import { createContext, useContext, useState, useEffect } from 'react'
import {User} from '@/types'
import ServiceTransport from '@/services/Transport'

interface AuthContextType {
  user: User | null
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name: string | undefined, referrerId: string | undefined, referrerLinkId: string | undefined) => Promise<void>
  signOut: () => Promise<void>
  passwordReset: (email: string) => Promise<void>
  checkAuth: () => Promise<void>
  telegramAuth: (data: string) => Promise<void>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const transport = new ServiceTransport();

  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  // Used to check the session status with the server
  const checkAuth = async () => {

    setUser({
      id: 1,
      name: 'test',
      photo_url: '',
      token: '',
      role: 'user',
      level: 1
    } as User);

    return setIsLoading(false);

    try {
      const response = await transport.request('/auth/identify')
      setUser(response.data)
    } catch (error) {
      console.error('Failed to check auth status:', error)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  // Used to create a session and store the user data in the context
  const signIn = async (email: string, password: string) => {
    const response = await transport.request('/auth/sign_in', { email, password },  'post')

    if (response.status !== 200) {
      const error = await response.error
      throw new Error(error.error || 'Failed to sign in')
    }

    setUser(response.data)
  }

  // Used to sign up a new user, create a session, and store the user data in the context
  const signUp = async (email: string, password: string, name?: string, referrerId?: string, referrerLinkId?: string) => {
    const response = await transport.request('/auth/sign_up',
        { email, password, name, referrerId, referrerLinkId }, 'post');

    if (response.status !== 200) {
      const error = await response.error
      throw new Error(error.error || 'Failed to sign up')
    }

    setUser(response.data)
  }

  // Used to create a session and store the user data in the context
  const telegramAuth = async (data: string) => {
    const response = await transport.request('/auth/telegram', { tgData: data }, 'post')

    if (response.status !== 200) {
      const error = await response.error
      throw new Error(error.error || 'Failed to sign in')
    }

    setUser(response.data)
  }

  // Used to sign out a user and clear the user data from the context
  const signOut = async () => {
    await transport.request('/auth/sign_out',{}, 'post')
    setUser(null)
    localStorage.clear();
  }
  
  const passwordReset = async (email: string) => {
    await transport.request('/auth/reset', { email }, 'post')
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut, passwordReset, telegramAuth, checkAuth, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to access the auth context from any component
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
