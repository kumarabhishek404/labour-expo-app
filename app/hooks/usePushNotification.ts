// notificationSetup.js
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { Platform } from "react-native";
import { registerDevice } from "../api/user";
import { toast } from "./toast";

export async function registerForPushNotificationsAsync() {
  // Configure Android notification settings
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  function handleRegistrationError(errorMessage: string) {
    toast?.error(errorMessage);
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
        await registerDevice({ pushToken: pushTokenString });
      } catch (err) {
        console.log("An error occurred while registering user device", err);
      }

      return pushTokenString;
    } catch (e) {
      throw new Error(`${e}`);
    }
  } else {
    handleRegistrationError("Must use physical device for push notifications");
  }
}
