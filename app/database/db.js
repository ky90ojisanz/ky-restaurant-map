import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

// `__dirname`をESM形式で使用するための設定
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// データベースのファイルパスを設定
const dbDir = path.resolve(__dirname);
const dbPath = path.join(dbDir, "data.db");

// データベースファイルが存在するか確認し、存在しない場合は作成
if (!fs.existsSync(dbPath)) {
  // データベースを新規作成
  console.log(`Database file ${dbPath} does not exist. Creating new database.`);
  const db = new Database(dbPath);
  const createTable = `
  CREATE TABLE IF NOT EXISTS selected_shops (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    lat REAL NOT NULL,
    lng REAL NOT NULL
  );
  `;
  db.exec(createTable);
  console.log(`Database file ${dbPath} created and table initialized.`);
  db.close(); // 初期化後に一度データベースを閉じる
} else {
  console.log(`Database file ${dbPath} already exists.`);
}

// データベース接続を初期化
const db = new Database(dbPath);
console.log(`Database connected at ${dbPath}`);

export default db;
