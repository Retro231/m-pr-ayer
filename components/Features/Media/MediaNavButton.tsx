import { Image, ImageProps, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Colors } from "@/constants/Colors";
import { TouchableOpacity } from "react-native-gesture-handler";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

interface proptypes {
  imageUri?: any;
  title?: string;
  url?: string;
  category?: string;
}
const MediaNavButton: React.FC<proptypes> = ({
  imageUri,
  title,
  url,
  category,
}) => {
  return (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: Colors.lightSea,
        paddingHorizontal: 8,
        paddingVertical: 8,
        borderRadius: 8,
        alignItems: "center",
      }}
      activeOpacity={0.7}
      onPress={() => {
        if (category === "web") {
          router.push({
            pathname: "/player",
            params: {
              imageUri,
              title,
              url,
              category,
            },
          });
        } else {
          router.push({
            pathname: "/video_player",
            params: {
              imageUri,
              title,
              url,
              category,
            },
          });
        }
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center",
          gap: 10,
        }}
      >
        {imageUri ? (
          <Image
            style={{
              borderRadius: 8,
              width: 50,
              height: 50,
            }}
            source={imageUri}
            width={50}
            height={50}
          />
        ) : (
          <Ionicons
            name={category === "tv" ? "tv" : "globe"}
            size={24}
            color={Colors.text2}
          />
        )}
        <View>
          {title && (
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                color: Colors.text2,
              }}
            >
              {title}
            </Text>
          )}
          {category && (
            <Text
              style={{
                fontSize: 12,
                fontWeight: "600",
                color: "#ddd",
                textTransform: "capitalize",
              }}
            >
              {category}
            </Text>
          )}
        </View>
      </View>
      <Ionicons name="arrow-forward-circle" size={32} color={"white"} />
    </TouchableOpacity>
  );
};

export default MediaNavButton;

const styles = StyleSheet.create({});
