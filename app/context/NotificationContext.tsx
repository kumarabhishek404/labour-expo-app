import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
} from "react";
import * as Notifications from "expo-notifications";
import PUSH_NOTIFICATION from "@/app/hooks/usePushNotification";
import { useAtomValue, useSetAtom } from "jotai";
import Atoms from "@/app/AtomStore";

interface NotificationContextType {
  expoPushToken: string | null;
  notification: Notifications.Notification | null;
  error: Error | null;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const setHasNewNotification = useSetAtom(Atoms?.hasNewNotificationAtom);
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notification, setNotification] =
    useState<Notifications.Notification | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const userDetails = useAtomValue(Atoms?.UserAtom);
  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();
  const notificationConsent = useAtomValue(Atoms?.NotificationConsentAtom);

  useEffect(() => {
    // Register push notifications
    PUSH_NOTIFICATION?.registerForPushNotificationsAsync(
      notificationConsent
    ).then(
      (token: any) => setExpoPushToken(token),
      (error: React.SetStateAction<Error | null>) => setError(error)
    );

    // Add notification listeners
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log("🔔 Notification Received: ", notification);
        setNotification(notification);
        setHasNewNotification(true);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(
          "🔔 Notification Response:",
          JSON.stringify(response, null, 2),
          JSON.stringify(response.notification.request.content.data, null, 2)
        );
        // Handle the notification response here
      });

    // Cleanup listeners on unmount
    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, [notificationConsent]);

  // Logic for handling logged-in users (Optional)
  useEffect(() => {
    if (userDetails?.isAuth) {
      // Perform additional notification handling for logged-in users
    }
  }, [userDetails]);

  return (
    <NotificationContext.Provider
      value={{ expoPushToken, notification, error }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

const NOTIFICATION_CONTEXT = {
  useNotification,
  NotificationProvider,
};

export default NOTIFICATION_CONTEXT;
