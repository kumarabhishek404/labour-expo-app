import React, { useEffect, useState } from "react";
import "react-native-gesture-handler";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { useRouter, Stack } from "expo-router";
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
import GlobalSideDrawer from "@/components/commons/Drawer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AUTH from "./api/auth";
import SplashVideo from "@/components/commons/SplashVideo";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export { ErrorBoundary } from "expo-router";

const queryClient = new QueryClient(); // Moved outside to prevent re-creation

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono,
    ...FontAwesome.font,
  });
  const [isVideoDone, setIsVideoDone] = useState(false);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    SplashScreen.preventAutoHideAsync();
    const checkUser = async () => {
      try {
        const userData = await AsyncStorage.getItem("user");
        if (!userData || userData === "null" || userData === "undefined") {
          setIsLoggedIn(false);
        } else {
          const parsedUser = JSON.parse(userData);
          const isTokenValid = await validateToken(parsedUser.token);
          if (!isTokenValid) {
            await AsyncStorage.removeItem("user");
            setIsLoggedIn(false);
          } else {
            setIsLoggedIn(true);
          }
        }
      } catch (err) {
        console.error("Error checking authentication:", err);
      } finally {
        setIsAuthChecked(true);
      }
    };
    checkUser();
  }, []);

  useEffect(() => {
    if (isAuthChecked && isVideoDone) {
      setTimeout(() => {
        router.replace(isLoggedIn ? "/(tabs)" : "/screens/auth/login");
      }, 350);
    }
  }, [isAuthChecked, isVideoDone, isLoggedIn]);

  const validateToken = async (token: string | null) => {
    if (!token) return false;
    try {
      const response = await AUTH?.validateToken();
      if (response?.status === 401 || response?.status === 403) {
        await AsyncStorage.removeItem("user");
        return false;
      }
      return response?.status === 200;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  if (!loaded || !isAuthChecked) return null;

  return (
    <QueryClientProvider client={queryClient}>
      {!isVideoDone ? (
        <SplashVideo
          onFinish={async () => {
            setIsVideoDone(true);
            await SplashScreen.hideAsync();
          }}
        />
      ) : (
        <RootLayoutNav isLoggedIn={isLoggedIn} />
      )}
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
                {isLoggedIn ? (
                  <Stack.Screen
                    name="(tabs)"
                    options={{ headerShown: false }}
                  />
                ) : (
                  <Stack.Screen
                    name="screens/auth/login"
                    options={{ headerShown: false }}
                  />
                )}
              </Stack>
              <GlobalBottomDrawer />
              <GlobalSideDrawer />
              <AuthListener />
            </ToastProvider>
          </PaperProvider>
        </LOCAL_CONTEXT.LocaleProvider>
      </NOTIFICATION_CONTEXT.NotificationProvider>
    </SafeAreaProvider>
  );
}
