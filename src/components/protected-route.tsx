import { Navigate } from 'react-router-dom'
import {useAppStore} from "@/stores/useAppStore.ts";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAppStore();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div style={{ color: 'var(--color-primary)' }}>Loading...</div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/signin" replace />
  }

  return <>{children}</>
}
