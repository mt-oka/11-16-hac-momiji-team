// database.js
const sqlite3 = require('sqlite3').verbose();

// データベースファイルを指定
const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

// テーブルが存在しない場合に作成
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS product (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            repo TEXT NOT NULL,
            recipe TEXT NOT NULL,
            image_url TEXT NOT NULL
        )
    `);
});

module.exports = db;
