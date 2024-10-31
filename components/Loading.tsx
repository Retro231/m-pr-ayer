import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Colors } from "@/constants/Colors";

const Loading = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <ActivityIndicator size={24} color={Colors.darkSea} />
    </View>
  );
};

export default Loading;

const styles = StyleSheet.create({});
