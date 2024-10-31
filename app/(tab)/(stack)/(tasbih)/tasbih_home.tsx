import {
  Alert,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/header/Header";
import { Button } from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Colors } from "@/constants/Colors";
import {
  deleteTasbih,
  getAllTasbih,
  initializeDB,
  insertTasbih,
} from "@/scripts/tasbihDB";
import { useSQLiteContext } from "expo-sqlite";
interface tasbihListItemType {
  id?: number;
  name: string;
  arabic: string;
  meaning: string;
  type: string;
  count: number;
  reason: string;
  reference: string;
}

const TasbihListItem = ({
  data,
  populer,
  deleteTasbih,
}: {
  data: tasbihListItemType;
  populer: boolean;
  deleteTasbih: (id: number) => void;
}) => {
  const handlePress = () => {
    router.push({
      pathname: "/tasbih_counter",
      params: {
        name: data.name,
        count: data.count,
        arabic: data?.arabic ?? "",
      },
    });
  };
  return (
    <TouchableOpacity
      style={{
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 10,
        backgroundColor: Colors.darkSea,
        marginVertical: 5,
        borderRadius: 5,
        marginHorizontal: 10,
      }}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Text style={{ color: Colors.text2, fontSize: 16 }}>{data.name}</Text>
      {populer && (
        <Text style={{ color: Colors.text2, fontSize: 16 }}>{data.arabic}</Text>
      )}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 5,
        }}
      >
        <Text style={{ color: Colors.text2, fontSize: 16 }}>
          Count: {data.count}
        </Text>

        {!populer ? (
          <TouchableOpacity onPress={() => deleteTasbih(data.id ?? 0)}>
            <FontAwesome name={"trash"} size={24} color={Colors.text2} />
          </TouchableOpacity>
        ) : (
          <View></View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const customApi = require("@/assets/data/customApi.json");

const TasbihCounter = () => {
  const [myTasbihList, setMyTasbihList] = useState<any>([]);
  const [tasbihName, setTasbihName] = useState("");
  const [tasbihLength, setTasbihLength] = useState<string>("");
  const [activeList, setActiveList] = useState("populer"); // Manage active list state
  const [createNewTasbihVisible, setCreateNewTasbihVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const db = useSQLiteContext();

  useEffect(() => {
    getDBinfo();
  }, [activeList]);

  const getDBinfo = async () => {
    db.withTransactionAsync(async () => {
      setLoading(true);
      await initializeDB();
      const data = await getAllTasbih();
      setMyTasbihList(data);
      setTimeout(() => {
        setLoading(false);
      }, 200);
    });
  };

  const handleCreateTasbih = async () => {
    if (tasbihName.length !== 0 && tasbihLength !== "0") {
      setTasbihName("");
      setTasbihLength("");
      insertTasbih({ name: tasbihName, count: parseInt(tasbihLength) });
      setCreateNewTasbihVisible(false);
      if (activeList !== "your") {
        setActiveList("your");
      } else {
        await getDBinfo();
      }
    }
  };

  const handleDeleteTasbih = async (id: number) => {
    console.log(typeof id);

    deleteTasbih(id);
    const updatedTasbihList = myTasbihList.filter(
      (item: any) => item.id !== id
    );
    setMyTasbihList(updatedTasbihList);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header title={"Tasbih Counter"} goBack />
      <TouchableOpacity
        onPress={() => setCreateNewTasbihVisible(!createNewTasbihVisible)}
        activeOpacity={0.9}
        style={{
          position: "absolute",
          width: 80,
          height: 60,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: Colors.text2,
          margin: 10,
          borderRadius: 50,
          bottom: 0,
          zIndex: 10,
          right: 0,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 4,
          elevation: 5,
        }}
      >
        <Ionicons name="add" size={24} color={Colors.darkSea} />
        <Text
          style={{
            textAlign: "center",
            color: Colors.darkSea,
            fontWeight: "600",
          }}
        >
          Create
        </Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={createNewTasbihVisible}
        onRequestClose={() => {
          setCreateNewTasbihVisible(!createNewTasbihVisible);
        }}
      >
        <View
          style={{
            // backgroundColor: "#0000003d",
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              paddingVertical: 20,
              paddingHorizontal: 20,
              borderRadius: 10,
              gap: 5,
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 5,
              justifyContent: "center",
              alignItems: "center",
              width: "80%",
            }}
          >
            <View
              style={{
                justifyContent: "flex-end",
                width: "100%",
              }}
            >
              <View style={{}}>
                <View
                  style={{
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <TextInput
                    style={{
                      paddingHorizontal: 10,
                      paddingVertical: 5,
                      borderWidth: 1,
                      width: "100%",
                      borderRadius: 10,
                      borderColor: Colors.darkSea,
                    }}
                    onChangeText={(text) => setTasbihName(text)}
                    value={tasbihName}
                    placeholder="Name your tasbih"
                  />
                  <TextInput
                    style={{
                      paddingHorizontal: 10,
                      paddingVertical: 5,
                      borderWidth: 1,
                      width: "100%",
                      borderRadius: 10,
                      borderColor: Colors.darkSea,
                    }}
                    onChangeText={(text) => setTasbihLength(text)}
                    value={tasbihLength}
                    keyboardType="numeric"
                    placeholder="0"
                  />
                  <Button
                    title="Create New Tasbih"
                    onPress={handleCreateTasbih}
                    color={Colors.darkSea}
                  />
                  <Button
                    title="Cancel"
                    onPress={() =>
                      setCreateNewTasbihVisible(!createNewTasbihVisible)
                    }
                    color={"red"}
                  />
                </View>
              </View>
            </View>
          </View>
        </View>
      </Modal>
      <View
        style={{
          margin: 10,
        }}
      >
        {/* Toggler Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.button,
              activeList === "populer" && styles.activeButton,
            ]}
            onPress={() => setActiveList("populer")}
          >
            <Text
              style={[
                styles.buttonText,
                activeList === "populer" && styles.activeButtonText,
              ]}
            >
              Populer Tasbih
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              activeList === "your" && styles.activeButton,
            ]}
            onPress={() => setActiveList("your")}
          >
            <Text
              style={[
                styles.buttonText,
                activeList === "your" && styles.activeButtonText,
              ]}
            >
              Your Tasbih
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        style={{
          flex: 1,
        }}
        data={activeList === "populer" ? customApi.dhikr_list : myTasbihList}
        renderItem={({ item }) => (
          <TasbihListItem
            data={item}
            populer={activeList === "populer" ? true : false}
            deleteTasbih={handleDeleteTasbih}
          />
        )}
        keyExtractor={(item, index) => `${index}`}
      />
    </SafeAreaView>
  );
};

export default TasbihCounter;

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    padding: 10,
    // borderRadius: 5,
    backgroundColor: "#cccccc",
    width: "50%",
    alignItems: "center",
  },
  activeButton: {
    backgroundColor: Colors.darkSea,
  },
  buttonText: {
    color: Colors.text1,
    fontWeight: "500",
  },
  activeButtonText: {
    color: Colors.text2,
    fontWeight: "500",
  },
});
