// src/navigation/AppNavigator.tsx
import GlobalSideDrawer from "@/components/commons/Drawer";
import GlobalBottomDrawer from "@/components/commons/DrawerFromGlobal";
import AppWithErrorBoundary from "@/components/commons/ErrorBoundary";
import Colors from "@/constants/Colors";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import React, { useEffect } from "react";
import { StatusBar } from "react-native";
import "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";
import "react-native-reanimated"; // MUST be at the top
import { SafeAreaProvider } from "react-native-safe-area-context";
import LOCAL_CONTEXT from "./context/locale";
import NOTIFICATION_CONTEXT from "./context/NotificationContext";
import { ToastProvider } from "./hooks/toast";
import { t } from "@/utils/translationHelper";
import { checkForUpdates } from "@/components/commons/InAppUpdates";

const queryClient = new QueryClient();

const AppNavigator = () => {
  // useEffect(() => {
  //   const checkNativeInAppUpdate = async () => {
  //     try {
  //       const inAppUpdates = new InAppUpdates(true); // 👈 class instantiation
  //       const result = await inAppUpdates.checkNeedsUpdate();
  //       if (result.shouldUpdate) {
  //         await inAppUpdates.startUpdate({
  //           updateType: inAppUpdates.updateTypes.IMMEDIATE, // 👈 not UPDATE_TYPE
  //         });
  //       }
  //     } catch (error) {
  //       console.log("Native in-app update error:", error);
  //     }
  //   };

  //   const checkExpoUpdate = async () => {
  //     try {
  //       const update = await Updates.checkForUpdateAsync();
  //       if (update.isAvailable) {
  //         await Updates.fetchUpdateAsync();
  //         Alert.alert(t("updateAvailable"), t("newVersionIsAvailable"), [
  //           { text: t("restart"), onPress: () => Updates.reloadAsync() },
  //         ]);
  //       }
  //     } catch (error) {
  //       console.log("Expo update check failed:", error);
  //     }
  //   };

  //   // Call both update checkers
  //   checkNativeInAppUpdate();
  //   checkExpoUpdate();
  // }, []);

  useEffect(() => {
    checkForUpdates();
  }, []);

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
