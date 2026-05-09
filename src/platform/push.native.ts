import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export type PushDeviceRegistration = {
  platform: string;
  expoPushToken: string;
  deviceId?: string;
  appVersion?: string;
};

export type PushReminderAction =
  | "default"
  | "open"
  | "done"
  | "snooze"
  | "skip"
  | "open_report";

export type PushReminderResponse = {
  action: PushReminderAction;
  reminderId?: string;
  goalId?: string;
  taskId?: string;
};

const REMINDER_ACTIONS_CATEGORY = "REMINDER_ACTIONS";
const REMINDER_REPORT_ACTIONS_CATEGORY = "REMINDER_REPORT_ACTIONS";
const REMINDER_NOTIFICATION_CHANNEL = "reminders";

const REMINDER_OPEN_ACTION = "REMINDER_OPEN";
const REMINDER_DONE_ACTION = "REMINDER_DONE";
const REMINDER_SNOOZE_ACTION = "REMINDER_SNOOZE";
const REMINDER_SKIP_ACTION = "REMINDER_SKIP";
const REMINDER_OPEN_REPORT_ACTION = "REMINDER_OPEN_REPORT";

function getProjectId() {
  return (
    Constants.easConfig?.projectId ||
    Constants.expoConfig?.extra?.eas?.projectId ||
    undefined
  );
}

function getAppVersion() {
  return Constants.expoConfig?.version || Constants.nativeAppVersion || undefined;
}

function extractReminderResponse(
  response: Notifications.NotificationResponse | null
): PushReminderResponse | null {
  if (!response) {
    return null;
  }

  const data = response.notification.request.content.data as Record<string, unknown>;

  const base = {
    reminderId: typeof data.reminderId === "string" ? data.reminderId : undefined,
    goalId: typeof data.goalId === "string" ? data.goalId : undefined,
    taskId: typeof data.taskId === "string" ? data.taskId : undefined,
  };

  switch (response.actionIdentifier) {
    case Notifications.DEFAULT_ACTION_IDENTIFIER:
      return { action: "default", ...base };
    case REMINDER_OPEN_ACTION:
      return { action: "open", ...base };
    case REMINDER_DONE_ACTION:
      return { action: "done", ...base };
    case REMINDER_SNOOZE_ACTION:
      return { action: "snooze", ...base };
    case REMINDER_SKIP_ACTION:
      return { action: "skip", ...base };
    case REMINDER_OPEN_REPORT_ACTION:
      return { action: "open_report", ...base };
    default:
      return { action: "default", ...base };
  }
}

export function isNativePushRegistrationSupported() {
  return true;
}

export async function getNativePushDeviceRegistration(): Promise<PushDeviceRegistration | null> {
  const existingPermissions = await Notifications.getPermissionsAsync();
  let finalStatus = existingPermissions.status;

  if (finalStatus !== "granted") {
    const requestedPermissions = await Notifications.requestPermissionsAsync();
    finalStatus = requestedPermissions.status;
  }

  if (finalStatus !== "granted") {
    return null;
  }

  const projectId = getProjectId();
  if (!projectId) {
    console.warn("Push registration skipped: missing EAS projectId.");
    return null;
  }

  try {
    const token = await Notifications.getExpoPushTokenAsync({ projectId });

    return {
      platform: Platform.OS,
      expoPushToken: token.data,
      appVersion: getAppVersion(),
    };
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function configureNativePushNotifications() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync(
      REMINDER_NOTIFICATION_CHANNEL,
      {
        name: "Reminders",
        importance: Notifications.AndroidImportance.HIGH,
        sound: "default",
      }
    );
  }

  await Notifications.setNotificationCategoryAsync(REMINDER_ACTIONS_CATEGORY, [
    {
      identifier: REMINDER_DONE_ACTION,
      buttonTitle: "Выполнено",
      options: {
        opensAppToForeground: true,
      },
    },
    {
      identifier: REMINDER_SNOOZE_ACTION,
      buttonTitle: "Отложить 10 мин",
      options: {
        opensAppToForeground: true,
      },
    },
    {
      identifier: REMINDER_SKIP_ACTION,
      buttonTitle: "Пропустить",
      options: {
        opensAppToForeground: true,
      },
    },
    {
      identifier: REMINDER_OPEN_ACTION,
      buttonTitle: "Подробнее",
      options: {
        opensAppToForeground: true,
      },
    },
  ]);

  await Notifications.setNotificationCategoryAsync(
    REMINDER_REPORT_ACTIONS_CATEGORY,
    [
      {
        identifier: REMINDER_OPEN_REPORT_ACTION,
        buttonTitle: "Открыть",
        options: {
          opensAppToForeground: true,
        },
      },
      {
        identifier: REMINDER_SNOOZE_ACTION,
        buttonTitle: "Отложить 10 мин",
        options: {
          opensAppToForeground: true,
        },
      },
      {
        identifier: REMINDER_SKIP_ACTION,
        buttonTitle: "Пропустить",
        options: {
          opensAppToForeground: true,
        },
      },
    ]
  );
}

export function addNativePushResponseListener(
  listener: (response: PushReminderResponse) => void | Promise<void>
) {
  const subscription = Notifications.addNotificationResponseReceivedListener(
    (response) => {
      const parsed = extractReminderResponse(response);
      if (parsed) {
        void listener(parsed);
      }
    }
  );

  return {
    remove() {
      subscription.remove();
    },
  };
}

export async function getLastNativePushResponse(): Promise<PushReminderResponse | null> {
  const response = await Notifications.getLastNotificationResponseAsync();
  return extractReminderResponse(response);
}
