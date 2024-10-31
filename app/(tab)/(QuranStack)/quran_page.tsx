import {
  ActivityIndicator,
  FlatList,
  ListRenderItemInfo,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Header from "@/components/header/Header";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Loading from "@/components/Loading";
import { getAudioAyahs, getJuzData } from "@/scripts/getQuranData";
import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { Colors } from "@/constants/Colors";
import ReactNativeModal from "react-native-modal";
import { useSQLiteContext } from "expo-sqlite";
import {
  deleteLikedVerse,
  fatchLikedVerses,
  insertChapterInfo,
  insertLikedVerse,
  insertRecentlyRead,
  isJuzInfoExist,
  isSurahInfoExist,
  isTableExist,
} from "@/scripts/quranDB";
import Snackbar from "react-native-snackbar";
// id: item.number,
// name: item.name,
// englishName: item.englishName,
// englishNameTranslation: item.englishNameTranslation,
// numberOfAyahs:item.numberOfAyahs,
// juz_number: item.juz_number,

// ayas{
//   "number": 1,
//   "text": "بِسۡمِ ٱللَّهِ ٱلرَّحۡمَـٰنِ ٱلرَّحِیمِ\n",
//   "numberInSurah": 1,
//   "juz": 1,
//   "manzil": 1,
//   "page": 1,
//   "ruku": 1,
//   "hizbQuarter": 1,
//   "sajda": false
// },

const QuranPage: React.FC = () => {
  const { id, name, englishName, numberOfAyahs, juz_number, jump_ayahNo }: any =
    useLocalSearchParams();
  const [audioAyahList, setAudioAyahList] = useState<any>(null);
  const [engAyahList, setEngAyahList] = useState<any>(null);
  const [arSurahTafsirList, setArSurahTafsirList] = useState<any>(null);
  const [arJuzTafsirList, setArJuzTafsirList] = useState<any>(null);
  const [tafsirText, setTafsirText] = useState<any>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDownloadModalVisible, setDownloadModalVisible] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const soundRef = useRef<any>(null);
  const [firstPlay, setFirstPlay] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<any>(0);
  const [likedVersesList, setLikedVerses] = useState<any>([]);
  const ref = useRef<FlatList>(null);
  const db = useSQLiteContext();

  // all player related --------------------------------------

  // steps-
  // 1. make a sound intence-
  // 2. handle playlist and play one by one
  // 3. handle play pause
  // 4. handle forword backword

  // handle play sound
  const playSound = async () => {
    if (!firstPlay) {
      setFirstPlay(true); //set first play
    }

    if (soundRef.current) {
      await soundRef.current.unloadAsync(); // Unload previous sound
    }

    if (audioAyahList) {
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioAyahList[currentTrackIndex].audio },
        { shouldPlay: true },
        onPlaybackStatusUpdate
      );

      soundRef.current = newSound; // Store the sound in the ref

      // setSound(newSound);
      setIsPlaying(true);
    }
  };

  // give playback status
  const onPlaybackStatusUpdate = (status: any) => {
    setLoading(status.isLoaded);
    if (status.didJustFinish) {
      playNextTrack();
    }
  };

  // play next track automatically
  const playNextTrack = async () => {
    if (currentTrackIndex < audioAyahList.length - 1) {
      setCurrentTrackIndex(currentTrackIndex + 1);
    } else {
      setIsPlaying(false); // Stop playing when all tracks are finished
    }
  };

  // called when currentTrackIndex change
  useEffect(() => {
    if (currentTrackIndex < audioAyahList?.length)
      if (currentTrackIndex > -1) {
        if (firstPlay) {
          playSound();
        }
        ref.current?.scrollToIndex({
          index: currentTrackIndex,
          animated: true,
          viewPosition: 0,
        });
      }
  }, [currentTrackIndex]);

  useEffect(() => {
    if (jump_ayahNo) {
      setTimeout(() => {
        const ayahNo = parseInt(`${jump_ayahNo}`);
        setCurrentTrackIndex(ayahNo - 1);
      }, 100);
    }
  }, [jump_ayahNo]);

  // handle screen unfocused and remove sound from bg
  useFocusEffect(
    useCallback(() => {
      // When the screen is focused,
      return async () => {
        try {
          if (soundRef.current !== null) {
            soundRef.current.stopAsync();
          }
        } catch (error) {
          console.error("Error stopping the sound:", error);
        }
      };
    }, [])
  );

  const handleSingleAyahPress = (item: any) => {
    setCurrentTrackIndex(item.numberInSurah - 1);
    const verseInfo = getVerseInfo(item);
    insertRecentlyRead(verseInfo);
  };

  const handlePlayPause = async () => {
    if (soundRef.current === null) {
      playSound();
    } else {
      const status: any = await soundRef.current.getStatusAsync();
      if (status.isPlaying) {
        await soundRef.current.pauseAsync();
        setIsPlaying(false);
      } else {
        await soundRef.current.playAsync();
        setIsPlaying(true);
      }
    }
  };
  const handleSingleAyahPlayPause = (id: number) => {
    if (currentTrackIndex === id - 1) {
      handlePlayPause();
    }
    setCurrentTrackIndex(id - 1);
    setFirstPlay(true);
  };
  const handlePlayerBackword = () => {
    // console.log(currentTrackIndex !== 0);
    if (currentTrackIndex > 0) {
      setCurrentTrackIndex(currentTrackIndex - 1);
      setFirstPlay(true);
    }
  };
  const handlePlayerForword = () => {
    if (currentTrackIndex === audioAyahList.length - 1) {
      setCurrentTrackIndex(0);
      setFirstPlay(true);
    } else {
      setCurrentTrackIndex(currentTrackIndex + 1);
      setFirstPlay(true);
    }
  };

  // UI controller -------------------------------------

  const handleTafsir = (ayahNo?: any) => {
    if (juz_number) {
      setTafsirText(arJuzTafsirList[ayahNo - 1].text);
    } else {
      setTafsirText(arSurahTafsirList[ayahNo - 1].text);
    }
    setIsModalVisible(true);
  };

  // getting data from api -----------------------------------------------
  useEffect(() => {
    (async () => {
      const tableExit = await isTableExist("ChapterInfo");
      // while storing to db name each surah and juz uniqe name so that it can easily found.
      if (tableExit) {
        // exist
        if (juz_number) {
          const juzInfo: any = await isJuzInfoExist(juz_number);
          if (juzInfo !== null) {
            const data = JSON.parse(juzInfo.data);
            setAudioAyahList(data[0].ayahs);
            setEngAyahList(data[1].ayahs);
            setArJuzTafsirList(data[2].ayahs);
          } else {
            setDownloadModalVisible(true);
          }
        } else {
          const surahInfo: any = await isSurahInfoExist(id);
          if (surahInfo !== null) {
            const data = JSON.parse(surahInfo.data);
            setAudioAyahList(data[0].ayahs);
            setEngAyahList(data[1].ayahs);
            setArSurahTafsirList(data[2].ayahs);
          } else {
            setDownloadModalVisible(true);
          }
        }
      }
    })();
  }, []);

  // ------------ fetch liked verse from db;

  const getLikedVerse = async () => {
    const data = await fatchLikedVerses();
    setLikedVerses(data);
  };

  useEffect(() => {
    getLikedVerse();
  }, []);

  const checkIfExists = (array: any, obj: any) => {
    let found = false;
    array.forEach((element: any) => {
      if (
        element.surahNo === parseInt(obj.surahNo) &&
        element.ayahNo === obj.ayahNo
      ) {
        found = true;
      }
    });
    return found;
  };

  const getVerseInfo = (item: any) => {
    if (!juz_number) {
      return {
        name,
        englishName,
        surahNo: id,
        ayahNo: item.numberInSurah,
      };
    } else {
      return {
        name: item.surah.name,
        englishName: item.surah.englishName,
        surahNo: item.surah.number,
        ayahNo: item.numberInSurah,
      };
    }
  };

  const handleLikedVerse = async (item: any) => {
    const verseInfo = getVerseInfo(item);
    db.withTransactionAsync(async () => {
      await insertLikedVerse(verseInfo);
      await getLikedVerse();
    });
    Snackbar.show({
      text: "Verse Saved!",
      duration: Snackbar.LENGTH_SHORT,
    });
  };

  const handleRemoveLikedVerse = async (item: any) => {
    const verseInfo = getVerseInfo(item);
    db.withTransactionAsync(async () => {
      await deleteLikedVerse(verseInfo);
      await getLikedVerse();
    });
    Snackbar.show({
      text: "Verse Removed!",
      duration: Snackbar.LENGTH_SHORT,
    });
  };
  const renderAyahItem = ({ item, index }: ListRenderItemInfo<any>) => {
    return <MyListItem item={item} index={index} />;
  };

  const MyListItem = React.memo(
    ({ item, index }: { item: any; index: number }) => {
      const [isLiked, setIsLiked] = useState(false);
      React.useEffect(() => {
        const verseInfo = getVerseInfo(item);
        const result = checkIfExists(likedVersesList, verseInfo);
        setIsLiked(result);
      }, [item]);
      return (
        <TouchableOpacity
          style={[styles.ayahContainer]}
          onPress={() => handleSingleAyahPress(item)}
        >
          <View
            style={{
              borderWidth: 1,
              padding: 2,
              borderStyle: "dotted",
              borderRadius: 10,
              backgroundColor: `${
                currentTrackIndex === index ? "#01777736" : "#ffff"
              }`,
            }}
          >
            <Text style={styles.ayahArabic}>{item.text}</Text>
            <Text style={styles.ayahEnglish}>
              {juz_number
                ? `${engAyahList[index]?.text}`
                : `${engAyahList[item.numberInSurah - 1]?.text}`}
            </Text>
          </View>

          <View style={styles.ayahAction}>
            <Text style={styles.pageCount}>
              {!juz_number
                ? `${item.numberInSurah} : ${numberOfAyahs}`
                : `${item.number}`}
            </Text>
            <TouchableOpacity onPress={() => handleTafsir(item.number)}>
              <Ionicons
                style={styles.ayahIcons}
                name="document-text"
                size={24}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                handleSingleAyahPlayPause(item.numberInSurah);
              }}
            >
              <Ionicons
                style={styles.ayahIcons}
                name={`${
                  currentTrackIndex === item.numberInSurah - 1 && isPlaying
                    ? "pause"
                    : "play"
                }`}
                size={24}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                isLiked ? handleRemoveLikedVerse(item) : handleLikedVerse(item);
              }}
            >
              <Ionicons
                style={[
                  styles.ayahIcons,
                  { color: `${isLiked ? "#ff4848" : "#017777"}` },
                ]}
                name="heart"
                size={24}
                color={"#017777"}
              />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      );
    },
    (prevProps, nextProps) => {
      // Custom comparison logic here
      return (
        prevProps.item === nextProps.item && prevProps.index === nextProps.index
      );
    }
  );
  return (
    <SafeAreaView
      style={{
        flex: 1,
        overflow: "hidden",
        position: "relative",
        backgroundColor: "#ffffff",
      }}
    >
      {/* -----------------header-------------------- */}
      <Header
        title={juz_number ? `Juz : ${juz_number}` : `${englishName} | ${name}`}
        goBack
      />
      {/* -----------------single ayah-------------------- */}

      {audioAyahList !== null && engAyahList !== null ? (
        <FlatList
          ref={ref}
          data={audioAyahList}
          initialNumToRender={parseInt(jump_ayahNo ? jump_ayahNo : 0)}
          keyExtractor={(item: any, index: any) => `${index}`}
          renderItem={renderAyahItem}
          ListFooterComponent={
            <View
              style={{
                height: 70,
                backgroundColor: "#ffffff",
              }}
            ></View>
          }
          onScrollToIndexFailed={({ index }) => {
            // ref.current?.scrollToOffset({
            //   offset: currentTrackIndex,
            //   animated: true,
            // });
            const wait = new Promise((resolve) => setTimeout(resolve, 100));
            wait.then(() => {
              ref.current?.scrollToIndex({
                index: currentTrackIndex,
                animated: true,
                viewPosition: 0,
              });
            });
          }}
        />
      ) : (
        <Loading />
      )}
      {/* -----------------player-------------------- */}

      <View style={styles.playerContainer}>
        <Ionicons
          style={[
            styles.playerBackwordforword,
            {
              backgroundColor: `${loading ? "white" : "#dfdbdb"}`,
              color: `${loading ? "gray" : "#817979"}`,
            },
          ]}
          disabled={!loading && !firstPlay ? true : false}
          size={24}
          name="play-skip-back-outline"
          onPress={handlePlayerBackword}
        />
        {!loading && firstPlay ? (
          <View
            style={[
              styles.playerBackwordforword,
              {
                borderRadius: 5,
                justifyContent: "center",
                alignItems: "center",
              },
            ]}
          >
            <ActivityIndicator size={24} />
          </View>
        ) : (
          <Ionicons
            style={[
              styles.playerBackwordforword,
              {
                borderRadius: 5,
              },
            ]}
            name={isPlaying ? "pause" : "play-outline"}
            size={24}
            onPress={handlePlayPause}
          />
        )}

        <Ionicons
          style={[
            styles.playerBackwordforword,
            {
              backgroundColor: `${loading ? "white" : "#dfdbdb"}`,
              color: `${loading ? "gray" : "#817979"}`,
            },
          ]}
          name="play-skip-forward-outline"
          size={24}
          disabled={!loading && firstPlay ? true : false}
          onPress={handlePlayerForword}
        />
      </View>

      {/* tafsir modal */}
      <ReactNativeModal
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
        isVisible={isModalVisible}
        onBackdropPress={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <ScrollView>
            <View>
              <Text style={styles.modalTitle}>Tafsir: ( تفسير الجلالين )</Text>
              {tafsirText !== null ? (
                <Text style={styles.modalTafsir}>
                  {tafsirText !== null && tafsirText}
                </Text>
              ) : (
                <Loading />
              )}
            </View>
            <View style={styles.modalCloseContainer}>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <Text style={styles.modalClose}>Close</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </ReactNativeModal>

      {/* download modal */}
      <ReactNativeModal
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
        isVisible={isDownloadModalVisible}
      >
        <View style={styles.modalContainer}>
          <View
            style={{
              alignItems: "center",
              gap: 10,
            }}
          >
            {!downloading && (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  width: "90%",
                  gap: 5,
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 15,
                  }}
                >
                  Press 'continue' to load required data!
                </Text>
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 15,
                  }}
                >
                  Please check internet connection before continue.
                </Text>
              </View>
            )}
            {downloading && (
              <View
                style={{
                  justifyContent: "center",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <ActivityIndicator size={24} color={Colors.text1} />
                <Text
                  style={{
                    textAlign: "center",
                  }}
                >
                  Loading...
                </Text>
              </View>
            )}
            <View style={styles.modalCloseContainer}>
              <TouchableOpacity
                style={{
                  width: "50%",
                  display: downloading ? "none" : "flex",
                }}
                onPress={() => {
                  setDownloadModalVisible(false);
                  setDownloading(false);
                  if (router.canGoBack()) {
                    router.back();
                  }
                }}
              >
                <Text style={styles.modalClose}>Later</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  display: downloading ? "none" : "flex",
                  width: "50%",
                }}
                onPress={() => {
                  if (juz_number) {
                    (async () => {
                      setDownloading(true);
                      const juzData = await getJuzData(juz_number);
                      await insertChapterInfo("juz", juzData, id, juz_number);
                      setDownloading(false);
                      setDownloadModalVisible(false);
                      setAudioAyahList(juzData[0].ayahs);
                      setEngAyahList(juzData[1].ayahs);
                      setArJuzTafsirList(juzData[2].ayahs);
                    })();
                  } else {
                    (async () => {
                      setDownloading(true);
                      const audioAyah = await getAudioAyahs(id);
                      await insertChapterInfo(
                        "surah",
                        audioAyah,
                        id,
                        juz_number
                      );
                      setDownloading(false);
                      setDownloadModalVisible(false);

                      setAudioAyahList(audioAyah[0].ayahs);
                      setEngAyahList(audioAyah[1].ayahs);
                      setArSurahTafsirList(audioAyah[2].ayahs);
                    })();
                  }
                }}
              >
                <Text style={styles.modalClose}>continue</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ReactNativeModal>
    </SafeAreaView>
  );
};

