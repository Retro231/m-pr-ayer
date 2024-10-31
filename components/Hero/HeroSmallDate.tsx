import { StyleSheet, Text, View, ViewStyle } from "react-native";
import React from "react";
import { Colors } from "@/constants/Colors";
import MyLocation from "../MyLocation";

interface propsType {
  eng: String;
  arabic: String;
  style?: ViewStyle | ViewStyle[];
}
const HeroSmallDate: React.FC<propsType> = ({ eng, arabic, style }) => {
  return (
    <View style={[style]}>
      <Text
        style={{
          fontFamily: "MontserratSemiBold",
          fontWeight: "semibold",
          fontSize: 16,
          color: Colors.text2,
        }}
      >
        {eng}
      </Text>
      <Text
        style={{
          fontFamily: "MontserratMedium",
          fontWeight: "medium",
          fontSize: 16,
          color: Colors.text2,
        }}
      >
        {arabic}
      </Text>
      <MyLocation />
    </View>
  );
};

export default HeroSmallDate;

const styles = StyleSheet.create({});
