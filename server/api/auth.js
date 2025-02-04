const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { db, generateRandomId } = require("../db/database");
const router = express.Router();

const SECRET_KEY = process.env.SECRET_KEY;

// Register
router.post("/auth/register", async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ error: "Missing fields" });
    }

    const id = generateRandomId(); 
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `INSERT INTO users (id, username, email, password) VALUES (?, ?, ?, ?)`;
    db.run(query, [id, username, email, hashedPassword], function (err) {
        if (err) {
            return res.status(400).json({ error: "User already exists" });
        }
        res.json({ message: "User registered successfully", userId: id });
    });
});

// Login
router.post("/auth/login", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: "Missing fields" });

    const query = `SELECT * FROM users WHERE username = ?`;
    db.get(query, [username], (err, user) => {
        if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: "1h" });
        res.json({ token });
    });
});

// Me
router.get("/auth/me", (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "No token provided" });

    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        res.json({ user: decoded });
    } catch (error) {
        res.status(401).json({ error: "Invalid token" });
    }
});

//Update pfp
router.post("/auth/me/pfp", (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "No token provided" });

    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        const { pfp } = req.body;
        const query = `UPDATE users SET pfp = ? WHERE id = ?`;
        db.run(query, [pfp, decoded.id], (err) => {
            if (err) {
                return res.status(500).json({ error: "Database error" });
            }
            res.json({ message: "Profile picture updated" });
        });
    } catch (error) {
        res.status(401).json({ error: "Invalid token" });
    }
});

// Logout
router.post("/auth/logout", (req, res) => {
    res.json({ message: "Logged out successfully" });
});

module.exports = router;
