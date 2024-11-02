import DailyDua from "@/components/Features/Dua/DailyDua";
import Header from "@/components/header/Header";
import HeroWrapper from "@/components/Hero/HeroWrapper";
import Loading from "@/components/Loading";
import MyLocation from "@/components/MyLocation";
import FeatureNavBtn from "@/components/navigation/FeatureNavBtn";
import SectionTitle from "@/components/SectionTitle";
import TimerCircle from "@/components/TimerCircle";
import VirtualizedList from "@/components/VirtualizedList";
import { Colors } from "@/constants/Colors";
import { RootState } from "@/rtk/store";
import { useCallback, useEffect, useState } from "react";
import checkDayNight from "@/scripts/checkDayNight";
import getCustomData from "@/scripts/getCustomData";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import OurPost from "@/components/Features/OurPost/OurPost";
import { Ionicons } from "@expo/vector-icons";
import usePrayerInfo from "@/hooks/usePrayerInfo";

export default function HomeScreen() {
  const [features, setFeatures] = useState<any[]>([]);
  const [dayNight, setDayNight] = useState("Day");
  const [prayerInfo, loading, fetchData]: any = usePrayerInfo();
  const { is24HourFormat } = useSelector((state: RootState) => state.app);
  const [ourPosts, setOurPosts] = useState<[] | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [updateMsg, setUpdateMsg] = useState<{
    isActive: boolean;
    info: string;
    url: string;
  } | null>(null);

  // **********
  //The padData function ensures that the total number of items is a multiple of the number of columns (numColumns). If the last row is incomplete, it pads the array with dummy items.
  // ***********
  const padData = (data: any, numColumns: any) => {
    const numberOfFullRows = Math.floor(data.length / numColumns);
    let numberOfElementsLastRow = data.length - numberOfFullRows * numColumns;
    while (
      numberOfElementsLastRow !== numColumns &&
      numberOfElementsLastRow !== 0
    ) {
      data.push({
        id: `blank-${numberOfElementsLastRow}`,
        icon: "",
        text: "",
        empty: true,
      });
      numberOfElementsLastRow++;
    }
    return data;
  };

  useEffect(() => {
    const fajarTime = prayerInfo?.timing[0].time;
    const maghribTime = prayerInfo?.timing[3].time;
    const dayOrNight = checkDayNight(
      fajarTime ?? "06:00 AM",
      maghribTime ?? "06:30 PM"
    );
    setDayNight(dayOrNight);
  });

  useEffect(() => {
    getCustomData();
    const features = require("@/assets/data/featureList.json");
    // console.log(features);
    const data = padData([...features.data], 3);
    setFeatures(data);
  }, []);

  useEffect(() => {
    (async () => {
      const { our_post, software_update_url, notice } = await getCustomData();
      setOurPosts(our_post);
      setUpdateMsg(software_update_url);
      setNotice(notice);
    })();
  }, []);

  // useEffect(() => {
  //   const url = "https://api.quran.com/api/v4/chapters";
  //   const headers = {
  //     Accept: "application/json",
  //   };

  //   fetch(url, { method: "GET", headers: headers })
  //     .then((response) => response.json())
  //     .then((data) => {
  //       console.log(JSON.stringify(data));
  //     })
  //     .catch((error) => {
  //       console.error("Error:", error);
  //     });
  // }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header title={"Home"} />
      <VirtualizedList>
        {/* hero Wrapper */}
        <HeroWrapper style={styles.heroWrapper}>
          <View
            style={{
              alignItems: "center",
            }}
          >
            <View
              style={{
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              {dayNight === "Day" ? (
                <Image
                  style={{
                    width: 90,
                    height: 70,
                    resizeMode: "contain",
                  }}
                  source={require("@/assets/images/day.png")}
                />
              ) : (
                <Image
                  style={{
                    width: 60,
                    height: 60,
                    resizeMode: "contain",
                  }}
                  source={require("@/assets/images/night.png")}
                />
              )}
            </View>
            <View
              style={{
                alignItems: "center",
                gap: 2,
              }}
            >
              <Text
                style={{
                  fontFamily: "MontserratSemiBold",
                  fontWeight: "semibold",
                  fontSize: 24,
                  color: Colors.text2,
                }}
              >
                Today, 7 July
              </Text>
              <Text
                style={{
                  fontFamily: "MontserratMedium",
                  fontWeight: "medium",
                  fontSize: 14,
                  color: Colors.text2,
                }}
              >
                1 Muharram 1446
              </Text>
            </View>
            <MyLocation />
          </View>
          <View
            style={{
              alignItems: "center",
              marginTop: 20,
            }}
          >
            {prayerInfo !== null && (
              <FlatList
                horizontal={true}
                data={prayerInfo?.timing ?? [0]}
                renderItem={({ item }) => (
                  <TimerCircle key={item} title={item.name} time={item.time} />
                )}
                keyExtractor={(item, index) => `${index}`}
                contentContainerStyle={{
                  gap: is24HourFormat ? 20 : 8,
                }}
              />
            )}
          </View>
        </HeroWrapper>
        {/* home content */}
        <View style={styles.mainContentWrapper}>
          {/* update message */}
          {updateMsg?.isActive === true && (
            <TouchableOpacity
              onPress={() => {
                Linking.openURL(updateMsg.url);
              }}
              activeOpacity={0.9}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingHorizontal: 10,
                paddingVertical: 10,
                backgroundColor: "#017777",
                marginTop: 10,
                borderRadius: 10,
                marginRight: 2,
              }}
            >
              <Text style={{ color: Colors.text2, fontWeight: "500" }}>
                {updateMsg?.info}
              </Text>
              <Text style={{ color: "#ffee05", fontWeight: "800" }}>
                Update Now
              </Text>
            </TouchableOpacity>
          )}
          {/* update message */}
          {notice && (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
                paddingHorizontal: 10,
                paddingVertical: 10,
                backgroundColor: "#017777",
                marginTop: 10,
                borderRadius: 10,
                marginRight: 2,
                gap: 5,
              }}
            >
              <Ionicons name="warning" size={16} color={"#fcd706"} />
              <Text style={{ color: Colors.text2, fontWeight: "500" }}>
                {notice}
              </Text>
            </View>
          )}
          {/* our features */}
          <View style={styles.section}>
            <SectionTitle title={"Features"} />
            <FlatList
              numColumns={3}
              horizontal={false}
              columnWrapperStyle={{
                columnGap: 5,
              }}
              data={features}
              renderItem={({ item }) => (
                <FeatureNavBtn
                  iconName={item.icon}
                  featureName={item.name}
                  empty={item?.empty}
                  route={item?.url}
                />
              )}
              keyExtractor={(item) => `${item.id}`}
              contentContainerStyle={{
                alignItems: "center",
                width: "100%",
              }}
            />
          </View>
          {/* daily dua */}
          <DailyDua />
          {/* Our Post */}
          <OurPost data={ourPosts} />
        </View>
      </VirtualizedList>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  heroWrapper: {
    // alignItems: "center",
    gap: 1,
    paddingHorizontal: 8,
  },
  mainContentWrapper: {
    paddingHorizontal: 12,
  },
  section: {
    marginVertical: 10,
  },
});
