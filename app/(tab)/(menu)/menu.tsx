import {
  BackHandler,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/header/Header";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { router, useNavigation } from "expo-router";

const menuitems = [
  {
    id: 1,
    title: "Settings",
    icon: <Ionicons name="settings" size={24} color={Colors.text2} />,
    uri: "/setting",
  },
  {
    id: 2,
    title: "Rate Us",
    icon: <Ionicons name="star" size={24} color={Colors.text2} />,
  },
  {
    id: 3,
    title: "Other's app",
    icon: (
      <Ionicons name="logo-google-playstore" size={24} color={Colors.text2} />
    ),
  },
  {
    id: 4,
    title: "Contact Us",
    icon: <Ionicons name="mail" size={24} color={Colors.text2} />,
  },
  {
    id: 5,
    title: "Privacy Policy",
    icon: <Ionicons name="document" size={24} color={Colors.text2} />,
    uri: "/privacyPolicy",
  },
  {
    id: 6,
    title: "Exit",
    icon: <Ionicons name="exit" size={24} color={Colors.text2} />,
  },
];

type Props = {};

const Menu = (props: Props) => {
  const navigate = useNavigation<any>();
  const handlePress = (title: string) => {
    switch (title) {
      case "Settings":
        router.navigate("/settings");
        break;

      case "Privacy Policy":
        router.navigate("/privacyPolicy");
        break;
      case "Exit":
        BackHandler.exitApp();
        navigate.reset({
          index: 0,
          routes: [{ name: "(stack)" }],
        });
        break;
      default:
        break;
    }
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header title={"Menu"} />
      <FlatList
        data={menuitems}
        renderItem={({ item, index }) => {
          return (
            <TouchableOpacity
              onPress={() => handlePress(item.title)}
              style={{
                paddingHorizontal: 10,
                paddingVertical: 10,
                backgroundColor: Colors.darkSea,
                marginVertical: 5,
                marginHorizontal: 10,
                borderRadius: 10,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  gap: 10,
                  alignItems: "center",
                }}
              >
                {item.icon}
                <Text
                  style={{ fontSize: 18, fontWeight: "bold", color: "white" }}
                >
                  {item.title}
                </Text>
              </View>
              {item.uri && (
                <Ionicons name="arrow-forward" size={24} color={Colors.text2} />
              )}
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
};

export default Menu;

const styles = StyleSheet.create({});
