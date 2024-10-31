import * as Location from "expo-location";

const getCurrentLocation = async () => {
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    console.error("Permission to access location was denied");
    return;
  }
  let location = await Location.getCurrentPositionAsync({});
  let address = await Location.reverseGeocodeAsync({
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
  });

  return address[0];
};

export default getCurrentLocation;
