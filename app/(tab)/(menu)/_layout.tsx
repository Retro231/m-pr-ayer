import React from "react";
import { Stack } from "expo-router";

const menuHome = () => {
  return (
    <Stack>
      <Stack.Screen name="menu" options={{ headerShown: false }} />
      <Stack.Screen
        name="prayer_time_conventions"
        options={{ headerShown: false }}
      />
      <Stack.Screen name="juristic_method" options={{ headerShown: false }} />
      <Stack.Screen
        name="menual_corrections"
        options={{ headerShown: false }}
      />
      <Stack.Screen name="privacyPolicy" options={{ headerShown: false }} />
      <Stack.Screen name="storage" options={{ headerShown: false }} />
      <Stack.Screen name="settings" options={{ headerShown: false }} />
    </Stack>
  );
};

export default menuHome;
