import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="(employer)" options={{ headerShown: false }} />
    </Stack>
  );
}
