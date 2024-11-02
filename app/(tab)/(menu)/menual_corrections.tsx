import {
  Alert,
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/header/Header";
import { FlatList } from "react-native-gesture-handler";
import { Colors } from "@/constants/Colors";
import ManualCorrectionModal from "@/components/Features/Settings/ManualCorrectionModal";
import { router } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { setMenualCorrections } from "@/rtk/slices/appSlice";
import { RootState } from "@/rtk/store";

type Props = {};

type listItemProp = {
  id: number;
  label: string;
};

const list = [
  {
    id: 0,
    label: "Fajr",
  },
  {
    id: 1,
    label: "Dhuhr",
  },
  {
    id: 2,
    label: "Asr",
  },
  {
    id: 3,
    label: "Maghrib",
  },
  {
    id: 4,
    label: "Isha",
  },
];

const MenualCorrections = (props: Props) => {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [adujstedMinute, setAdujstedMinute] = useState({
    Fajr: 0,
    Dhuhr: 0,
    Asr: 0,
    Maghrib: 0,
    Isha: 0,
  });
  const { menualCorrections } = useSelector((state: RootState) => state.app);
  const [modalVisible, setModalVisible] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (menualCorrections !== null) {
      setAdujstedMinute(menualCorrections);
    }
  }, []);

  const closeModal = (minute: any | null) => {
    console.log("mm", minute);

    setModalVisible(false);
    if (minute !== null) {
      setAdujstedMinute((prev) => ({
        ...prev,
        [`${selectedItem}`]: minute,
      }));
    }
  };

  useEffect(() => {
    dispatch(setMenualCorrections(adujstedMinute));
    storeMenualCorrection(adujstedMinute);
  }, [adujstedMinute]);

  const storeMenualCorrection = async (value: object) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem("MenualCorrection", jsonValue);
    } catch (e) {
      console.log(e);
    }
  };

  const renderItem = ({ item }: { item: listItemProp }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => {
        setModalVisible(true);
        setSelectedItem(item.label);
      }}
    >
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{item.label}</Text>
        {menualCorrections && (
          <Text style={styles.subText}>
            {menualCorrections[item.label] ?? 0} minutes
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      style={{
        flex: 1,
        width: Dimensions.get("screen").width,
      }}
    >
      <Header title={"Menual corrections"} goBack />
      <View style={styles.container}>
        <FlatList
          data={list}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          extraData={selectedItem}
        />
      </View>
      {selectedItem && (
        <ManualCorrectionModal
          prevValue={60 + menualCorrections[selectedItem]}
          visible={modalVisible}
          onClose={closeModal}
        />
      )}
    </SafeAreaView>
  );
};

export default MenualCorrections;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  },
  item: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    flexDirection: "row",
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "10%",
  },
  radioButton: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  radioButtonSelected: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: Colors.lightSea,
  },
  labelContainer: {
    width: "90%",
  },
  label: {
    fontSize: 16,
    color: Colors.darkSea,
    fontWeight: "500",
  },
  subText: {
    fontSize: 14,
    color: "#666",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});
