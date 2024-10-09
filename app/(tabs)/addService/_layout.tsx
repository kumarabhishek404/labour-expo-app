// app/stack/_layout.tsx
import React from "react";
import { Stack } from "expo-router";

export default function StackLayout() {
  return (
    <Stack
      screenOptions={{
        headerTransparent: true,
        headerShown: false,
      }}
    >
      {/* <Stack.Screen
        name="index"
        options={{ headerShown: false, title: "First Page" }}
      />
      <Stack.Screen
        name="second"
        options={{
          title: "Second Page",
          presentation: "card",
        }}
      /> */}
    </Stack>
  );
}
