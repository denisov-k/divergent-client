import { useEffect, useState } from "react";

import i18n from "@/i18n";
import Config from "@/services/Config";
import { useAppStore } from "@/stores/useAppStore";

export function useAppBootstrap() {
  const { initialize, initialized, loading, user } = useAppStore();
  const [configReady, setConfigReady] = useState(Boolean(Config.data.api.http.baseURL));

  useEffect(() => {
    let active = true;

    void Config.init()
      .then(() => {
        if (active) {
          setConfigReady(true);
        }
      })
      .catch((error) => {
        console.error(error);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (user?.language) {
      void i18n.changeLanguage(user.language);
    }
  }, [user?.language]);

  useEffect(() => {
    if (!initialized && !loading && configReady) {
      void initialize();
    }
  }, [configReady, initialized, loading, initialize]);

  return {
    initialized,
    loading,
    user,
    configReady,
  };
}
