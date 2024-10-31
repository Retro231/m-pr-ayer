import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";

const mediaHome = () => {
  return (
    <Stack>
      <Stack.Screen name="media" options={{ headerShown: false }} />
      <Stack.Screen name="player" options={{ headerShown: false }} />
    </Stack>
  );
};

export default mediaHome;
