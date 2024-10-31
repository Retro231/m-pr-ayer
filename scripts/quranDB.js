import * as SQLite from "expo-sqlite";
import { getAudioAyahs, getJuz, getSurahList } from "@/scripts/getQuranData";

// initialize db with tables
const initializeDB = async () => {
  const db = await SQLite.openDatabaseAsync("quran.db");
  try {
    await db.execAsync(`CREATE TABLE IF NOT EXISTS Chapters (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        surah_number INTEGER DEFAULT NULL,
        surah_name TEXT DEFAULT NULL,
        surah_englishName TEXT DEFAULT NULL,
        surah_englishNameTranslation TEXT DEFAULT NULL,
        surah_numberOfAyahs INTEGER DEFAULT NULL,
        juz_number INTEGER DEFAULT NULL,
        juz_verse_mapping TEXT DEFAULT NULL,
        juz_first_verse_id INTEGER DEFAULT NULL,
        juz_last_verse_id INTEGER DEFAULT NULL,
        juz_verses_count INTEGER DEFAULT NULL,
        isBookmarked INTEGER DEFAULT 0
      );`);

    // surah / juz

    // id -
    // type - surah|juz
    // data -
    // surahNo-
    // juzNo -

    await db.execAsync(`CREATE TABLE IF NOT EXISTS ChapterInfo (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT DEFAULT NULL,
        data TEXT DEFAULT NULL,
        surahNo INTEGER DEFAULT NULL,
        juzNo INTEGER DEFAULT NULL
    );`);

    // tafsir
    // surahNo: surah-number
    // data : data

    await db.execAsync(`CREATE TABLE IF NOT EXISTS Tafsir (
      surahNo INTEGER DEFAULT NULL,
      data TEXT DEFAULT NULL
      );`);

    // LikedVerses

    await db.execAsync(`CREATE TABLE IF NOT EXISTS LikedVerses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT DEFAULT NULL,
        englishName TEXT DEFAULT NULL,
        surahNo INTEGER DEFAULT NULL,
        ayahNo INTEGER DEFAULT NULL
      );`);

    // RecentRead
    await db.execAsync(`CREATE TABLE IF NOT EXISTS RecentRead (
        name TEXT DEFAULT NULL,
        englishName TEXT DEFAULT NULL,
        surahNo INTEGER DEFAULT NULL,
        ayahNo INTEGER DEFAULT NULL
      );`);

    const ChaptersRows = await db.getFirstAsync(
      `SELECT COUNT(*) FROM Chapters`
    );
    // if chapter have row more then 0
    if (ChaptersRows !== null) {
      if (ChaptersRows["COUNT(*)"] <= 0) {
        await insertSurah();
        await insertJuz();
      }
    }

    // tasbih counter db operation
    await db.execAsync(`CREATE TABLE IF NOT EXISTS Tasbih (
      name TEXT DEFAULT NULL,
      count INTEGER DEFAULT NULL
    );`);
  } catch (error) {
    console.log(error);
  }
};

// Check if Table Exist...??

const isTableExist = async (tableName) => {
  try {
    const db = await SQLite.openDatabaseAsync("quran.db");

    const ChaptersRows = await db.getFirstAsync(
      `SELECT COUNT(*) FROM ${tableName}`
    );

    if (ChaptersRows !== null) {
      if (ChaptersRows["COUNT(*)"] >= 0) {
        return true;
      } else {
        return false;
      }
    }
  } catch (error) {
    console.log(error);
  }
};

// Table: Chapters ----------------------------------------

const insertSurah = async () => {
  try {
    const db = await SQLite.openDatabaseAsync("quran.db");
    const surahList = await getSurahList();
    surahList.forEach(async (item) => {
      await db.runAsync(
        "INSERT INTO Chapters (surah_number,surah_name,surah_englishName,surah_englishNameTranslation,surah_numberOfAyahs ) VALUES (?, ?, ?, ?, ?)",
        item.number,
        item.name,
        item.englishName,
        item.englishNameTranslation,
        item.numberOfAyahs
      );
    });
  } catch (error) {
    console.log(error);
  }
};

