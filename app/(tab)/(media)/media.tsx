import { FlatList, StyleSheet, Text, View } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, useFocusEffect } from "expo-router";
import Header from "@/components/header/Header";
import MediaNavButton from "@/components/Features/Media/MediaNavButton";
import getCustomData from "@/scripts/getCustomData";

// "id": 0,
// "cateogry": "tv",
// "title": "Peace TV",
// "image": "",
// "url": "http://82.114.67.178:8081/hls/PeaceTV.m3"

type mediaItemType = {
  id: string;
  category?: string;
  title?: string;
  image?: string;
  url?: string;
};

const Media = () => {
  const [data, setData] = useState<[] | null>(null);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const { media } = await getCustomData();
        setData(media);
      })();
    }, [])
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header title={"Media"} />
      <FlatList
        data={data}
        renderItem={({ item }: { item: mediaItemType }) => (
          <MediaNavButton
            imageUri={item?.image}
            title={item?.title}
            url={item?.url}
            category={item?.category}
          />
        )}
        keyExtractor={(item, index) => `${index}`}
        contentContainerStyle={{
          rowGap: 10,
          paddingVertical: 10,
          paddingHorizontal: 10,
        }}
      />
    </SafeAreaView>
  );
};

export default Media;

const styles = StyleSheet.create({});
