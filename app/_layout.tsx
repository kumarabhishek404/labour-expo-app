import React, { useEffect, useRef, useState } from "react";
import "react-native-gesture-handler";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { router, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import LOCAL_CONTEXT from "./context/locale";
import NOTIFICATION_CONTEXT from "./context/NotificationContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as Notifications from "expo-notifications";
import SpaceMono from "../assets/fonts/SpaceMono-Regular.ttf";
import AuthListener from "./context/AuthListner";
import { PaperProvider } from "react-native-paper";
import { StatusBar } from "react-native";
import Colors from "@/constants/Colors";
import GlobalBottomDrawer from "@/components/commons/DrawerFromGlobal";
import { ToastProvider } from "./hooks/toast";
import NotificationBanner from "@/components/commons/InAppNotificationBanner";
import { cleanOldNotifications } from "@/utils/cleanUpNotifications";

// ✅ Notification Handler for foreground handling
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
  initialRouteName: "/(tabs)",
};

SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: SpaceMono,
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  if (!loaded) return null;

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const queryClient = new QueryClient();
  const [notification, setNotification] = useState<any>(null);

  useEffect(() => {
    cleanOldNotifications();
  }, []);

  return (
    <SafeAreaProvider>
      <NOTIFICATION_CONTEXT.NotificationProvider>
        <LOCAL_CONTEXT.LocaleProvider>
          <QueryClientProvider client={queryClient}>
            <PaperProvider>
              <ToastProvider>
                {notification && (
                  <NotificationBanner
                    title={notification.title}
                    body={notification.body}
                    onClose={() => setNotification(null)}
                  />
                )}
                <StatusBar backgroundColor={Colors?.background} />
                <Stack screenOptions={{ headerShown: true }}>
                  <Stack.Screen
                    name="(tabs)"
                    options={{ headerShown: false }}
                  />
                </Stack>
                <GlobalBottomDrawer />
                <AuthListener />
              </ToastProvider>
            </PaperProvider>
          </QueryClientProvider>
        </LOCAL_CONTEXT.LocaleProvider>
      </NOTIFICATION_CONTEXT.NotificationProvider>
    </SafeAreaProvider>
  );
}
