import { Alert, Button, Image, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import * as FileSystem from "expo-file-system";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/header/Header";
import { Colors } from "@/constants/Colors";
import * as SQLite from "expo-sqlite";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  deleteAllTablesOfQuran,
  initializeDB as intializeQuranDB,
} from "@/scripts/quranDB";
import {
  deleteAllTablesOfTasbih,
  initializeDB as intializeTasbihDB,
} from "@/scripts/tasbihDB";
import loadDatabase from "@/scripts/loadDatabase";

type Props = {};

const storage = (props: Props) => {
  const [totalSize, setTotalSize] = useState<any>(null);
  const [cacheSize, setCacheSize] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);

  // Format size to human-readable format (KB, MB, etc.)
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    else if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    else if (bytes < 1024 * 1024 * 1024)
      return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  };

  // Function to get size of a directory
  const getDirectorySize: any = async (directoryUri: string) => {
    let totalSize = 0;
    try {
      // Read all files in the directory
      const files = await FileSystem.readDirectoryAsync(directoryUri);

      for (const file of files) {
        const fileUri = `${directoryUri}/${file}`;
        // console.log(fileUri);

        const fileInfo: any = await FileSystem.getInfoAsync(fileUri, {
          size: true,
        });

        // If it's a file, add its size
        if (fileInfo.isDirectory === false) {
          totalSize += fileInfo.size || 0;
        }

        // If it's a directory, recursively get its size
        if (fileInfo.isDirectory === true) {
          totalSize += await getDirectorySize(fileUri);
        }
      }
    } catch (error) {
      console.error(`Error reading directory ${directoryUri}:`, error);
    }
    return totalSize;
  };

  // Function to calculate the total app size
  const getAppSize = async () => {
    try {
      // Get sizes of relevant app directories (documents and cache)
      const documentDirSize = await getDirectorySize(
        FileSystem.documentDirectory
      );
      const cacheDirSize = await getDirectorySize(FileSystem.cacheDirectory);

      // Total app size
      const totalSize = documentDirSize + cacheDirSize;

      setUserData(formatSize(documentDirSize));
      setCacheSize(formatSize(cacheDirSize));
      setTotalSize(formatSize(totalSize));

      return 0;
    } catch (error) {
      console.error("Error calculating app size:", error);
      return 0;
    }
  };

  useEffect(() => {
    getAppSize();
  }, []);

  const clearCacheDirectory = async (cacheDirectoryUri: any) => {
    try {
      // Read the cache directory to find all files and subfolders
      const items = await FileSystem.readDirectoryAsync(cacheDirectoryUri);

      // Loop through each item in the cache directory and delete it
      for (const item of items) {
        const itemUri = `${cacheDirectoryUri}${item}`;
        console.log(itemUri);

        await FileSystem.deleteAsync(itemUri, { idempotent: true });
        console.log(`Deleted: ${itemUri}`);
      }
    } catch (error) {
      console.error(
        `Error clearing the cache directory: ${cacheDirectoryUri}/`,
        error
      );
    }
  };

  const clearAppData = async () => {
    try {
      // Step 1: Clear database folder
      await deleteAllTablesOfQuran();
      await deleteAllTablesOfTasbih();
      loadDatabase("quran.db");
      loadDatabase("tasbih.db");
      await intializeQuranDB();
      await intializeTasbihDB();

      AsyncStorage.clear();

      // Step 2: Clear cacheDirectory
      await clearCacheDirectory(FileSystem.cacheDirectory);
      getAppSize();

      Alert.alert(
        "Success",
        "All data in document and cache directories have been cleared."
      );
    } catch (error) {
      console.error("Error clearing app data:", error);
      Alert.alert("Error", "Failed to clear app data.");
    }
  };

  const confirmClearStorage = () => {
    Alert.alert(
      "Clear Storage",
      "Are you sure you want to clear all app data?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "OK", onPress: clearAppData },
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#fff",
      }}
    >
      <Header title={"Storage"} goBack />
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          margin: 10,
          gap: 10,
        }}
      >
        <Image
          style={{
            width: 100,
            height: 100,
          }}
          source={require("@/assets/images/icon.png")}
          width={100}
          height={100}
        />
        <View>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "900",
              color: Colors.darkSea,
            }}
          >
            Muslim's Prayer
          </Text>
          <Text
            style={{
              fontSize: 15,
              fontWeight: "500",
              color: "gray",
            }}
          >
            version: 1.0
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: "gray",
              fontWeight: "500",
            }}
          >
            by Sheakh App Studio
          </Text>
        </View>
      </View>
      <View
        style={{
          borderWidth: 0.5,
          borderColor: "gray",
          marginHorizontal: 20,
        }}
      ></View>
      <View>
        {[
          {
            title: "User Data",
            size: userData ?? "0 B",
          },
          {
            title: "Cache Data",
            size: cacheSize ?? "0 B",
          },
          {
            title: "Total",
            size: totalSize ?? "0 B",
          },
        ].map((item, index) => (
          <View
            key={index}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 20,
              paddingVertical: 10,
              marginVertical: 3,
              borderBottomWidth: 1,
              marginHorizontal: 20,
              borderColor: "gray",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: Colors.darkSea,
              }}
            >
              {item.title}
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: "gray",
                fontWeight: "500",
              }}
            >
              {item.size}
            </Text>
          </View>
        ))}
      </View>
      <View
        style={{
          margin: 20,
        }}
      >
        <Text
          style={{
            fontSize: 14,
            color: "gray",
            fontWeight: "400",
            marginBottom: 10,
          }}
        >
          This will free up storage used by the app. It'll remove your loaded
          Quran data and your created Tasbih.
        </Text>
        <Button
          onPress={confirmClearStorage}
          title="Clear Data"
          color={"#ef4545"}
        />
      </View>
      {/* <Text>Storage:{totalSize} MB</Text> */}
    </SafeAreaView>
  );
};

export default storage;

const styles = StyleSheet.create({});
