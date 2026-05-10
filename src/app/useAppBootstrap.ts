import { useEffect, useState } from "react";
import { Linking } from "react-native";

import { buildGoalsPath } from "@/app/routes";
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

function buildGoalFocusUrl(goalId?: string, reportTaskId?: string) {
  return buildNativeRouteUrl(
    buildGoalsPath({
      id: goalId ?? null,
      reportTaskId: reportTaskId ?? null,
    })
  );
}

export function useAppBootstrap() {
  const {
    initialize,
    initialized,
    loading,
    refreshAppData,
    showNativeToast,
    user,
  } = useAppStore();
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

      const openGoalList = async () => {
        await Linking.openURL(
          buildGoalFocusUrl(
            response.goalId,
            response.action === "open_report" || response.requiresReport
              ? response.taskId
              : undefined
          )
        );
      };

      try {
        if (response.action === "done") {
          const result = await markReminderDone(response.reminderId);
          await refreshAppData();

          if (result?.status === "done" || result?.status === "already_done") {
            showNativeToast({
              title: i18n.t("common.done"),
              message: i18n.t("goals.task_completed_toast"),
              tone: "success",
            });
          }
          return;
        }

        if (response.action === "snooze") {
          await snoozeReminder(response.reminderId, 10);
          await refreshAppData();
          return;
        }

        if (response.action === "skip") {
          await skipReminder(response.reminderId);
          await refreshAppData();
          return;
        }

        await openGoalList();
      } catch (error) {
        console.error(error);
        await openGoalList();
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
  }, [refreshAppData, showNativeToast]);

  return {
    initialized,
    loading,
    user,
    configReady,
  };
}
