import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/header/Header";
import WebView from "react-native-webview";
import { useLocalSearchParams } from "expo-router";
import VideoPlayer from "@/app/video_player";

const Player = () => {
  const { imageUri, title, url, category }: any = useLocalSearchParams();
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <Header title={title ?? ""} goBack />
        {category === "web" && url && (
          <WebView
            style={{
              flex: 1,
            }}
            originWhitelist={["*"]}
            source={{
              uri: url,
            }}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default Player;

const styles = StyleSheet.create({});
