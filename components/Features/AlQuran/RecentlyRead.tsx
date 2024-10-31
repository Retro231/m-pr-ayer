import { Dimensions, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Colors } from "@/constants/Colors";
import { TouchableOpacity } from "react-native-gesture-handler";
import { router } from "expo-router";
import { getAyahs } from "@/scripts/getQuranData";

const RecentlyRead = ({ data }: { data: any }) => {
  const [info, setInfo] = useState<any>([]);
  useEffect(() => {
    (async () => {
      const info = await getAyahs(data?.surahNo);
      setInfo(info);
    })();
  }, [data]);
  const handlePress = async () => {
    router.push({
      pathname: "/(QuranStack)/quran_page",
      params: {
        id: info.number,
        name: info.name,
        englishName: info.englishName,
        englishNameTranslation: info.englishNameTranslation,
        numberOfAyahs: info.numberOfAyahs,
        jump_ayahNo: data.ayahNo,
      },
    });
  };
  return (
    <View
      style={{
        width: Dimensions.get("screen").width,
        gap: 5,
        flexDirection: "row",
        marginHorizontal: 16,
      }}
    >
      <Text style={styles.text}>Recently Read:</Text>
      {data ? (
        <TouchableOpacity onPress={handlePress}>
          <Text
            style={[
              styles.text,
              { textDecorationLine: "underline", cursor: "pointer" },
            ]}
          >
            {data?.englishName} - {data?.ayahNo}: {info?.numberOfAyahs}
          </Text>
        </TouchableOpacity>
      ) : (
        ""
      )}
    </View>
  );
};

export default RecentlyRead;

const styles = StyleSheet.create({
  text: {
    fontFamily: "MontserratMedium",
    fontWeight: "medium",
    fontSize: 14,
    color: Colors.text2,
  },
});
