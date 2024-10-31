import { StyleSheet, Text, View, ViewStyle } from "react-native";
import React from "react";
import { Colors } from "@/constants/Colors";

interface propsType {
  title: String;
  info: String;
  time?: String;
  style?: ViewStyle | ViewStyle[];
}

const HeroStatus: React.FC<propsType> = ({ title, info, time, style }) => {
  return (
    <View style={[style]}>
      <Text
        style={{
          fontSize: 16,
          color: Colors.text2,
          fontWeight: "300",
        }}
      >
        {title}
      </Text>
      <Text
        style={{
          fontSize: 24,
          color: Colors.text2,
        }}
      >
        {info}
      </Text>
      <Text
        style={{
          fontSize: 28,
          color: Colors.text2,
          fontWeight: "300",
        }}
      >
        {time}
      </Text>
    </View>
  );
};

export default HeroStatus;

const styles = StyleSheet.create({});
