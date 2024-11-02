import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RootState } from "@/rtk/store";
import { useDispatch, useSelector } from "react-redux";
import {
  cancleNotification,
  createNotificationChannel,
  setNotification,
} from "@/scripts/prayerNotification";
import ManualCorrectionModal from "../Settings/ManualCorrectionModal";
import { setMenualCorrections } from "@/rtk/slices/appSlice";
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
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const { menualCorrections } = useSelector((state: RootState) => state.app);
  const [modalVisible, setModalVisible] = useState(false);
  const [adujstedMinute, setAdujstedMinute] = useState({
    Fajr: 0,
    Dhuhr: 0,
    Asr: 0,
    Maghrib: 0,
    Isha: 0,
  });

  const dispatch = useDispatch();

  const closeModal = (minute: any | null) => {
    setModalVisible(false);
    // if (minute !== null) {
    //   setAdujstedMinute((prev) => ({
    //     ...prev,
    //     [`${selectedItem}`]: minute,
    //   }));
    // }
    if (minute !== null)
      dispatch(
        setMenualCorrections({ ...adujstedMinute, [`${selectedItem}`]: minute })
      );

    storeMenualCorrection({ ...adujstedMinute, [`${selectedItem}`]: minute });
  };

  const storeMenualCorrection = async (value: object) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem("MenualCorrection", jsonValue);
    } catch (e) {
      console.log(e);
    }
  };

  const isChannelIdExist = async (): Promise<string | null> => {
    const channelId: string | null = await AsyncStorage.getItem(title);
    return channelId;
  };

  useEffect(() => {
    (async () => {
      const id = await isChannelIdExist();
      if (id !== null) {
        setAlarm(true);
      } else {
        setAlarm(false);
      }
    })();
  }, []);

  const handleAlarm = async () => {
    if (!alarm) {
      await setNotification(id, time, title);
    } else {
      await cancleNotification(id, title);
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
      <TouchableOpacity
        style={[
          {
            width: "40%",
          },
        ]}
        onPress={() => {
          setModalVisible(true);
          setSelectedItem(title);
          if (menualCorrections !== null) {
            setAdujstedMinute(menualCorrections);
          }
        }}
      >
        <Text style={[styles.time]}>{time}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          handleAlarm();
        }}
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
      {selectedItem && (
        <ManualCorrectionModal
          prevValue={60 + menualCorrections[selectedItem]}
          visible={modalVisible}
          onClose={closeModal}
        />
      )}
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
