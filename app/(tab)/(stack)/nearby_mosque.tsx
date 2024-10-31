import {
  FlatList,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import Header from "@/components/header/Header";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import Loading from "@/components/Loading";
import { RootState } from "@/rtk/store";
import { useSelector } from "react-redux";
type Props = {};

const NearByMosque = (props: Props) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const location = useSelector((state: RootState) => state.app.location);

  const openGoogleMaps = (placeName: string, address: string | null) => {
    const query = `${placeName} ${address}`;

    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      query
    )}`;
    Linking.openURL(url).catch((err) =>
      console.error("Couldn't load page", err)
    );
  };

  async function fetchMosques() {
    try {
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: "",
        },
      };

      const response = await fetch(
        `https://api.foursquare.com/v3/places/search?query=mosque&near=${location}`,
        options
      );

      if (!response.ok) {
        setLoading(false);
      }

      const data = await response.json();
      setData(data.results);
      console.log(data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    setLoading(true);
    if (location !== null) {
      (async () => {
        await fetchMosques();
        setLoading(false);
      })();
    }
  }, [location]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <Header title={"Nearby Mosque"} goBack />

      {loading ? (
        <Loading />
      ) : (
        <FlatList
          data={data}
          renderItem={({ item, index }: { item: any; index: any }) => (
            <View
              key={index}
              style={{
                backgroundColor: Colors.darkSea,
                paddingVertical: 10,
                paddingHorizontal: 20,
                margin: 4,
                flexDirection: "row",
                alignItems: "center",
                borderRadius: 15,
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <FontAwesome5 size={24} name="mosque" color={Colors.text2} />
                <View
                  style={{
                    width: "80%",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: "bold",
                      color: Colors.text2,
                    }}
                  >
                    {item.name}
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "light",
                      color: Colors.text2,
                    }}
                  >
                    Distance: {(item.distance / 1000).toFixed(2)} km
                  </Text>
                </View>
              </View>
              {location !== null && (
                <TouchableOpacity
                  onPress={() => openGoogleMaps(item.name, location)}
                >
                  <FontAwesome5
                    size={18}
                    name="location-arrow"
                    color={Colors.text2}
                  />
                </TouchableOpacity>
              )}
            </View>
          )}
          keyExtractor={(item, index) => `${index}`}
          ListFooterComponent={() => (
            <Text style={{ textAlign: "center", padding: 10, color: "gray" }}>
              {data?.length !== 0
                ? "Information collected from Foursquare."
                : "No information found!"}
            </Text>
          )}
        />
      )}
    </SafeAreaView>
  );
};

export default NearByMosque;

const styles = StyleSheet.create({});
