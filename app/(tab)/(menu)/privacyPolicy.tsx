import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/header/Header";

type Props = {};

const PrivacyPolicy = (props: Props) => {
  return (
    <SafeAreaView>
      <Header title={"Privacy Policy"} goBack />
    </SafeAreaView>
  );
};

export default PrivacyPolicy;

const styles = StyleSheet.create({});
