import { useEffect } from "react";
import { useAtom } from "jotai";
import Atoms from "../AtomStore";
import * as Notifications from "expo-notifications";

export default function useUnreadNotificationsHandler(
  response: any,
  triggerLocalNotification: any
) {
  const [appearedNotifications, setAppearedNotifications] = useAtom(
    Atoms?.appearedNotificationsAtom
  );

  // ✅ Load appeared notifications from AsyncStorage on mount
  useEffect(() => {
    const loadNotifications = async () => {
      const stored = await Atoms?.getAppearedNotifications();
      setAppearedNotifications(stored || []);
    };
    loadNotifications();
  }, []);

  // ✅ Listen for background/closed notifications and store them
  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(
      async (response) => {
        const notificationId = response.notification.request.identifier || "";
        if (!appearedNotifications.includes(notificationId)) {
          const updatedIds = [...appearedNotifications, notificationId];
          setAppearedNotifications(updatedIds);
          await Atoms?.saveAppearedNotifications(updatedIds);
        }
      }
    );

    return () => {
      subscription.remove();
    };
  }, [appearedNotifications]);

  // ✅ Handle new notifications when response changes (for foreground)
  useEffect(() => {
    if (response) {
      const unreadNotifications = response?.unreadNotifications ?? [];
      const newNotifications = unreadNotifications.filter(
        (notif: any) => !appearedNotifications.includes(notif._id)
      );

      if (newNotifications.length > 0) {
        const updatedIds = [...appearedNotifications];

        newNotifications.forEach((notification: any) => {
          const { _id, title, body } = notification;
          if (!updatedIds.includes(_id)) {
            updatedIds.push(_id);
            triggerLocalNotification(title, body); // 🎯 Trigger only once if not shown by system
          }
        });

        setAppearedNotifications(updatedIds);
        Atoms?.saveAppearedNotifications(updatedIds);
      }
    }
  }, [response, appearedNotifications]);
}
