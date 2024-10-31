import {
  Dimensions,
  ImageBackground,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import React, { Component } from "react";
import { ReactNode } from "react";
import { Colors } from "@/constants/Colors";

interface HeroWrapperProps {
  children: ReactNode;
  style?: ViewStyle | ViewStyle[];
}

const HeroWrapper: React.FC<HeroWrapperProps> = ({ children, style }) => {
  return <View style={[styles.wrapper, style]}>{children}</View>;
};

export default HeroWrapper;

const styles = StyleSheet.create({
  wrapper: {
    // flex: 1,
    padding: 16,
    backgroundColor: Colors.lightSea,
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 30,
    paddingBottom: 16,
    paddingTop: 0,
    width: Dimensions.get("screen").width,
  },
});
