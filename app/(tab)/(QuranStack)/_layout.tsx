import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import * as FileSystem from "expo-file-system";
import { Asset } from "expo-asset";
import { Suspense, useEffect, useState } from "react";
import Loading from "@/components/Loading";
import { View } from "react-native";
import loadDatabase from "@/scripts/loadDatabase";

export default function StackLayout() {
  const [dbLoaded, setDbLoaded] = useState<boolean>(false);

  useEffect(() => {
    loadDatabase("quran.db")
      .then(() => {
        setDbLoaded(true);
      })
      .catch((e) => console.log(e));
  }, []);

  return (
    <Suspense
      fallback={
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Loading></Loading>
        </View>
      }
    >
      <SQLiteProvider databaseName="quran.db" useSuspense>
        <Stack>
          <Stack.Screen name="al_quran" options={{ headerShown: false }} />
          <Stack.Screen name="quran_page" options={{ headerShown: false }} />
        </Stack>
      </SQLiteProvider>
    </Suspense>
  );
}
