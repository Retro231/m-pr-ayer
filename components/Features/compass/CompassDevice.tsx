import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
// import { Magnetometer } from "react-native-sensors";
// import Geolocation from "@react-native-community/geolocation";
import * as Location from "expo-location";
import { Magnetometer } from "expo-sensors";
import Loading from "@/components/Loading";

interface propsType {
  getInfo: Function;
}

const CompassDevice: React.FC<propsType> = ({ getInfo }) => {
  const [magnetometer, setMagnetometer] = useState(0);
  const [qiblaDirection, setQiblaDirection] = useState(0);
  const [qiblaDistance, setQiblaDistance] = useState(0);
  const [qiblaCardinalDirection, setQiblaCardinalDirection] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getInfo({ qiblaDirection, qiblaDistance, qiblaCardinalDirection });
  }, [qiblaDirection, qiblaDistance, qiblaCardinalDirection]);

  useEffect(() => {
    // Get the device's current location to calculate Qibla direction
    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.error("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      const qibla = calculateQibla(latitude, longitude);
      setQiblaDirection(qibla);

      const distance = calculateDistance(latitude, longitude, 21.4225, 39.8262);
      setQiblaDistance(distance);

      const cardinalDirection = getCardinalDirection(qibla);
      setQiblaCardinalDirection(cardinalDirection);
      setLoading(false);
    };

    getLocation();

    // Subscribe to magnetometer data
    const subscription = Magnetometer.addListener((data) => {
      const { x, y } = data;
      const angle = Math.atan2(y, x) * (180 / Math.PI);
      setMagnetometer(Math.round(angle));
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const calculateQibla = (latitude: any, longitude: any) => {
    const meccaLat = 21.4225;
    const meccaLon = 39.8262;
    const phiK = (meccaLat * Math.PI) / 180.0;
    const lambdaK = (meccaLon * Math.PI) / 180.0;
    const phi = (latitude * Math.PI) / 180.0;
    const lambda = (longitude * Math.PI) / 180.0;

    const qibla =
      (180 / Math.PI) *
      Math.atan2(
        Math.sin(lambdaK - lambda),
        Math.cos(phi) * Math.tan(phiK) -
          Math.sin(phi) * Math.cos(lambdaK - lambda)
      );
    return (qibla + 360) % 360;
  };

  const getRotationDegree = () => {
    return 360 - (magnetometer - qiblaDirection);
  };

  const calculateDistance = (lat1: any, lon1: any, lat2: any, lon2: any) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180.0;
    const dLon = ((lon2 - lon1) * Math.PI) / 180.0;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180.0) *
        Math.cos((lat2 * Math.PI) / 180.0) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  };

  const getCardinalDirection = (angle: number) => {
    const directions = [
      "N",
      "NNE",
      "NE",
      "ENE",
      "E",
      "ESE",
      "SE",
      "SSE",
      "S",
      "SSW",
      "SW",
      "WSW",
      "W",
      "WNW",
      "NW",
      "NNW",
    ];
    const directionFullForms = [
      "North",
      "North-Northeast",
      "Northeast",
      "East-Northeast",
      "East",
      "East-Southeast",
      "Southeast",
      "South-Southeast",
      "South",
      "South-Southwest",
      "Southwest",
      "West-Southwest",
      "West",
      "West-Northwest",
      "Northwest",
      "North-Northwest",
    ];
    const index = Math.round(angle / 22.5) % 16;
    return directions[index];
    // return directionFullForms[index];
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Loading />
      </View>
    );
  }

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: "#fff",
      }}
    >
      <View style={styles.container}>
        <View style={styles.compassContainer}>
          <Image
            source={require("../../../assets/images/compass.png")} // Add your compass image path here
            style={[styles.compass]}
          />
          <Image
            source={require("../../../assets/images/kaaba.png")} // Add your compass image path here
            style={[
              styles.kaaba,
              { transform: [{ rotate: `${getRotationDegree()}deg` }] },
            ]}
          />
          <Text
            style={{
              textAlign: "center",
              width: "70%",
              fontSize: 16,
              color: "#313131",
            }}
          >
            Place mobile device horizontally, on a flat surface.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default CompassDevice;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  compassContainer: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").width,
    justifyContent: "center",
    alignItems: "center",
  },
  compass: {
    position: "relative",
    width: 300,
    height: 300,
  },
  kaaba: {
    position: "absolute",
    width: 300,
    height: 300,
  },
});
