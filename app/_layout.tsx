import React, { useEffect, useState } from "react";
import "react-native-gesture-handler";
import { useRouter, Stack, useRootNavigationState } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AUTH from "./api/auth";
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
import GlobalBottomDrawer from "@/components/commons/DrawerFromGlobal";
import { ToastProvider } from "./hooks/toast";
import NotificationBanner from "@/components/commons/InAppNotificationBanner";
import { cleanOldNotifications } from "@/utils/cleanUpNotifications";
import GlobalSideDrawer from "@/components/commons/Drawer";
import { PaperProvider } from "react-native-paper";
import NOTIFICATION_CONTEXT from "./context/NotificationContext";
import LOCAL_CONTEXT from "./context/locale";
import APP_ICON from "../assets/app/adaptive-icon.png";
import { t } from "@/utils/translationHelper";

const queryClient = new QueryClient();

// Prevent splash screen from hiding automatically
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  const fadeAnim = new Animated.Value(0);
  const router = useRouter();
  const navigationState = useRootNavigationState(); // Check if navigation is ready

  useEffect(() => {
    const checkUser = async () => {
      const startTime = Date.now();

      try {
        const userData = await AsyncStorage.getItem("user");

        if (!userData || userData === "null" || userData === "undefined") {
          setIsLoggedIn(false);
        } else {
          const parsedUser = JSON.parse(userData);
          const isTokenValid = await validateToken(parsedUser.token);
          setIsLoggedIn(isTokenValid);
          if (!isTokenValid) {
            await AsyncStorage.removeItem("user");
          }
        }
      } catch (err) {
        console.error("Error checking authentication:", err);
      } finally {
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(2000 - elapsedTime, 0);

        setTimeout(() => {
          setIsAuthChecked(true);
          setIsSplashVisible(false);
          SplashScreen.hideAsync();
        }, remainingTime);
      }
    };

    checkUser();
  }, []);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  // Ensure navigation happens only when root layout is fully mounted
  useEffect(() => {
    if (isAuthChecked && navigationState?.key) {
      router.replace(isLoggedIn ? "/(tabs)" : "/screens/auth/login");
    }
  }, [isAuthChecked, isLoggedIn, navigationState?.key]);

  const validateToken = async (token: string | null) => {
    if (!token) return false;
    try {
      const response = await AUTH?.validateToken();
      return response?.status === 200;
    } catch {
      return false;
    }
  };

  // Show splash screen with animation for 2 seconds
  if (isSplashVisible) {
    return (
      <Animated.View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#FFFFFF",
          opacity: fadeAnim,
        }}
      >
        {/* Logo */}
        <Image
          source={APP_ICON}
          style={{ width: 150, height: 150 }}
          resizeMode="contain"
        />

        {/* Loader between logo and text */}
        <ActivityIndicator
          size="large"
          color="#fb642b"
          style={{ position: "absolute", bottom: 60, marginVertical: 20 }}
        />

        {/* Tagline */}
        <Text
          style={{
            position: "absolute",
            bottom: 40,
            fontSize: 16,
            fontWeight: "bold",
            color: "#fb642b",
          }}
        >
          {t("appTagline")}
        </Text>
      </Animated.View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <RootLayoutNav isLoggedIn={isLoggedIn} />
    </QueryClientProvider>
  );
}

function RootLayoutNav({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [notification, setNotification] = useState<any>(null);

  useEffect(() => {
    cleanOldNotifications();
  }, []);

  return (
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
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              </Stack>
              <GlobalBottomDrawer />
              <GlobalSideDrawer />
            </ToastProvider>
          </PaperProvider>
        </LOCAL_CONTEXT.LocaleProvider>
      </NOTIFICATION_CONTEXT.NotificationProvider>
    </SafeAreaProvider>
  );
}
