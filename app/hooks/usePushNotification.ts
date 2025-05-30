import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { Platform } from "react-native";
import TOAST from "@/app/hooks/toast";
import NOTIFICATION from "../api/notification";

const registerForPushNotificationsAsync = async (
  notificationConsent: boolean,
  userId: any
) => {
  console.log("[PushNotification] Starting registration process...");

  if (Platform.OS === "android") {
    console.log("[PushNotification] Setting Android notification channel...");
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    console.log(
      "[PushNotification] Device check passed. Checking permissions..."
    );

    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    console.log(
      `[PushNotification] Existing permission status: ${existingStatus}`
    );

    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      console.log("[PushNotification] Requesting permission from user...");
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
      console.log(`[PushNotification] New permission status: ${finalStatus}`);
    }

    if (finalStatus !== "granted") {
      const error =
        "Permission not granted to get push token for push notification!";
      console.error("[PushNotification] " + error);
      throw new Error(error);
    }

    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ??
      Constants?.easConfig?.projectId;

    if (!projectId) {
      const error = "Project ID not found in Constants";
      console.error("[PushNotification] " + error);
      throw new Error(error);
    }

    try {
      console.log(
        `[PushNotification] Fetching Expo push token for projectId: ${projectId}`
      );
      const pushTokenResponse = await Notifications.getExpoPushTokenAsync({
        projectId,
      });
      const pushTokenString = pushTokenResponse.data;

      console.log("[PushNotification] Push token received:", pushTokenString);

      try {
        console.log("[PushNotification] Registering device with backend...");
        await NOTIFICATION?.registerDevice({
          pushToken: pushTokenString,
          notificationConsent: notificationConsent,
          deviceType: Device?.DeviceType[Device?.deviceType ?? 0],
          userId: userId || null,
        });
        console.log("[PushNotification] Device registered successfully.");
      } catch (err) {
        console.error(
          "[PushNotification] Error registering device with backend:",
          err
        );
      }

      return pushTokenString;
    } catch (e) {
      console.error("[PushNotification] Error fetching Expo push token:", e);
      throw new Error(`${e}`);
    }
  } else {
    console.warn(
      "[PushNotification] Must use physical device for push notifications"
    );
  }
};

const unregisterPushNotifications = async () => {
  console.log("[PushNotification] Unregistering push notifications...");

  try {
    console.log("[PushNotification] Cancelling all scheduled notifications...");
    await Notifications.cancelAllScheduledNotificationsAsync();

    if (Platform.OS === "ios") {
      console.warn(
        "[PushNotification] iOS does not support programmatic permission revocation."
      );
      return false;
    } else {
      console.log(
        "[PushNotification] Disabling notifications handler on Android..."
      );
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: false,
          shouldPlaySound: false,
          shouldSetBadge: false,
        }),
      });
      return true;
    }
  } catch (error) {
    console.error("[PushNotification] Error disabling notifications:", error);
    TOAST?.error("Failed to disable notifications");
    return false;
  }
};

const PUSH_NOTIFICATION = {
  registerForPushNotificationsAsync,
  unregisterPushNotifications,
};

export default PUSH_NOTIFICATION;
