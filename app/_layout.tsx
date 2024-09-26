import React, { useState } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
// import { StateProvider } from "./context/context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import * as Location from "expo-location";
import { useAtom } from "jotai";
import { LocationAtom } from "./AtomStore/user";
import Toast from "react-native-toast-message";
import { getLocales } from "expo-localization";
import { LocaleProvider } from "./context/locale";

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
  // const setLocationAt
  const deviceLanguage = getLocales()[0].languageCode;
  const [location, setLocation] = useAtom(LocationAtom);
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  console.log("deviceLanguage---", deviceLanguage);

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    const getPermission = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Please grant location permission");
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      let response = await Location.reverseGeocodeAsync({
        latitude: currentLocation?.coords?.latitude,
        longitude: currentLocation?.coords?.longitude,
      });
    };
    getPermission();
  }, []);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const queryClient = new QueryClient();

  return (
    <LocaleProvider>
      <QueryClientProvider client={queryClient}>
        <Stack screenOptions={{ headerShown: true }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
        <Toast />
      </QueryClientProvider>
    </LocaleProvider>
  );
}
