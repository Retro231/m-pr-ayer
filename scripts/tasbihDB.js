import * as SQLite from "expo-sqlite";

// initialize db with tables
const initializeDB = async () => {
  const db = await SQLite.openDatabaseAsync("tasbih.db");
  try {
    await db.execAsync(`CREATE TABLE IF NOT EXISTS Tasbih (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT DEFAULT NULL,
      count INTEGER DEFAULT NULL
    );`);
  } catch (error) {
    console.log(error);
  }
};

const insertTasbih = async (item) => {
  try {
    const db = await SQLite.openDatabaseAsync("tasbih.db");
    await db.runAsync(
      "INSERT INTO Tasbih (name,count) VALUES (?, ?)",
      item.name,
      item.count
    );
  } catch (error) {
    console.log(error);
  }
};
const getAllTasbih = async () => {
  try {
    const db = await SQLite.openDatabaseAsync("tasbih.db");

    // filter surah list
    const allRows = await db.getAllAsync(`SELECT *
    FROM Tasbih;`);

    const allTasbih = allRows.map((item) => {
      return {
        ...item,
      };
    });

    console.log(allTasbih);

    return allTasbih;
  } catch (error) {
    console.log(error);
  }
};

const deleteTasbih = async (id) => {
  try {
    const db = await SQLite.openDatabaseAsync("tasbih.db");
    await db.runAsync("DELETE FROM Tasbih WHERE id = ?", id);
  } catch (error) {
    console.log(error);
  }
};

// Function to delete all tables in the tasbih.db
const deleteAllTablesOfTasbih = async () => {
  // Open the database
  const db = await SQLite.openDatabaseAsync("tasbih.db");

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
  insertTasbih,
  getAllTasbih,
  deleteTasbih,
  deleteAllTablesOfTasbih,
};