export default QuranPage;

const styles = StyleSheet.create({
  playerContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    gap: 50,
    padding: 10,
    backgroundColor: Colors.lightSea,
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 50,
    marginHorizontal: 50,
    marginBottom: 10,
  },
  playerBackwordforword: {
    backgroundColor: "white",
    padding: 5,
    borderRadius: 50,
  },
  playerPlayPause: {
    width: 25,
    height: 25,
    backgroundColor: "white",
    padding: 5,
  },
  ayahContainer: {
    flex: 1,
    // backgroundColor: "#DAF9FF",
    // backgroundColor: "gray",
    // borderBottomColor: "#000",
    // borderWidth: 1,
    marginHorizontal: 5,
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
  },
  ayahArabic: {
    fontSize: 28,
    color: "#000",
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  ayahEnglish: {
    fontFamily: "MontserratMedium",
    fontWeight: "medium",
    fontSize: 16,
    margin: 10,
  },
  ayahAction: {
    flexDirection: "row",
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#01777753",
    borderRadius: 15,
    marginTop: 4,
  },
  ayahIcons: {
    color: "#017777",
    padding: 3,
    borderRadius: 15,
    fontSize: 26,
  },
  pageCount: {
    color: "#017777",
    fontFamily: "MontserratSemiBold",
    fontWeight: "semibold",
    fontSize: 16,
  },
  modalContainer: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
    gap: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  modalTitle: {
    fontFamily: "MontserratSemiBold",
    fontWeight: "semibold",
    fontSize: 18,
    textAlign: "center",
    textTransform: "capitalize",
  },
  modalTafsir: {
    fontFamily: "MontserratSemiBold",
    fontWeight: "semibold",
    fontSize: 18,
    textAlign: "center",
    borderWidth: 1,
    padding: 10,
    margin: 10,
    borderStyle: "dotted",
  },
  modalCloseContainer: {
    flexDirection: "row",
    marginTop: 0,
    width: "100%",
    gap: 5,
    justifyContent: "center",
  },
  modalClose: {
    fontFamily: "MontserratSemiBold",
    fontWeight: "semibold",
    backgroundColor: Colors.darkSea,
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 5,
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
  },
});
