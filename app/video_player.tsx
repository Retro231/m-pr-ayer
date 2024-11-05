import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Alert, BackHandler, Dimensions, StyleSheet, View } from "react-native";
import VideoPlayer from "react-native-video-controls";
import * as ScreenOrientation from "expo-screen-orientation";
import { useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";

const Video_Player = () => {
  const [fullScreen, setFullScreen] = useState(false);
  const { imageUri, title, url, category }: any = useLocalSearchParams();

  const navigation: any = useNavigation();

  const handleOnBack = () => {
    Alert.alert("Hold on!", "Are you sure you want to go back?", [
      {
        text: "Cancel",
        onPress: () => null,
        style: "cancel",
      },
      {
        text: "YES",
        onPress: async () => {
          await ScreenOrientation.lockAsync(
            ScreenOrientation.OrientationLock.PORTRAIT
          );
          navigation.goBack(null);
        },
      },
    ]);
    return true;
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleOnBack
    );

    return () => backHandler.remove();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <VideoPlayer
        onBack={() => handleOnBack()}
        source={{
          uri: `${url}`,
        }}
        title={title}
        // fullScreen={handleFullScreen}
        isFullscreen={true}
        onEnterFullscreen={async () => {
          await ScreenOrientation.lockAsync(
            ScreenOrientation.OrientationLock.LANDSCAPE
          );
          setFullScreen(true);
        }}
        onExitFullscreen={async () => {
          await ScreenOrientation.lockAsync(
            ScreenOrientation.OrientationLock.PORTRAIT
          );
          setFullScreen(false);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
});

export default Video_Player;
