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
    password TEXT NOT NULL
);
`);

//Create posts table
db.run(`
    CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        author INTEGER NOT NULL,
        content TEXT NOT NULL,
        FOREIGN KEY (author) REFERENCES users (id) ON DELETE CASCADE
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
