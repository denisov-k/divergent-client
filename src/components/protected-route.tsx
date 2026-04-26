import { Navigate, useLocation } from 'react-router-dom'
import {useAppStore} from "@/stores/useAppStore.ts";
import {Loader2} from "lucide-react";
import React from "react";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, initialized } = useAppStore();
  const location = useLocation();

  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    )
  } else if (!user) {
    const redirect = encodeURIComponent(`${location.pathname}${location.search}`);
    return <Navigate to={`/signin?redirect=${redirect}`} replace />
  }

  return <>{children}</>
}
