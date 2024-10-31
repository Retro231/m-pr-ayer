import Loading from "@/components/Loading";
import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import { Suspense, useEffect, useState } from "react";
import { View } from "react-native";
import loadDatabse from "@/scripts/loadDatabase";
import { initializeDB } from "@/scripts/tasbihDB";

export default function TasbihLayout() {
  const [dbLoaded, setDbLoaded] = useState<boolean>(false);

  useEffect(() => {
    loadDatabse("tasbih.db")
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
      <SQLiteProvider databaseName="tasbih.db" useSuspense>
        <Stack>
          <Stack.Screen
            name="tasbih_counter"
            options={{ headerShown: false }}
          />
          <Stack.Screen name="tasbih_home" options={{ headerShown: false }} />
        </Stack>
      </SQLiteProvider>
    </Suspense>
  );
}
