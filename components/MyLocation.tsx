import {
  Button,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "@/constants/Colors";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/rtk/store";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import getCurrentLocation from "@/scripts/getCurrentLocation";
import { setDefalutLocation, setLocation } from "@/rtk/slices/appSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Address {
  street: string | null;
  city: string | null;
  region: string | null;
  postalCode: string | null;
  country: string | null;
}

const MyLocation = ({ locationAlign }: any) => {
  // const { address, errorMsg } = useMyLocation();
  const [locationModalVisible, setLocationModalVisible] = useState(false);
  const dispatch = useDispatch();
  const [selectedLocation, setSelectedLocation] = useState("");

  const { location } = useSelector((state: RootState) => state.app);

  const currentLocation = async () => {
    const location = await getCurrentLocation();
    dispatch(setDefalutLocation(`${location?.city}, ${location?.country}`));
    dispatch(setLocation(`${location?.city}, ${location?.country}`));
  };

  const storeLocation = async (value: string) => {
    try {
      await AsyncStorage.setItem("location", value);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    storeLocation(selectedLocation);
  }, [selectedLocation]);

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <TouchableOpacity
        activeOpacity={0.7}
        style={{ flexDirection: "row", alignItems: "center" }}
        onPress={() => {
          setLocationModalVisible(true);
        }}
      >
        <Ionicons name="location" size={24} color={Colors.text2} />
        <Text
          style={{
            color: Colors.text2,
            fontWeight: "semibold",
            fontFamily: "MontserratSemiBold",
            fontSize: 14,
            textAlign: locationAlign,
          }}
        >
          {location !== null ? location : "fatching..."}
        </Text>
        {/* location change modal */}
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={locationModalVisible}
        onRequestClose={() => {
          setLocationModalVisible(!locationModalVisible);
        }}
      >
        <View
          style={{
            // backgroundColor: "#0000003d",
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              paddingVertical: 20,
              paddingHorizontal: 20,
              borderRadius: 10,
              gap: 5,
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 5,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: Colors.darkSea,
                padding: 10,
                borderRadius: 2,
              }}
              onPress={() => {
                currentLocation();
                setSelectedLocation("");
                setLocationModalVisible(!locationModalVisible);
              }}
            >
              <Text
                style={{
                  color: Colors.text2,
                  fontWeight: "bold",
                }}
              >
                Select Default Location
              </Text>
            </TouchableOpacity>
            <Text
              style={{
                color: Colors.text1,
                fontWeight: "bold",
              }}
            >
              Or
            </Text>
            <View
              style={{
                flexDirection: "row",
                width: "80%",
              }}
            >
              <GooglePlacesAutocomplete
                styles={{
                  textInput: {
                    borderWidth: 1,
                    borderColor: Colors.darkSea,
                    zIndex: 10000,
                  },
                }}
                placeholder="Search location"
                onPress={(data) => {
                  // 'details' is provided when fetchDetails = true
                  setSelectedLocation(data.description);
                  console.log(data.description);
                }}
                query={{
                  key: "",
                  language: "en",
                }}
                fetchDetails={false}
              />
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                width: "80%",
              }}
            >
              <View
                style={{
                  gap: 10,
                  flexDirection: "row",
                }}
              >
                <Button
                  onPress={() => {
                    if (selectedLocation.length !== 0) {
                      dispatch(setLocation(selectedLocation));
                    }
                    setLocationModalVisible(!locationModalVisible);
                  }}
                  title="Save"
                />
                <Button
                  title="Cancel"
                  color={"red"}
                  onPress={() => setLocationModalVisible(!locationModalVisible)}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default MyLocation;

const styles = StyleSheet.create({});
