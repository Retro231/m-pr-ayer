import { Tabs } from "expo-router";
import React, { useEffect, useState } from "react";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { StyleSheet } from "react-native";
import getCurrentLocation from "@/scripts/getCurrentLocation";
import { useDispatch, useSelector } from "react-redux";
import {
  setDefalutLocation,
  setIs24HourFormat,
  setLocation,
  setMenualCorrections,
  setPrayerTimeConventions,
  setPushNotificaton,
} from "@/rtk/slices/appSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SplashLoading from "@/components/SplashLoading";

export default function TabLayout() {
  const [appIsReady, setAppIsReady] = useState(false);

  const dispatch = useDispatch();
  useEffect(() => {
    (async () => {
      const prevStoredLocation = await AsyncStorage.getItem("location");
      const timeFormetJson = await AsyncStorage.getItem("timeFormet");
      const PrayerTimeConvention = await AsyncStorage.getItem(
        "PrayerTimeConvention"
      );
      const JuristicMethod = await AsyncStorage.getItem("JuristicMethod");
      const MenualCorrection = await AsyncStorage.getItem("MenualCorrection");
      const pushNotification = await AsyncStorage.getItem("pushNotification");

      const timeFormet: {
        is24Hour: boolean;
      } = timeFormetJson != null ? JSON.parse(timeFormetJson) : null;

      // location
      if (prevStoredLocation === null) {
        const location = await getCurrentLocation();

        dispatch(
          setDefalutLocation(
            `${
              location?.city !== null
                ? location?.city
                : location?.subregion !== null
                ? location.subregion
                : location?.region
            }, ${location?.country}`
          )
        );
        dispatch(
          setLocation(
            `${
              location?.city !== null
                ? location?.city
                : location?.subregion !== null
                ? location.subregion
                : location?.region
            }, ${location?.country}`
          )
        );
      }
      if (prevStoredLocation !== null) {
        // value previously stored
        dispatch(setLocation(prevStoredLocation));
      }

      // timeformet
      if (timeFormet != null) {
        dispatch(setIs24HourFormat(timeFormet.is24Hour));
      }

      // Prayer Time Convention
      if (PrayerTimeConvention !== null) {
        dispatch(setPrayerTimeConventions(parseInt(PrayerTimeConvention)));
      }

      // Prayer Time Convention
      if (JuristicMethod !== null) {
        dispatch(setPrayerTimeConventions(parseInt(JuristicMethod)));
      }

      // menual_corrections

      dispatch(
        setMenualCorrections(
          MenualCorrection != null
            ? JSON.parse(MenualCorrection)
            : {
                Fajr: 0,
                Dhuhr: 0,
                Asr: 0,
                Maghrib: 0,
                Isha: 0,
              }
        )
      );

      // push notification

      if (pushNotification !== null) {
        if (pushNotification === "true") dispatch(setPushNotificaton(true));
        else dispatch(setPushNotificaton(false));
      }

      setAppIsReady(true);
    })();
  }, []);

  if (!appIsReady) {
    return <SplashLoading />;
  }
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.lightSea,
        tabBarInactiveTintColor: "#fff",
        // tabBarActiveBackgroundColor: "#D9D9D9",
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.lightSea,
          height: 70,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 5,
          fontWeight: "bold",
          color: "white",
        },
      }}
    >
      <Tabs.Screen
        name="(stack)"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "home" : "home-outline"}
              color={color}
              style={[
                styles.tabIcon,
                { backgroundColor: `${focused ? "#D9D9D9" : "transparent"}` },
              ]}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="prayer_timer"
        options={{
          title: "Prayer Timer",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "alarm" : "alarm-outline"}
              color={color}
              style={[
                styles.tabIcon,
                { backgroundColor: `${focused ? "#D9D9D9" : "transparent"}` },
              ]}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="(QuranStack)"
        options={{
          title: "Al Quran",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "book" : "book-outline"}
              color={color}
              style={[
                styles.tabIcon,
                { backgroundColor: `${focused ? "#D9D9D9" : "transparent"}` },
              ]}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="(media)"
        options={{
          title: "Media",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "tv" : "tv-outline"}
              color={color}
              style={[
                styles.tabIcon,
                { backgroundColor: `${focused ? "#D9D9D9" : "transparent"}` },
              ]}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="(menu)"
        options={{
          title: "Menu",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "menu" : "menu-outline"}
              color={color}
              style={[
                styles.tabIcon,
                { backgroundColor: `${focused ? "#D9D9D9" : "transparent"}` },
              ]}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabIcon: {
    paddingHorizontal: 18,
    paddingVertical: 4,
    borderRadius: 15,
  },
});
