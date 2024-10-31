import {
  FlatList,
  ListRenderItemInfo,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/header/Header";
import HeroWrapper from "@/components/Hero/HeroWrapper";
import SearchBar from "@/components/Features/AlQuran/SearchBar";
import RecentlyRead from "@/components/Features/AlQuran/RecentlyRead";
import { FontAwesome } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import ListItem from "@/components/Features/AlQuran/ListItem";
import { router, useFocusEffect } from "expo-router";
import Loading from "@/components/Loading";
import { useSQLiteContext } from "expo-sqlite";
import {
  initializeDB,
  filterChapters,
  filterSurahList,
  filterJuzList,
  filterBookmark,
  toggleBookmark,
  fatchLikedVerses,
  deleteLikedVerse,
  fatchRecentlyRead,
} from "@/scripts/quranDB";
import LikedVerseItem from "@/components/Features/AlQuran/LikedVerseItem";
import { getAyahs } from "@/scripts/getQuranData";

// "number": 1,
// "name": "سُورَةُ ٱلْفَاتِحَةِ",
// "englishName": "Al-Faatiha",
// "englishNameTranslation": "The Opening",
// "numberOfAyahs": 7,
// "revelationType": "Meccan"

interface Item {
  id: number;
  surah_number: number;
  surah_name: string;
  surah_englishName: string;
  surah_englishNameTranslation: string;
  surah_numberOfAyahs: number;
  isBookmarked: number;
}

interface JuzItem extends Item {
  juz_number: number;
  juz_verse_mapping: string;
  juz_first_verse_id: number;
  juz_last_verse_id: number;
  juz_verses_count: number;
}

interface likedVerse {
  id?: number;
  name?: string;
  englishName?: string;
  surahNo?: number;
  ayahNo?: number;
}

const menuItem = [
  {
    id: 1,
    name: "Surah",
  },
  {
    id: 2,
    name: "Juz",
  },
  {
    id: 3,
    name: "Bookmarks",
  },
  {
    id: 4,
    name: "Liked Verses",
  },
];

const AlQuranScreen: React.FC = () => {
  const [active, setActive] = useState("Surah");
  const [filteredList, setFilteredList] = useState<any>(null);
  const [surahList, setSurahList] = useState<any>(null);
  const [juzList, setJuzList] = useState<any>(null);
  const [bookmarks, setBookmarks] = useState<any>(null);
  const [likedVerses, setLikedVerses] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [recentlyRead, setRecently] = useState({});
  const [filteredText, setFilteredText] = useState("");

  const db = useSQLiteContext();

  useEffect(() => {
    getDBinfo();
    switch (active) {
      case "Surah":
        setFilteredList(surahList);
      case "Juz":
        setFilteredList(juzList);
      case "Bookmarks":
        setFilteredList(bookmarks);
      case "Liked Verses":
        setFilteredList(likedVerses);
    }
  }, [active]);

  const handleSearchTextChange = (text: string) => {
    setFilteredText(text);
  };

  useEffect(() => {
    if (filteredText === "") {
      switch (active) {
        case "Surah":
          setSurahList(surahList);
        case "Juz":
          setJuzList(juzList);
        case "Bookmarks":
          setBookmarks(bookmarks);
        case "Liked Verses":
          setLikedVerses(likedVerses);
      }
    } else {
      switch (active) {
        case "Surah":
          setFilteredList(
            surahList.filter(
              (item: any) =>
                item.surah_englishName
                  .toLowerCase()
                  .includes(filteredText.toLowerCase()) // Adjust based on your item structure
            )
          );
          break;
        case "Juz":
          setFilteredList(
            juzList.filter(
              (item: any) => item.juz_number === parseInt(filteredText) // Adjust based on your item structure
            )
          );
          break;

        case "Bookmarks":
          setFilteredList(
            bookmarks.filter(
              (item: any) =>
                item?.juz_number === parseInt(filteredText) ||
                item.surah_englishName
                  ?.toLowerCase()
                  .includes(filteredText.toLowerCase()) // Adjust based on your item structure
            )
          );
          break;

        case "Liked Verses":
          setFilteredList(
            likedVerses.filter(
              (item: any) =>
                item.englishName
                  ?.toLowerCase()
                  .includes(filteredText.toLowerCase()) // Adjust based on your item structure
            )
          );
          break;
      }
    }
  }, [filteredText]);

  // handle screen unfocused and remove sound from bg
  useFocusEffect(
    useCallback(() => {
      // When the screen is focused,
      (async () => {
        const data = await fatchRecentlyRead();
        setRecently(data[0]);
      })();

      return;
    }, [])
  );

  const getDBinfo = async () => {
    db.withTransactionAsync(async () => {
      setLoading(true);
      await initializeDB();
      const sl = await filterSurahList();
      const jl = await filterJuzList();
      const bl = await filterBookmark();
      const likedVerseslist = await fatchLikedVerses();
      setSurahList(sl);
      setJuzList(jl);
      setBookmarks(bl);
      setLikedVerses(likedVerseslist);
      setTimeout(() => {
        setLoading(false);
      }, 200);
    });
  };

  // -----------flatlist surah item -------------------
  const renderSurahItem = ({ item }: ListRenderItemInfo<JuzItem>) => {
    const handlePress = () => {
      router.push({
        pathname: "/(QuranStack)/quran_page",
        params: {
          id: item.surah_number,
          name: item.surah_name,
          englishName: item.surah_englishName,
          englishNameTranslation: item.surah_englishNameTranslation,
          numberOfAyahs: item.surah_numberOfAyahs,
        },
      });
    };

    const handleBookmarkPress = async () => {
      console.log(item.id);

      await toggleBookmark(item.id);
      if (item.isBookmarked !== 1) {
        setSurahList((prev: any) => [...prev, { ...item, isBookmarked: 1 }]);
        setBookmarks((prev: any) => [...prev, { ...item, isBookmarked: 1 }]);
      } else {
        setBookmarks((prev: any) =>
          prev.filter((prevData: any) => prevData.id !== item.id)
        );
        setSurahList((prev: any) => [...prev, { ...item, isBookmarked: 0 }]);
      }
    };

    return (
      <ListItem
        onPress={() => handlePress()}
        onBookmarkPress={() => handleBookmarkPress()}
        surah_number={item.surah_number}
        name={item.surah_name}
        englishName={item.surah_englishName}
        englishNameTranslation={item.surah_englishNameTranslation}
        isBookmarked={item.isBookmarked}
      />
    );
  };
  // ---------- flatlist Juz item -------------
  const renderJuzItem = ({ item }: ListRenderItemInfo<JuzItem>) => {
    const margedVerseMapping = `${item.juz_first_verse_id}-${item.juz_last_verse_id}`;

    const handlePress = () => {
      router.push({
        pathname: "/(QuranStack)/quran_page",
        params: {
          juz_number: item.juz_number,
        },
      });
    };

    const handleBookmarkPress = async () => {
      await toggleBookmark(item.id);
      // await getDBinfo();
      if (item.isBookmarked !== 1) {
        setJuzList((prev: any) => [...prev, { ...item, isBookmarked: 1 }]);
        setBookmarks((prev: any) => [...prev, { ...item, isBookmarked: 1 }]);
      } else {
        setBookmarks((prev: any) =>
          prev.filter((prevData: any) => prevData.id !== item.id)
        );
        setJuzList((prev: any) => [...prev, { ...item, isBookmarked: 0 }]);
      }
    };

    return (
      <ListItem
        onPress={() => handlePress()}
        onBookmarkPress={handleBookmarkPress}
        juz_number={item.juz_number}
        verse_mapping={margedVerseMapping}
        isBookmarked={item.isBookmarked}
      />
    );
  };
  // ----------flatlist bookmarks
  const renderBookmarks = ({ item }: ListRenderItemInfo<any>) => {
    const handlePress = () => {
      router.push({
        pathname: "/(QuranStack)/quran_page",
        params: {
          id: item.surah_number,
          name: item.surah_name,
          englishName: item.surah_englishName,
          englishNameTranslation: item.surah_englishNameTranslation,
          numberOfAyahs: item.surah_numberOfAyahs,
          juz_number: item.juz_number,
        },
      });
    };
    const margedVerseMapping = `${item.juz_first_verse_id}-${item.juz_last_verse_id}`;
    // // INSERT INTO bookmarks (title, url) VALUES (?, ?);
    const handleBookmarkPress = () => {
      (async () => {
        await toggleBookmark(item.id);
      })();
      setBookmarks(bookmarks);
      // await getDBinfo();

      setBookmarks((prev: any) => {
        return prev.filter((prevData: any) => prevData.id !== item.id);
      });

      if (item.juz_number) {
        setJuzList((prev: any) => [...prev, { ...item, isBookmarked: 0 }]);
      } else {
        setSurahList((prev: any) => [...prev, { ...item, isBookmarked: 0 }]);
      }
    };
    return (
      <ListItem
        onPress={() => handlePress()}
        onBookmarkPress={handleBookmarkPress}
        surah_number={item.surah_number}
        name={item.surah_name}
        englishName={item.surah_englishName}
        englishNameTranslation={item.surah_englishNameTranslation}
        juz_number={item.juz_number}
        verse_mapping={margedVerseMapping}
        isBookmarked={item.isBookmarked}
      />
    );
  };

  //render liked verses ----------------------------------
  const renderLikedVerses = ({
    item,
    index,
  }: ListRenderItemInfo<likedVerse>) => {
    const handlePress = async () => {
      const info = await getAyahs(item.surahNo);
      router.push({
        pathname: "/(QuranStack)/quran_page",
        params: {
          id: info.number,
          name: info.name,
          englishName: info.englishName,
          englishNameTranslation: info.englishNameTranslation,
          numberOfAyahs: info.numberOfAyahs,
          jump_ayahNo: item.ayahNo,
        },
      });
    };

    const handleDelete = () => {
      (async () => {
        await deleteLikedVerse(item);
      })();

      setLikedVerses((prev: any) => {
        return prev.filter((prevData: any) => prevData.id !== item.id);
      });
    };
    return (
      <LikedVerseItem
        handleDelete={handleDelete}
        handlePress={handlePress}
        id={index + 1}
        name={item.name}
        englishName={item.englishName}
        surahNo={item.surahNo}
        ayahNo={item.ayahNo}
      />
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header title={"Al-Quran"} />
      {/* hero */}
      <HeroWrapper>
        <SearchBar onSearchTextChange={handleSearchTextChange} />
        <RecentlyRead data={recentlyRead} />
      </HeroWrapper>
      {/* menu */}
      <View style={styles.mainContent}>
        <View style={styles.menuWrapper}>
          <View style={styles.menuLeft}>
            {menuItem.map((item) => {
              return (
                <Pressable
                  key={item.id}
                  style={[
                    styles.menuItem,
                    active === item.name && styles.activeMenu,
                  ]}
                  onPress={() => setActive(item.name)}
                >
                  <Text style={styles.menuText}>{item.name}</Text>
                </Pressable>
              );
            })}
          </View>
          {/* <TouchableOpacity onPress={() => handleSorting()}>
            <FontAwesome
              style={styles.menuItem}
              name="sort-numeric-asc"
              size={20}
              color={Colors.text1}
            />
          </TouchableOpacity> */}
        </View>
        {/* items */}
        {!loading && surahList !== null && juzList !== null ? (
          active === "Surah" ? (
            <FlatList
              style={{ flex: 1 }}
              data={filteredText === "" ? surahList : filteredList}
              renderItem={renderSurahItem}
              keyExtractor={(item) => `${item.id}`}
            />
          ) : active === "Juz" ? (
            <FlatList
              style={{ flex: 1 }}
              data={filteredText === "" ? juzList : filteredList}
              renderItem={renderJuzItem}
              keyExtractor={(item, index) => `${index}`}
            />
          ) : active === "Bookmarks" ? (
            <FlatList
              style={{ flex: 1 }}
              data={filteredText === "" ? bookmarks : filteredList}
              renderItem={renderBookmarks}
              keyExtractor={(item) => `${item.id}`}
            />
          ) : active === "Liked Verses" ? (
            <FlatList
              style={{ flex: 1 }}
              data={filteredText === "" ? likedVerses : filteredList}
              renderItem={renderLikedVerses}
              keyExtractor={(item) => `${item.id}`}
            />
          ) : (
            ""
          )
        ) : (
          ""
        )}
      </View>
    </SafeAreaView>
  );
};

export default AlQuranScreen;

const styles = StyleSheet.create({
  mainContent: {
    flex: 1,
    paddingHorizontal: 8,
  },
  menuWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  menuLeft: {
    flexDirection: "row",
    gap: 1,
  },
  menuItem: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 30,
  },
  activeMenu: {
    backgroundColor: "#D9D9D9",
  },
  menuText: {
    fontFamily: "MontserratBold",
    fontWeight: "bold",
    fontSize: 16,
    color: Colors.text1,
  },
});
