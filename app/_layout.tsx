import "react-native-gesture-handler";
import GlobalSideDrawer from "@/components/commons/Drawer";
import GlobalBottomDrawer from "@/components/commons/DrawerFromGlobal";
import AppWithErrorBoundary from "@/components/commons/ErrorBoundary";
import Colors from "@/constants/Colors";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import React from "react";
import { StatusBar } from "react-native";
import { PaperProvider } from "react-native-paper";
import APP_CONTEXT from "./context/locale";
import NOTIFICATION_CONTEXT from "./context/NotificationContext";
import { ToastProvider } from "./hooks/toast";
import { useAppUpdateGuard } from "./hooks/useAppUpdateGuard";
import ForceUpdateScreen from "@/components/commons/ForceUpdateSection";
import AnalyticsSession from "@/components/commons/AnalyticsSession";

const queryClient = new QueryClient();

const AppNavigator = () => {
  const { forceUpdate, message, appUrl } = useAppUpdateGuard();

  if (forceUpdate) {
    return <ForceUpdateScreen message={message} appUrl={appUrl} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AppWithErrorBoundary>
        <SafeAreaProvider>
          <NOTIFICATION_CONTEXT.NotificationProvider>
            <APP_CONTEXT.AppProvider>
              <PaperProvider>
                <ToastProvider>
                  <AnalyticsSession />
                  <StatusBar
                    barStyle="light-content"
                    translucent={true}
                    backgroundColor="transparent"
                  />

                  <SafeAreaView
                    style={{ flex: 1, backgroundColor: Colors.primary }}
                    edges={["top", "bottom"]}
                  >
                    {/**
                     * Single Stack registers **all** file routes (`(tabs)`, `job`, `screens`, …).
                     * Do not list only `(tabs)` — that hid `/screens/*` and `/job/*` from the navigator,
                     * so deep links could never open service details.
                     */}
                    <Stack screenOptions={{ headerShown: false }} />

                    <GlobalBottomDrawer />
                    <GlobalSideDrawer />
                  </SafeAreaView>
                </ToastProvider>
              </PaperProvider>
            </APP_CONTEXT.AppProvider>
          </NOTIFICATION_CONTEXT.NotificationProvider>
        </SafeAreaProvider>
      </AppWithErrorBoundary>
    </QueryClientProvider>
  );
};

export default AppNavigator;
