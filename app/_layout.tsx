import React, { useState } from "react";
import "react-native-gesture-handler";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { useSetAtom } from "jotai";
import { AddServiceInProcess } from "./AtomStore/user";
import Toast from "react-native-toast-message";
import { LocaleProvider } from "./context/locale";
import { NotificationProvider } from "./context/NotificationContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as Notifications from "expo-notifications";
import SpaceMono from "../assets/fonts/SpaceMono-Regular.ttf";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const setIsAddService = useSetAtom(AddServiceInProcess);
  const [loaded, error] = useFonts({
    SpaceMono: SpaceMono,
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      setIsAddService(false);
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const queryClient = new QueryClient();

  return (
    <SafeAreaProvider>
      <NotificationProvider>
        <LocaleProvider>
          <QueryClientProvider client={queryClient}>
            <Stack screenOptions={{ headerShown: true }}>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
            <Toast />
          </QueryClientProvider>
        </LocaleProvider>
      </NotificationProvider>
    </SafeAreaProvider>
  );
}
