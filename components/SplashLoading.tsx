import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Colors } from "@/constants/Colors";

const SplashLoading = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 10,
        backgroundColor: "#000",
      }}
    >
      <Image
        source={require("@/assets/images/splash.png")}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          backgroundColor: "#fff",
        }}
      />
    </View>
  );
};

export default SplashLoading;

const styles = StyleSheet.create({});
