import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { ImageBackground } from "react-native";

// "number": 1,
// "name": "سُورَةُ ٱلْفَاتِحَةِ",
// "englishName": "Al-Faatiha",
// "englishNameTranslation": "The Opening",
// "numberOfAyahs": 7,
// "revelationType": "Meccan"

interface ListItemProps {
  id?: number;
  name?: string;
  englishName?: string;
  surahNo?: number;
  ayahNo?: number;
  handleDelete?: () => void;
  handlePress?: () => void;
}

const LikedVerseItem: React.FC<ListItemProps> = ({
  id,
  name,
  englishName,
  surahNo,
  ayahNo,
  handleDelete,
  handlePress,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.5}
      style={styles.container}
      onPress={handlePress}
    >
      <ImageBackground source={require("@/assets/images/frame.png")}>
        <View style={styles.numberContainer}>
          <Text style={styles.number}>{`${id}`}</Text>
        </View>
      </ImageBackground>
      <View style={styles.titleWrapper}>
        {name && <Text style={styles.title}>{englishName}</Text>}
        {name && <Text style={styles.title}>{name}</Text>}
      </View>
      <View style={styles.titleWrapper}>
        <Text style={styles.title}>{`Verse`}</Text>
        <Text style={styles.title}>{`${ayahNo}`}</Text>
      </View>

      <Ionicons
        onPress={handleDelete}
        name={"close"}
        size={24}
        color={"white"}
        style={styles.icon}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.lightSea,
    borderRadius: 8,
    padding: 10,
    marginHorizontal: 10,
    marginVertical: 5,
    justifyContent: "space-between",
  },
  numberContainer: {
    width: 40,
    height: 40,
    borderColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  number: {
    fontFamily: "MontserratBold",
    fontWeight: "bold",
    color: "white",
    fontSize: 14,
  },
  titleWrapper: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 2,
  },
  title: {
    fontFamily: "MontserratMedium",
    fontWeight: "medium",
    color: "white",
    fontSize: 18,
  },
  icon: {
    // marginLeft: "auto",
    fontSize: 28,
  },
});

export default LikedVerseItem;
