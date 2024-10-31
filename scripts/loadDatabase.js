import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system";

const loadDatabase = async (dbName) => {
  let dbAsset;

  if (dbName === "quran.db") {
    dbAsset = require("@/assets/quran.db");
  } else if (dbName === "tasbih.db") {
    dbAsset = require("@/assets/tasbih.db");
  } else {
    throw new Error("Invalid database name");
  }
  const dbUri = Asset.fromModule(dbAsset).uri;
  const dbFilePath = `${FileSystem.documentDirectory}SQLite/${dbName}`;

  const fileInfo = await FileSystem.getInfoAsync(dbFilePath);
  if (!fileInfo.exists) {
    await FileSystem.makeDirectoryAsync(
      `${FileSystem.documentDirectory}SQLite`,
      {
        intermediates: true,
      }
    );
    await FileSystem.downloadAsync(dbUri, dbFilePath);
  }
};

export default loadDatabase;
