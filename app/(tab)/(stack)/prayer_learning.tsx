import { Dimensions, StyleSheet, Text, View } from "react-native";
import React from "react";
import Header from "@/components/header/Header";
import { SafeAreaView } from "react-native-safe-area-context";
import Pdf from "react-native-pdf";

const PrayerLearning = () => {
  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <Header title={"Prayer Learning"} goBack />
      <View
        style={{
          flex: 1,
        }}
      >
        <Pdf
          trustAllCerts={false}
          source={{
            uri: "https://salamcenter.org/wp-content/uploads/2020/09/Prayer-Guide.pdf",
            cache: true,
          }}
          onLoadComplete={(numberOfPages, filePath) => {
            console.log(`Number of pages: ${numberOfPages}`);
          }}
          onPageChanged={(page, numberOfPages) => {
            console.log(`Current page: ${page}`);
          }}
          onError={(error) => {
            console.log(error);
          }}
          onPressLink={(uri) => {
            console.log(`Link pressed: ${uri}`);
          }}
          style={styles.pdf}
        />
      </View>
    </SafeAreaView>
  );
};

export default PrayerLearning;

const styles = StyleSheet.create({
  pdf: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});
