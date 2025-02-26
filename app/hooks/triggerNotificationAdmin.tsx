import * as Notifications from "expo-notifications";

const triggerLocalNotification = async (
  title: string,
  body: string,
  data: Record<string, any> = {}
) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: true,
      data: { ...data, isLocal: true }, // Mark as local to avoid re-triggering
    },
    trigger: null, // Immediate trigger
  });
};

export default triggerLocalNotification;
