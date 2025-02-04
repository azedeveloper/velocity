const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./db/database.sqlite", (err) => {
    if (err) console.error(err.message);
    else console.log("Connected to the SQLite database.");
});

// Create the users table
db.run(`
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    pfp TEXT DEFAULT "https://i.ibb.co/wNDqp1vy/default-avatar-icon-of-social-media-user-vector.jpg",
    about TEXT DEFAULT "Hey! I'm using Velocity." CHECK(length(about) <= 200)
);
`);

// Create posts table 
db.run(`
    CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        author INTEGER NOT NULL,
        content TEXT NOT NULL,
        likes INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (author) REFERENCES users (id) ON DELETE CASCADE
    );
`);

// Create likes table
db.run(`
    CREATE TABLE IF NOT EXISTS likes (
        post_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        PRIMARY KEY (post_id, user_id),
        FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    );
`);

function generateRandomId() {
    return Math.floor(1000000000 + Math.random() * 9000000000); 
}

function getUserById(id) {
    return new Promise((resolve, reject) => {
        db.get("SELECT * FROM users WHERE id = ?", [id], (err, row) => {
            if (err) {
                reject(err); 
            } else {
                resolve(row); 
            }
        });
    });
}

function getUserByUsername(username) {
    return new Promise((resolve, reject) => {
        db.get("SELECT * FROM users WHERE username = ?", [username], (err, row) => {
            if (err) {
                reject(err); 
            } else {
                resolve(row); 
            }
        });
    });
}

module.exports = { db, generateRandomId, getUserById, getUserByUsername };
