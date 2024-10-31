import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import usePrayerInfo from "@/hooks/usePrayerInfo";
import { RootState } from "@/rtk/store";
import { useSelector } from "react-redux";
import PushNotification, { Importance } from "react-native-push-notification";
import { useFocusEffect } from "expo-router";

interface propsType {
  time: string;
  title: string;
  id: number;
  active: boolean;
}

interface adujstedMinute {
  Fajr: number;
  Dhuhr: number;
  Asr: number;
  Maghrib: number;
  Isha: number;
}

const PrayerTimerBox: React.FC<propsType> = ({
  time,
  title,
  id,
  active,
}: any) => {
  const [alarm, setAlarm] = useState(false);
  const { location } = useSelector((state: RootState) => state.app);

  const isChannelIdExist = async (): Promise<string | null> => {
    const channelId: string | null = await AsyncStorage.getItem(title);
    return channelId;
  };

  const isAlermSet = async () => {
    const id = await isChannelIdExist();
    if (id !== null) {
      setAlarm(true);
    }
  };

  const cancleAll = async () => {
    PushNotification.cancelAllLocalNotifications();
    await AsyncStorage.clear();
  };

  useEffect(() => {
    // check if alerm is already set.
    // get notification id (channel id)
    PushNotification.createChannel(
      {
        channelId: title, // (required)
        channelName: "prayer-channel", // (required)
        channelDescription: "A channel for all prayer notification",
        playSound: true,
        soundName: "azan",
        importance: Importance.HIGH,
        vibrate: true,
      },
      (created: any) => {} // (optional) callback returns whether the channel was created, false means it already existed.
    );
    isAlermSet();
  }, []);

  const setNotification = async (time: string, title: string) => {
    // Request permissions (required for iOS)
    // PushNotification.requestPermissions();

    // schedule notification
    function scheduleNotification(id: number, title: string, time: string) {
      // Parse the time string (assumes it can be in 12-hour or 24-hour format)
      const is12HourFormat =
        time.toLowerCase().includes("am") || time.toLowerCase().includes("pm");
      let hours, minutes;

      if (is12HourFormat) {
        // If it's in 12-hour format (e.g., "7:30 AM")
        const timeParts: any = time.match(/(\d+):(\d+)\s*(AM|PM)/i);
        hours = parseInt(timeParts[1]);
        minutes = parseInt(timeParts[2]);
        const ampm = timeParts[3].toUpperCase();

        if (ampm === "PM" && hours !== 12) {
          hours += 12;
        } else if (ampm === "AM" && hours === 12) {
          hours = 0;
        }
      } else {
        // If it's in 24-hour format (e.g., "19:30")
        [hours, minutes] = time.split(":").map(Number);
      }

      // Create a date object for today with the specified time
      const now = new Date();
      const notificationDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        hours,
        minutes,
        0
      );

      // If the time has already passed today, schedule it for tomorrow
      if (notificationDate < now) {
        notificationDate.setDate(notificationDate.getDate() + 1);
      }

      // Schedule the notification
      PushNotification.localNotificationSchedule({
        id: id,
        channelId: title,
        largeIcon: "ic_launcher", // (optional) default: "ic_launcher". Use "" for no large icon.
        smallIcon: "ic_launcher",
        title: `${title} At ${time}`, // (optional)
        message: `⏰ Check daily for accurate prayer times in ${location}`, // (required)
        date: notificationDate, // Schedule the notification at the parsed time
        allowWhileIdle: true,
        repeatTime: 1,
        repeatType: "day", // Daily repeat
        invokeApp: false,
        color: Colors.darkSea,
      });
    }

    scheduleNotification(id, title, time);

    // save channel id to async storge
    await AsyncStorage.setItem(title, `${id}`);
  };

  const cancleNotification = async () => {
    // cancle notification by id
    PushNotification.cancelLocalNotification(`${id}`);
    // delete from async storage
    await AsyncStorage.removeItem(title);
  };

  const handleAlarm = async () => {
    if (!alarm) {
      await setNotification(time, title);
    } else {
      await cancleNotification();
    }
    setAlarm((prev: any) => !prev);
  };

  return (
    <View style={styles.wrapper}>
      <View
        style={{
          width: "30%",
        }}
      >
        <Text
          style={{
            fontSize: 18,
            fontFamily: "MontserrateSemiBold",
            fontWeight: "semibold",
            color: "#ffff",
          }}
        >
          {title}{" "}
          {active && <Ionicons name="caret-back-sharp" color={"#00ff37"} />}
        </Text>
      </View>
      <Text
        style={[
          styles.time,
          {
            width: "40%",
          },
        ]}
      >
        {time}
      </Text>
      <TouchableOpacity
        onPress={handleAlarm}
        style={{
          padding: 10,
          backgroundColor: "#fff",
          borderRadius: 50,
        }}
        activeOpacity={0.5}
      >
        <Ionicons
          name={!alarm ? "notifications-off-sharp" : "notifications"}
          size={22}
          color={Colors.darkSea}
        />
      </TouchableOpacity>
      {/* <Button title="Cancel all" onPress={cancleAll} /> */}
    </View>
  );
};

export default PrayerTimerBox;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.lightSea,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    width: "100%",
  },
  time: {
    fontFamily: "MontserratMedium",
    fontWeight: "medium",
    fontSize: 22,
    color: Colors.text2,
  },
});
