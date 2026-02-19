import { Navigate } from 'react-router-dom'
import {useAppStore} from "@/stores/useAppStore.ts";
import {Loader2} from "lucide-react";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, initialized } = useAppStore();

  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    )
  } else if (!user) {
    return <Navigate to="/signin" replace />
  }

  return <>{children}</>
}