const insertJuz = async () => {
  try {
    const db = await SQLite.openDatabaseAsync("quran.db");

    const juzList = await getJuz();

    juzList.forEach(async (item) => {
      await db.runAsync(
        "INSERT INTO Chapters (juz_number,juz_verse_mapping,juz_first_verse_id,juz_last_verse_id,juz_verses_count) VALUES (?, ?, ?, ?, ?)",
        item.juz_number,
        item.verse_mapping,
        item.first_verse_id,
        item.last_verse_id,
        item.verses_count
      );
    });
  } catch (error) {
    console.log(error);
  }
};

const filterSurahList = async () => {
  try {
    const db = await SQLite.openDatabaseAsync("quran.db");

    // filter surah list
    const allRows = await db.getAllAsync(`SELECT *
      FROM Chapters
      WHERE surah_number IS NOT NULL;`);

    const surahList = allRows.map((item) => {
      return {
        ...item,
      };
    });

    return surahList;
  } catch (error) {
    console.log(error);
  }
};

const filterJuzList = async () => {
  try {
    const db = await SQLite.openDatabaseAsync("quran.db");

    // filter juz
    const allRows = await db.getAllAsync(`SELECT *
      FROM Chapters
      WHERE juz_number IS NOT NULL;`);

    const juzList = allRows.map((item) => {
      return {
        ...item,
      };
    });

    return juzList;
  } catch (error) {
    console.log(error);
  }
};

const filterChapters = async () => {
  try {
    const db = await SQLite.openDatabaseAsync("quran.db");

    const allRows = await db.getAllAsync(`SELECT * FROM Chapters;`);

    // Parse the JSON string in the 'data' field and map the result
    const chapters = allRows.map((item) => {
      return {
        ...item,
      };
    });
    return chapters;
  } catch (error) {
    console.log(error);
  }
};

const filterBookmark = async () => {
  try {
    const db = await SQLite.openDatabaseAsync("quran.db");
    // filter juz
    const allRows = await db.getAllAsync(
      `SELECT *
      FROM Chapters
      WHERE isBookmarked IS (?);`,
      1
    );
    const bookmarkList = allRows.map((item) => {
      return {
        ...item,
      };
    });
    return bookmarkList;
  } catch (error) {
    console.log(error);
  }
};

const toggleBookmark = async (id) => {
  const db = await SQLite.openDatabaseAsync("quran.db");
  try {
    const result = await db.runAsync(
      `UPDATE Chapters
   SET isBookmarked = CASE 
       WHEN isBookmarked = 1 THEN 0
       ELSE 1
   END
   WHERE id = ?`,
      id
    );
  } catch (error) {
    console.log(error);
  }
};

// Table: LikedVerses ----------------------------------------

const insertLikedVerse = async (item) => {
  const db = await SQLite.openDatabaseAsync("quran.db");
  await db.runAsync(
    "INSERT INTO LikedVerses (name,englishName,surahNo,ayahNo) VALUES (?, ?, ?, ?)",
    item.name,
    item.englishName,
    item.surahNo,
    item.ayahNo
  );
};

const deleteLikedVerse = async (item) => {
  const db = await SQLite.openDatabaseAsync("quran.db");
  await db.runAsync(
    "DELETE FROM LikedVerses WHERE surahNo = ? AND ayahNo = ? ",
    item.surahNo,
    item.ayahNo
  );
};

const fatchLikedVerses = async () => {
  const db = await SQLite.openDatabaseAsync("quran.db");

  const allRows = await db.getAllAsync(
    `SELECT *
    FROM LikedVerses`,
    1
  );
  const likedVerses = allRows.map((item) => {
    return {
      ...item,
    };
  });
  return likedVerses;
};

