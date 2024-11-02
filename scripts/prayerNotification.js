import { Colors } from "@/constants/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PushNotification, { Importance } from "react-native-push-notification";

const createNotificationChannel = (title) => {
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
    (created) => {} // (optional) callback returns whether the channel was created, false means it already existed.
  );
};

const setNotification = async (id, time, title, location) => {
  // Request permissions (required for iOS)
  // PushNotification.requestPermissions();

  // schedule notification
  function scheduleNotification(id, title, time) {
    // Parse the time string (assumes it can be in 12-hour or 24-hour format)
    const is12HourFormat =
      time.toLowerCase().includes("am") || time.toLowerCase().includes("pm");
    let hours, minutes;

    if (is12HourFormat) {
      // If it's in 12-hour format (e.g., "7:30 AM")
      const timeParts = time.match(/(\d+):(\d+)\s*(AM|PM)/i);
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

const cancleNotification = async (id, title) => {
  // cancle notification by id
  PushNotification.cancelLocalNotification(`${id}`);
  // delete from async storage
  await AsyncStorage.removeItem(title);
};

const cancleAllNotification = async () => {
  PushNotification.cancelAllLocalNotifications();
  await AsyncStorage.clear();
};

const handleNotificationOnChanges = async (time, name, location, index) => {
  const channelId = await AsyncStorage.getItem(name);
  const prevPrayerTime = await AsyncStorage.getItem(`prev${name}time`);
  // console.log("prev", prevPrayerTime);
  if (channelId !== null) {
    if (prevPrayerTime === null || prevPrayerTime !== time) {
      cancleNotification(index, name);
      createNotificationChannel(name);
      setNotification(index, time, name, location);
      await AsyncStorage.setItem(`prev${name}time`, time);
    }
  }
};
export {
  createNotificationChannel,
  setNotification,
  cancleNotification,
  cancleAllNotification,
  handleNotificationOnChanges,
};
