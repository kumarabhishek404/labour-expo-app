// src/navigation/AppNavigator.tsx
import GlobalSideDrawer from "@/components/commons/Drawer";
import GlobalBottomDrawer from "@/components/commons/DrawerFromGlobal";
import AppWithErrorBoundary from "@/components/commons/ErrorBoundary";
import Colors from "@/constants/Colors";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import React from "react";
import { StatusBar } from "react-native";
import "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";
import "react-native-reanimated"; // MUST be at the top
import { SafeAreaProvider } from "react-native-safe-area-context";
import LOCAL_CONTEXT from "./context/locale";
import NOTIFICATION_CONTEXT from "./context/NotificationContext";
import { ToastProvider } from "./hooks/toast";

const queryClient = new QueryClient();

const AppNavigator = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AppWithErrorBoundary>
        <SafeAreaProvider>
          <NOTIFICATION_CONTEXT.NotificationProvider>
            <LOCAL_CONTEXT.LocaleProvider>
              <PaperProvider>
                <ToastProvider>
                  <StatusBar
                    backgroundColor={Colors.primary}
                    barStyle="light-content"
                  />
                  <Stack>
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
    </QueryClientProvider>
  );
};

export default AppNavigator;
