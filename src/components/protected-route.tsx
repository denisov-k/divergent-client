// components/protected-route.tsx
import { Navigate } from "react-router-dom";
import { useAppStore } from "@/stores/useAppStore";
import {useEffect} from "react";

interface ProtectedRouteProps {
  children: JSX.Element;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading, refreshUser } = useAppStore();

  // При монтировании проверяем пользователя (кука может быть)
  useEffect(() => {
    if (!user) {
      refreshUser().catch(() => {}); // попытаемся подгрузить
    }
  }, [user]);

  if (loading) {
    return <div>Загрузка...</div>; // можно поставить спиннер
  }

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  return children;
};
