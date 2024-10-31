import { FlatList, StyleSheet, Text, View } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/header/Header";
import HeroWrapper from "@/components/Hero/HeroWrapper";
import HeroStatus from "@/components/Hero/HeroStatus";
import HeroSmallDate from "@/components/Hero/HeroSmallDate";
import { Colors } from "@/constants/Colors";
import PrayerTimerBox from "@/components/Features/PrayerTimer/PrayerTimerBox";
import usePrayerInfo from "@/hooks/usePrayerInfo";
import { useFocusEffect } from "expo-router";
import { useSelector } from "react-redux";
import { RootState } from "@/rtk/store";
import Loading from "@/components/Loading";

const PrayerTimerScreen = () => {
  const [prayerInfo, loading, fetchData]: any = usePrayerInfo();
  const {
    location,
    defaultLocation,
    is24HourFormat,
    prayerTimeConventions,
    menualCorrections,
    juristicMethod,
  } = useSelector((state: RootState) => state.app);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [
      location,
      defaultLocation,
      is24HourFormat,
      prayerTimeConventions,
      menualCorrections,
      juristicMethod,
    ])
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header title={"Prayer Timer"} />
      {/* hero */}
      <HeroWrapper style={{ gap: 10, paddingBottom: 20, paddingTop: 20 }}>
        <View style={styles.heroTop}>
          <HeroStatus
            style={{
              alignItems: "flex-start",
              gap: 1,
              marginLeft: 1,
            }}
            title={"Next"}
            info={prayerInfo?.upcomingPrayer.name ?? ""}
            time={prayerInfo?.upcomingPrayer.time ?? ""}
          />
          <HeroSmallDate
            style={{
              alignItems: "flex-end",
            }}
            eng={prayerInfo?.date ?? ""}
            arabic={prayerInfo?.hijri ?? ""}
          />
        </View>
      </HeroWrapper>
      {/* main content */}

      <View
        style={{
          paddingHorizontal: 10,
          paddingVertical: 10,
          flex: 1,
        }}
      >
        {!loading && (
          <FlatList
            data={prayerInfo?.timing}
            renderItem={({ item, index }) => {
              return (
                <PrayerTimerBox
                  time={item.time}
                  title={item.name}
                  id={index}
                  active={prayerInfo?.upcomingPrayer.name === item.name}
                />
              );
            }}
            keyExtractor={(item, index) => `${index}`}
            contentContainerStyle={{
              gap: 10,
            }}
          />
        )}
        {loading && <Loading />}
      </View>
    </SafeAreaView>
  );
};

export default PrayerTimerScreen;

const styles = StyleSheet.create({
  heroTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
});
