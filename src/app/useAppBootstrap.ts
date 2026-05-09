import { useEffect, useState } from "react";
import { Linking } from "react-native";

import { buildRemindersPath } from "@/app/routes";
import i18n from "@/i18n";
import { buildNativeRouteUrl } from "@/platform/appUrl.native";
import {
  addNativePushResponseListener,
  configureNativePushNotifications,
  getLastNativePushResponse,
  getNativePushDeviceRegistration,
  isNativePushRegistrationSupported,
} from "@/platform/push";
import {
  markReminderDone,
  registerPushDevice,
  skipReminder,
  snoozeReminder,
} from "@/shared/api/client";
import Config from "@/services/Config";
import { useAppStore } from "@/stores/useAppStore";

function buildReminderUrl(reminderId?: string, goalId?: string) {
  return buildNativeRouteUrl(
    buildRemindersPath({
      id: reminderId ?? null,
      goalId: goalId ?? null,
    })
  );
}

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

  useEffect(() => {
    if (!initialized || !user?.id || !isNativePushRegistrationSupported()) {
      return;
    }

    let active = true;

    void getNativePushDeviceRegistration()
      .then((registration) => {
        if (!active || !registration) {
          return;
        }

        return registerPushDevice(registration);
      })
      .catch((error) => {
        console.error(error);
      });

    return () => {
      active = false;
    };
  }, [initialized, user?.id]);

  useEffect(() => {
    if (!isNativePushRegistrationSupported()) {
      return;
    }

    let active = true;

    const handleReminderResponse = async (response: Awaited<ReturnType<typeof getLastNativePushResponse>>) => {
      if (!active || !response?.reminderId) {
        return;
      }

      const openReminder = async () => {
        await Linking.openURL(buildReminderUrl(response.reminderId, response.goalId));
      };

      try {
        if (response.action === "done") {
          await markReminderDone(response.reminderId);
          return;
        }

        if (response.action === "snooze") {
          await snoozeReminder(response.reminderId, 10);
          return;
        }

        if (response.action === "skip") {
          await skipReminder(response.reminderId);
          return;
        }

        await openReminder();
      } catch (error) {
        console.error(error);
        await openReminder();
      }
    };

    void configureNativePushNotifications()
      .then(() => getLastNativePushResponse())
      .then((response) => handleReminderResponse(response))
      .catch((error) => {
        console.error(error);
      });

    const subscription = addNativePushResponseListener((response) =>
      handleReminderResponse(response)
    );

    return () => {
      active = false;
      subscription.remove();
    };
  }, []);

  return {
    initialized,
    loading,
    user,
    configReady,
  };
}
