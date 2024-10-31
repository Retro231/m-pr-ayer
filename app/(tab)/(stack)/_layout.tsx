import { store } from "@/rtk/store";
import { Stack } from "expo-router";
import { Provider } from "react-redux";

export default function StackLayout() {
  return (
    <Provider store={store}>
      <Stack
      // screenOptions={{
      //   headerStyle: {
      //     backgroundColor: "#f4511e",
      //   },
      //   headerTintColor: "#fff",
      //   headerTitleStyle: {
      //     fontWeight: "bold",
      //   },
      // }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="compass" options={{ headerShown: false }} />
        <Stack.Screen name="prayer_learning" options={{ headerShown: false }} />
        <Stack.Screen name="nearby_mosque" options={{ headerShown: false }} />
        <Stack.Screen
          name="halal_restaurant"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="(tasbih)" options={{ headerShown: false }} />
        <Stack.Screen name="dua" options={{ headerShown: false }} />
      </Stack>
    </Provider>
  );
}
