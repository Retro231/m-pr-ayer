import { Text, View } from "react-native";
import React from "react";
import { Colors } from "@/constants/Colors";

const InternetInfo = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.darkSea,
      }}
    >
      <Text
        style={{
          fontSize: 24,
          color: Colors.text2,
          fontWeight: "bold",
        }}
      >
        No Internet Connection!!
      </Text>
      <Text style={{ fontSize: 18, color: Colors.text2 }}>
        Please check you internet connection.
      </Text>
    </View>
  );
};

export default InternetInfo;
