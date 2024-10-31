import * as Font from "expo-font";

const useFonts = async () =>
  await Font.loadAsync({
    MontserratBold: require("../assets/fonts/Montserrat-Bold.ttf"),
    MontserratMedium: require("../assets/fonts/Montserrat-Medium.ttf"),
    MontserratRegular: require("../assets/fonts/Montserrat-Regular.ttf"),
    MontserratSemiBold: require("../assets/fonts/Montserrat-SemiBold.ttf"),
  });

export default useFonts;
