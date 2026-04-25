import { Stack } from "expo-router";

export default function HomeStack() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="insights" />
      <Stack.Screen name="purchase-recommendation" />
      <Stack.Screen name="financial-health" />
    </Stack>
  );
}
