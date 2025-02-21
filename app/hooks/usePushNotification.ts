import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { Platform } from "react-native";
import TOAST from "@/app/hooks/toast";
import NOTIFICATION from "../api/notification";

const registerForPushNotificationsAsync = async (
  notificationConsent: boolean
) => {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  function handleRegistrationError(errorMessage: string) {
    TOAST?.error(errorMessage);
    throw new Error(errorMessage);
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      throw new Error(
        "Permission not granted to get push token for push notification!"
      );
    }
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ??
      Constants?.easConfig?.projectId;
    if (!projectId) {
      throw new Error("Project ID not found");
    }
    try {
      const pushTokenString = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      console.log("push token - ", pushTokenString);
      try {
        await NOTIFICATION?.registerDevice({
          pushToken: pushTokenString,
          notificationConsent: notificationConsent,
          deviceType: Device?.DeviceType[Device?.deviceType ?? 0],
        });
      } catch (err) {
        console.log("An error occurred while registering user device", err);
      }
      return pushTokenString;
    } catch (e) {
      throw new Error(`${e}`);
    }
  } else {
    // handleRegistrationError("Must use physical device for push notifications");
  }
};

const unregisterPushNotifications = async () => {
  try {
    // Remove all scheduled notifications
    await Notifications.cancelAllScheduledNotificationsAsync();

    // Remove permission for notifications
    if (Platform.OS === "ios") {
      // On iOS, we can only prompt to go to settings since permissions can't be programmatically revoked
      return false;
    } else {
      // On Android, we can directly disable the notifications
      await Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: false,
          shouldPlaySound: false,
          shouldSetBadge: false,
        }),
      });
      return true;
    }
  } catch (error) {
    TOAST?.error("Failed to disable notifications");
    console.error("Error disabling notifications:", error);
    return false;
  }
};

const PUSH_NOTIFICATION = {
  registerForPushNotificationsAsync,
  unregisterPushNotifications,
};

export default PUSH_NOTIFICATION;
