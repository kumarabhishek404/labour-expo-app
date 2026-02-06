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
import LOCAL_CONTEXT from "./context/locale";
import NOTIFICATION_CONTEXT from "./context/NotificationContext";
import { ToastProvider } from "./hooks/toast";
import { useAppUpdateGuard } from "./hooks/useAppUpdateGuard";
import ForceUpdateScreen from "@/components/commons/ForceUpdateSection";

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
            <LOCAL_CONTEXT.LocaleProvider>
              <PaperProvider>
                <ToastProvider>
                  {/* 👇 Handle status bar overlay safely */}
                  <StatusBar
                    barStyle="light-content"
                    translucent={true}
                    backgroundColor="transparent"
                  />

                  {/* 👇 Safe area to protect top (notch) and bottom (gesture bar) */}
                  <SafeAreaView
                    style={{ flex: 1, backgroundColor: Colors.primary }}
                    edges={["top", "bottom"]} // ✅ Ensures both top & bottom padding
                  >
                    <Stack>
                      <Stack.Screen
                        name="(tabs)"
                        options={{ headerShown: false }}
                      />
                    </Stack>

                    {/* Keep drawers outside navigation */}
                    <GlobalBottomDrawer />
                    <GlobalSideDrawer />
                  </SafeAreaView>
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
