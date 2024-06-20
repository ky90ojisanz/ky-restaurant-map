import Database from "better-sqlite3";
import path from "path";

// データベースのファイルパスを設定
// const dbPath = path.resolve(process.cwd(), "database", "data.db");
// const db = new Database(dbPath);

const db = new Database("data.db", {
  verbose: console.log, // デバッグ用
});

// テーブルを作成
const createTable = `
CREATE TABLE IF NOT EXISTS selected_shops (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  lat REAL NOT NULL,
  lng REAL NOT NULL
);
`;

db.exec(createTable);

export default db;
