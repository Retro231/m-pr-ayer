import { Button, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import Header from "@/components/header/Header";
import { SafeAreaView } from "react-native-safe-area-context";
import HeroWrapper from "@/components/Hero/HeroWrapper";
import HeroStatus from "@/components/Hero/HeroStatus";
import HeroSmallDate from "@/components/Hero/HeroSmallDate";
import { Colors } from "@/constants/Colors";
import usePrayerInfo from "@/hooks/usePrayerInfo";
import CompassDevice from "@/components/Features/compass/CompassDevice";

const CompassScreen: React.FC = () => {
  const [prayerInfo]: any = usePrayerInfo();
  const [qiblaDirection, setQiblaDirection] = useState(0);
  const [qiblaDistance, setQiblaDistance] = useState(0);
  const [qiblaCardinalDirection, setQiblaCardinalDirection] = useState("");

  const getCompassInfo = (info: any) => {
    const { qiblaDirection, qiblaDistance, qiblaCardinalDirection } = info;
    setQiblaDirection(qiblaDirection);
    setQiblaDistance(qiblaDistance);
    setQiblaCardinalDirection(qiblaCardinalDirection);
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header title={"Compass"} goBack />
      <HeroWrapper style={{ gap: 10, paddingBottom: 20, paddingTop: 20 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <View style={{ alignItems: "flex-start", gap: 20, width: "30%" }}>
            <HeroStatus
              title={"Your Kibla"}
              info={qiblaCardinalDirection ?? "..."}
            />
          </View>
          <HeroSmallDate
            eng={prayerInfo?.date ?? "..."}
            arabic={prayerInfo?.hijri ?? "..."}
            style={{ alignItems: "flex-end", width: "50%" }}
          />
        </View>
        <View
          style={{ justifyContent: "center", alignItems: "center", gap: 5 }}
        >
          <Text
            style={{
              fontFamily: "MontserratBold",
              fontWeight: "bold",
              fontSize: 24,
              color: Colors.text2,
            }}
          >
            Qibla Direction: {qiblaDirection.toFixed(2)}°
          </Text>
          <Text
            style={{
              fontFamily: "MontserratBold",
              fontWeight: "bold",
              fontSize: 16,
              color: Colors.text2,
            }}
          >
            Distance to Qibla: {qiblaDistance.toFixed(0)} km
          </Text>
        </View>
      </HeroWrapper>

      <CompassDevice getInfo={getCompassInfo} />
    </SafeAreaView>
  );
};

export default CompassScreen;

const styles = StyleSheet.create({});
