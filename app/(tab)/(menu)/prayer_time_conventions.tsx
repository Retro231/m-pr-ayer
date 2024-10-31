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
import { useDispatch, useSelector } from "react-redux";
import { setPrayerTimeConventions } from "@/rtk/slices/appSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RootState } from "@/rtk/store";

interface prayerTimeProps {
  id: number;
  label: string;
  Fajr: string;
  Isha: string;
}

const PrayerTimeConventions = () => {
  const { prayerTimeConventions } = useSelector(
    (state: RootState) => state.app
  );
  const [list, setList] = useState<[] | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(
    prayerTimeConventions
  );

  const dispatch = useDispatch();
  const handleSelect = (id: number) => {
    setSelectedId(id);
  };

  useEffect(() => {
    dispatch(setPrayerTimeConventions(selectedId ?? 0));
    storePrayerTimeConvention(selectedId ?? 0);
  }, [selectedId]);

  useEffect(() => {
    (async () => {
      const data: any = await getPrayerConventions();
      setList(data);
    })();
  }, []);

  const storePrayerTimeConvention = async (value: number) => {
    try {
      await AsyncStorage.setItem("PrayerTimeConvention", `${value}`);
    } catch (e) {
      console.log(e);
    }
  };

  const renderItem = ({ item }: { item: prayerTimeProps }) => (
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
        <Text style={styles.subText}>
          Fajr: {item.Fajr} / Isha'a: {item.Isha}
        </Text>
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

export default PrayerTimeConventions;
