import useFonts from "@/hooks/useFonts";
import { router, SplashScreen, Stack } from "expo-router";
import { useEffect, useState } from "react";
import Loading from "@/components/Loading";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider, useDispatch } from "react-redux";
import { store } from "@/rtk/store";
import NetInfo from "@react-native-community/netinfo";
import InternetInfo from "./InternetInfo";
import PushNotification from "react-native-push-notification";
import { Platform, StatusBar } from "react-native";
import SplashLoading from "@/components/SplashLoading";
import { OneSignal } from "react-native-onesignal";

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [netOk, setNetOk] = useState<boolean | null>(false);

  PushNotification.configure({
    // (required) Called when a remote is received or opened, or local notification is opened
    onNotification: function (notification) {
      console.log("NOTIFICATION:", notification);

      // process the notification

      // (required) Called when a remote is received or opened, or local notification is opened
      // notification.finish(PushNotificationIOS.FetchResult.NoData);
    },

    // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
    onAction: function (notification) {},

    // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
    onRegistrationError: function (err) {
      console.error(err.message, err);
    },

    // IOS ONLY (optional): default: all - Permissions to register.
    // permissions: {
    //   alert: true,
    //   badge: true,
    //   sound: true,
    // },

    // Should the initial notification be popped automatically
    // default: true
    popInitialNotification: true,

    /**
     * (optional) default: true
     * - Specified if permissions (ios) and token (android and ios) will requested or not,
     * - if not, you must call PushNotificationsHandler.requestPermissions() later
     * - if you are not using remote notification or do not have Firebase installed, use this:
     *     requestPermissions: Platform.OS === 'ios'
     */
    requestPermissions: Platform.OS === "ios",
  });

  useEffect(() => {
    // Subscribe
    const unsubscribe = NetInfo.addEventListener((state) => {
      // console.log("Connection type", state.type);
      // console.log("Is connected?", state.isConnected);
      // console.log(state.isConnected);
      // OneSignal Initialization
      OneSignal.initialize("233c5616-037d-419c-97e6-deeec2cd1bb4");

      // requestPermission will show the native iOS or Android notification permission prompt.
      // We recommend removing the following code and instead using an In-App Message to prompt for notification permission
      OneSignal.Notifications.requestPermission(true);

      setNetOk(state.isConnected);
      setAppIsReady(true);
    });

    // Unsubscribe
    return () => {
      unsubscribe();
    };
  }, []);

  if (!appIsReady) {
    return <SplashLoading />;
  }

  if (!netOk) {
    return <InternetInfo />;
  }

  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="(tab)" />
          <Stack.Screen name="InternetInfo" />
          <Stack.Screen name="video_player" />
        </Stack>
      </GestureHandlerRootView>
    </Provider>
  );
}
