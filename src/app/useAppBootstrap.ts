import { useEffect } from "react";

import i18n from "@/i18n";
import { useAppStore } from "@/stores/useAppStore";

export function useAppBootstrap() {
  const { initialize, initialized, loading, user } = useAppStore();

  useEffect(() => {
    if (user?.language) {
      void i18n.changeLanguage(user.language);
    }
  }, [user?.language]);

  useEffect(() => {
    if (!initialized && !loading) {
      void initialize();
    }
  }, [initialized, loading, initialize]);

  return {
    initialized,
    loading,
    user,
  };
}
