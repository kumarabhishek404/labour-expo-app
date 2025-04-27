import React, { useEffect, useState, useRef } from "react";
import "react-native-gesture-handler";
import { useRouter, Stack, useRootNavigationState } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  StatusBar,
  View,
  Image,
  ActivityIndicator,
  Text,
  Animated,
} from "react-native";
import Colors from "@/constants/Colors";
import { ToastProvider } from "./hooks/toast";
import NotificationBanner from "@/components/commons/InAppNotificationBanner";
import { cleanOldNotifications } from "@/utils/cleanUpNotifications";
import GlobalBottomDrawer from "@/components/commons/DrawerFromGlobal";
import GlobalSideDrawer from "@/components/commons/Drawer";
import { PaperProvider } from "react-native-paper";
import NOTIFICATION_CONTEXT from "./context/NotificationContext";
import LOCAL_CONTEXT from "./context/locale";
import APP_ICON from "../assets/app/adaptive-icon.png";
import { t } from "@/utils/translationHelper";
import AppWithErrorBoundary from "@/components/commons/ErrorBoundary";
import { useAtom } from "jotai";
import Atoms from "./AtomStore";

const queryClient = new QueryClient();
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [, setIsLoggedIn] = useAtom(Atoms.IsLoggedInAtom);
  const router = useRouter();
  const navigationState = useRootNavigationState();

  useEffect(() => {
    const initApp = async () => {
      try {
        const userData = await AsyncStorage.getItem("user");
        setIsLoggedIn(
          !!(userData && userData !== "null" && userData !== "undefined")
        );
      } catch (error) {
        console.error("Failed to read user data:", error);
        setIsLoggedIn(false);
      } finally {
        setIsReady(true);
      }
    };
    initApp();
  }, []);

  useEffect(() => {
    if (isReady && navigationState?.key) {
      router.replace(Atoms.IsLoggedInAtom ? "/(tabs)" : "/screens/auth/login");
    }
  }, [isReady, navigationState?.key]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    if (isReady) {
      setIsSplashVisible(false);
      SplashScreen.hideAsync();
    }
  }, [isReady]);

  if (isSplashVisible) {
    return (
      <Animated.View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
          opacity: fadeAnim,
        }}
      >
        <Image
          source={APP_ICON}
          style={{ width: 150, height: 150 }}
          resizeMode="contain"
        />
        <ActivityIndicator
          size="large"
          color={Colors.primary}
          style={{ marginVertical: 20 }}
        />
        <Text
          style={{
            position: "absolute",
            bottom: 40,
            fontSize: 16,
            fontWeight: "bold",
            color: Colors.primary,
          }}
        >
          {t("appTagline")}
        </Text>
      </Animated.View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <RootLayoutNav />
    </QueryClientProvider>
  );
}

function RootLayoutNav() {
  const [notification, setNotification] = useState<any>(null);

  useEffect(() => {
    cleanOldNotifications();
  }, []);

  return (
    <AppWithErrorBoundary>
      <SafeAreaProvider>
        <NOTIFICATION_CONTEXT.NotificationProvider>
          <LOCAL_CONTEXT.LocaleProvider>
            <PaperProvider>
              <ToastProvider>
                {notification && (
                  <NotificationBanner
                    title={notification.title}
                    body={notification.body}
                    onClose={() => setNotification(null)}
                  />
                )}
                <StatusBar
                  backgroundColor={Colors.primary}
                  barStyle="light-content"
                />
                <Stack
                  screenOptions={{
                    headerShown: true,
                    animation: "slide_from_right",
                  }}
                >
                  <Stack.Screen
                    name="(tabs)"
                    options={{ headerShown: false }}
                  />
                </Stack>
                <GlobalBottomDrawer />
                <GlobalSideDrawer />
              </ToastProvider>
            </PaperProvider>
          </LOCAL_CONTEXT.LocaleProvider>
        </NOTIFICATION_CONTEXT.NotificationProvider>
      </SafeAreaProvider>
    </AppWithErrorBoundary>
  );
}
