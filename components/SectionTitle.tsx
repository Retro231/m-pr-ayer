import { StyleSheet, Text, View, ViewStyle } from "react-native";
import React from "react";
import { Colors } from "@/constants/Colors";

interface PropsType {
  title: String;
  style?: ViewStyle | ViewStyle[];
}

const SectionTitle: React.FC<PropsType> = ({ title, style }) => {
  return (
    <View
      style={{
        marginBottom: 5,
      }}
    >
      <Text
        style={[
          {
            fontFamily: "MontserratBold",
            fontWeight: "bold",
            color: Colors.lightSea,
            fontSize: 18,
            textTransform: "capitalize",
          },
          style,
        ]}
      >
        {title}
      </Text>
    </View>
  );
};

export default SectionTitle;

const styles = StyleSheet.create({});
