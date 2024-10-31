import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome5";
import { Colors } from "@/constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";

interface propsType {
  iconName: keyof typeof FontAwesome.glyphMap | keyof typeof Ionicons.glyphMap;
  featureName: String;
  empty: Boolean;
  route: String;
}

const FeatureNavBtn: React.FC<propsType> = ({
  iconName,
  featureName,
  empty,
  route,
}) => {
  const handlePress = () => {
    router.navigate(`${route}`);
  };

  if (empty) {
    return <View style={[styles.wrapper, styles.buttonInvisible]} />;
  }
  return (
    <TouchableOpacity
      style={styles.wrapper}
      activeOpacity={0.9}
      onPress={handlePress}
    >
      {featureName === "Prayer Timer" || featureName === "Halal Restaurant" ? (
        <Ionicons
          name={featureName === "Prayer Timer" ? "alarm-outline" : "fast-food"}
          size={24}
          style={[styles.text, { fontSize: 28 }]}
        />
      ) : featureName === "Media" ? (
        <Ionicons
          name={"tv-outline"}
          size={24}
          style={[styles.text, { fontSize: 28 }]}
        />
      ) : (
        <FontAwesome
          name={iconName}
          size={24}
          style={[styles.text, { fontSize: 20 }]}
        />
      )}

      <Text style={styles.text}>{featureName}</Text>
    </TouchableOpacity>
  );
};

export default FeatureNavBtn;

const styles = StyleSheet.create({
  wrapper: {
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    padding: 10,
    borderRadius: 10,
    borderColor: Colors.darkSea,
    backgroundColor: Colors.lightSea,
    width: "32%",
    aspectRatio: 1, // Ensures square buttons
    marginBottom: 5,
  },
  text: {
    fontFamily: "MontserratBold",
    fontWeight: "bold",
    fontSize: 16,
    color: Colors.text2,
    textAlign: "center",
  },
  buttonInvisible: {
    backgroundColor: "transparent",
    borderColor: "transparent",
  },
});
