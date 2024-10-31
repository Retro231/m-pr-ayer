import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "@/constants/Colors";
import * as Location from "expo-location";
import { StatusBar } from "expo-status-bar";
import { useSelector } from "react-redux";
import { RootState } from "@/rtk/store";

interface Address {
  street: string | null;
  city: string | null;
  region: string | null;
  postalCode: string | null;
  country: string | null;
}

const MyLocation = () => {
  // const { address, errorMsg } = useMyLocation();
  const location = useSelector((state: RootState) => state.app.location);

  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <StatusBar backgroundColor="#fff" />
      <Ionicons name="location" size={24} color={Colors.text2} />
      <Text
        style={{
          color: Colors.text2,
          fontWeight: "semibold",
          fontFamily: "MontserratSemiBold",
          fontSize: 14,
        }}
      >
        {location !== null ? location : "fatching..."}
      </Text>
    </View>
  );
};

export default MyLocation;

const styles = StyleSheet.create({});
