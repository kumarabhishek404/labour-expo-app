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
    ></Stack>
  );
}