// Table: RecentRead ----------------------------------------
const insertRecentlyRead = async (item) => {
  const db = await SQLite.openDatabaseAsync("quran.db");
  await db.runAsync("DELETE FROM RecentRead");
  await db.runAsync(
    "INSERT INTO RecentRead (name,englishName,surahNo,ayahNo) VALUES (?, ?, ?, ?)",
    item.name,
    item.englishName,
    item.surahNo,
    item.ayahNo
  );
};
const fatchRecentlyRead = async () => {
  const db = await SQLite.openDatabaseAsync("quran.db");

  await db.execAsync(`CREATE TABLE IF NOT EXISTS RecentRead (
    name TEXT DEFAULT NULL,
    englishName TEXT DEFAULT NULL,
    surahNo INTEGER DEFAULT NULL,
    ayahNo INTEGER DEFAULT NULL
  );`);

  const allRows = await db.getAllAsync(
    `SELECT *
    FROM RecentRead`,
    1
  );
  const recentlyRead = allRows.map((item) => {
    return {
      ...item,
    };
  });
  return recentlyRead;
};

// Table: ChapterInfo

const insertChapterInfo = async (type, data, surahNo = null, juzNo = null) => {
  // console.log(type, data, surahNo, juzNo);
  // surah / juz
  // id -
  // type - surah|juz
  // data -
  // surahNo-
  // juzNo -

  try {
    const db = await SQLite.openDatabaseAsync("quran.db");
    await db.runAsync(
      "INSERT INTO ChapterInfo (type,data,surahNo,juzNo ) VALUES (?, ?, ?, ?)",
      type,
      JSON.stringify(data),
      surahNo,
      juzNo
    );
  } catch (error) {
    console.log(error);
  }
};

const isSurahInfoExist = async (id) => {
  try {
    const db = await SQLite.openDatabaseAsync("quran.db");

    // filter surah list
    const allRows = await db.getAllAsync(
      `SELECT *
      FROM ChapterInfo
      WHERE surahNo = ?`,
      id
    );

    const surahInfo = allRows.map((item) => {
      return {
        ...item,
      };
    });

    if (surahInfo.length > 0) {
      return surahInfo[0];
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
  }
};

const isJuzInfoExist = async (id) => {
  try {
    const db = await SQLite.openDatabaseAsync("quran.db");

    // filter surah list
    const allRows = await db.getAllAsync(
      `SELECT *
      FROM ChapterInfo
      WHERE juzNo = ?`,
      id
    );

    const juzInfo = allRows.map((item) => {
      return {
        ...item,
      };
    });

    if (juzInfo.length > 0) {
      return juzInfo[0];
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
  }
};

// Function to delete all tables in the quran.db
const deleteAllTablesOfQuran = async () => {
  // Open the database
  const db = await SQLite.openDatabaseAsync("quran.db");

  try {
    // Get the list of all table names in the database
    const tables = await db.getAllAsync(`
     SELECT name 
     FROM sqlite_master 
     WHERE type='table' AND name NOT LIKE 'sqlite_%';
   `);

    // Iterate over the list of tables and delete all data in each
    for (const table of tables) {
      await db.runAsync(`DELETE FROM ${table.name}`);
      console.log(`Cleared data from table: ${table.name}`);
    }

    console.log("All data in quran.db tables has been deleted.");
  } catch (error) {
    console.error("Error deleting data:", error);
  }
};

export {
  initializeDB,
  isTableExist,
  filterChapters,
  filterSurahList,
  filterJuzList,
  filterBookmark,
  toggleBookmark,
  insertLikedVerse,
  deleteLikedVerse,
  fatchLikedVerses,
  insertRecentlyRead,
  fatchRecentlyRead,
  insertChapterInfo,
  isSurahInfoExist,
  isJuzInfoExist,
  deleteAllTablesOfQuran,
};
