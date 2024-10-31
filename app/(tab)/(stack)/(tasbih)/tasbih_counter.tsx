import {
  Alert,
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/header/Header";
import { router, useLocalSearchParams } from "expo-router";
import { Colors } from "@/constants/Colors";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";

const TasbihCounter = () => {
  const [counter, setCounter] = useState<number>(0);
  const { name, count, arabic } = useLocalSearchParams<{
    name: string;
    count: string;
    arabic: string;
  }>();

  const reset = () => {
    setCounter(0);
  };

  useEffect(() => {
    const tLength = parseInt(count ?? "0");
    if (counter === tLength) {
      Alert.alert("Congratulation", "You have completed your Tasbih.", [
        {
          text: "Again",
          onPress: () => {
            setCounter(0);
          },
        },
        {
          text: "Exit",
          onPress: () => router.back(),
          style: "cancel",
        },
      ]);
    }
  }, [counter]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header title={"Tasbih Counter"} goBack />
      <View
        style={{
          padding: 10,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#00000019",
          width: "100%",
        }}
      >
        <View
          style={{
            width: "70%",
          }}
        >
          <Text
            style={{
              fontSize: 18,
            }}
          >
            {name}
          </Text>
          <Text
            style={{
              fontSize: 18,
            }}
          >
            {arabic}
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "500",
            }}
          >
            Count: {count}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 10,
            gap: 10,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              setCounter(0);
            }}
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: 4,
              backgroundColor: "red",
              paddingHorizontal: 8,
              borderRadius: 4,
              paddingVertical: 8,
            }}
            activeOpacity={0.7}
          >
            <Ionicons name="reload" size={15} color={"white"} />
            <Text style={{ color: "white", fontWeight: "500" }}>Reset</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          gap: 20,
        }}
      >
        <Text style={{ fontSize: 42, marginBottom: 10 }}>{counter}</Text>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <TouchableOpacity
            onPress={() => {
              setCounter(counter + 1);
            }}
            style={{
              height: 200,
              width: 200,
              backgroundColor: Colors.darkSea,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 100,
            }}
          >
            <Text
              style={{
                fontSize: 24,
                fontWeight: "medium",
                color: Colors.text2,
                textTransform: "capitalize",
              }}
            >
              tap
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default TasbihCounter;

const styles = StyleSheet.create({});
