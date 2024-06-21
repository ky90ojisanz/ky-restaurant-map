import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// `__dirname`をESM形式で使用するための設定
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ディレクトリが存在するか確認
const dbDir = path.resolve(__dirname);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}
// データベース接続を初期化
const db = new Database(dbPath);

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
