import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import getCustomData from "@/scripts/getCustomData";
import { Colors } from "@/constants/Colors";

type ourPostType = {
  id: number;
  title?: string;
  description?: string;
  image?: string;
};

type props = {
  data: [] | null;
};

const OurPost = (props: props) => {
  return (
    <View
      style={{
        flex: 1,
        marginBottom: 10,
        marginTop: 5,
      }}
    >
      <FlatList
        data={props.data}
        renderItem={({ item }: { item: ourPostType }) => (
          <View
            style={{
              backgroundColor: Colors.darkSea,
              marginVertical: 5,
              borderRadius: 10,
            }}
          >
            {item.image && (
              <Image
                source={{ uri: item.image }}
                style={{
                  width: "100%",
                  resizeMode: "cover",
                  borderRadius: 10,
                  borderBottomLeftRadius:
                    item.title || item.description ? 0 : 10,
                  borderBottomRightRadius: item.title ? 0 : 10,
                }}
                width={300}
                height={300}
              />
            )}
            <View
              style={{
                display: !item.title || !item.description ? "none" : "flex",
                gap: 6,
                paddingHorizontal: 10,
                paddingVertical: 10,
              }}
            >
              {item.title && (
                <Text
                  style={{
                    fontWeight: "800",
                    color: Colors.text2,
                  }}
                >
                  {item.title}
                </Text>
              )}
              {item.description && (
                <Text
                  style={{
                    fontWeight: "400",
                    color: Colors.text2,
                  }}
                >
                  {item.description}
                </Text>
              )}
            </View>
          </View>
        )}
        keyExtractor={(item, index) => `${index}`}
        contentContainerStyle={{
          alignItems: "center",
          width: "100%",
        }}
      />
    </View>
  );
};

export default OurPost;

const styles = StyleSheet.create({});
