import Header from "@/components/header/Header";
import { Colors } from "@/constants/Colors";
import { types } from "@babel/core";
import React, { useEffect, useState } from "react";
import getPrayerConventions from "@/scripts/getPrayerTimeConventions";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { setJuristicMethod } from "@/rtk/slices/appSlice";
import { RootState } from "@/rtk/store";

interface listItemProp {
  id: number;
  label: string;
}

const list = [
  {
    id: 0,
    label: "Standard(Shafi, Maliki, Hanbali)",
  },
  {
    id: 1,
    label: "Hanafi",
  },
];

const JuristicMethod = () => {
  const {
    location,
    defaultLocation,
    is24HourFormat,
    prayerTimeConventions,
    menualCorrections,
    juristicMethod,
  } = useSelector((state: RootState) => state.app);

  const [selectedId, setSelectedId] = useState<number | null>(juristicMethod);
  const dispatch = useDispatch();

  const handleSelect = (id: number) => {
    setSelectedId(id);
  };

  useEffect(() => {
    dispatch(setJuristicMethod(selectedId ?? 0));
    storeJuristicMethod(selectedId ?? 0);
  }, [selectedId]);

  const storeJuristicMethod = async (value: number) => {
    try {
      await AsyncStorage.setItem("JuristicMethod", `${value}`);
    } catch (e) {
      console.log(e);
    }
  };

  const renderItem = ({ item }: { item: listItemProp }) => (
    <TouchableOpacity style={styles.item} onPress={() => handleSelect(item.id)}>
      <View style={styles.radioContainer}>
        <View style={styles.radioButton}>
          {selectedId === item.id && (
            <View style={styles.radioButtonSelected} />
          )}
        </View>
      </View>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{item.label}</Text>
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
      <Header title={"Prayer time conventions"} goBack />
      <View style={styles.container}>
        <FlatList
          data={list}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          extraData={selectedId}
        />
      </View>
    </SafeAreaView>
  );
};

export default JuristicMethod;

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
});
