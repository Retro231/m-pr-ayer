import {
  FlatList,
  ListRenderItemInfo,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/header/Header";
import SectionTitle from "@/components/SectionTitle";
import { Colors } from "@/constants/Colors";
import getCustomData from "@/scripts/getCustomData";
import * as Clipboard from "expo-clipboard";
import Snackbar from "react-native-snackbar";
import { useFocusEffect } from "expo-router";

type Props = {
  name: string;
  arabic: string;
  transliteration: string;
  meaning: string;
  reference: string;
};

const DuaItem = ({ item, index }: ListRenderItemInfo<Props>) => {
  const copyToClipboard = async (string: string) => {
    await Clipboard.setStringAsync(string);
    Snackbar.show({
      text: "Copied to clipboard",
      duration: Snackbar.LENGTH_SHORT,
    });
  };
  return (
    <TouchableOpacity
      activeOpacity={0.5}
      style={{
        borderWidth: 1,
        padding: 5,
        borderRadius: 5,
        backgroundColor: "#ffffff",
        marginBottom: 14,
        borderStyle: "dashed",
      }}
      onLongPress={() => {
        copyToClipboard(
          `${item?.name}: ${item?.arabic} ${item?.meaning} ${item?.reference}`
        );
      }}
    >
      <Text
        style={[
          styles.text,
          {
            padding: 10,
            backgroundColor: "#7d7b7b40",
            fontWeight: "bold",
            color: Colors.darkSea,
          },
        ]}
      >
        {index + 1}. {item.name}
      </Text>
      <View
        style={{
          padding: 10,
        }}
      >
        <Text style={[styles.text]}>{item.transliteration}</Text>
        <Text style={[styles.text]}>{item.arabic}</Text>
        <Text style={[styles.text]}>{item.meaning}</Text>
      </View>
      <Text
        style={[
          styles.text,
          {
            paddingLeft: 10,
          },
        ]}
      >
        - {item.reference}
      </Text>
    </TouchableOpacity>
  );
};

const Dua = (props: Props) => {
  const [data, setData] = useState<any>(null);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const { dua_list } = await getCustomData();
        setData(dua_list);
      })();
    }, [])
  );

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#fff",
      }}
    >
      <Header title={"Dua"} goBack />
      <View
        style={{
          marginHorizontal: 10,
          marginVertical: 5,
          flex: 1,
        }}
      >
        <SectionTitle title={"Populer Dua's:"} />
        {data !== null ? (
          <FlatList
            style={{ flex: 1 }}
            data={data}
            renderItem={DuaItem}
            keyExtractor={(item, index) => `${index}`}
          />
        ) : (
          <Text>Loading..</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Dua;

const styles = StyleSheet.create({
  text: {
    fontSize: 17,
  },
});
