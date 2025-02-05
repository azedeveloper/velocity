const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { db, getUserById, getUserByUsername } = require("../db/database");
const router = express.Router();

router.get("/users/id/:id", async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await getUserById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const { email, password, ...safeUser } = user;

        res.json(safeUser);
    } catch (error) {
        res.status(500).json({ error: "Database error" });
    }
});

router.get("/users/:username", async (req, res) => {
    const username = req.params.username;

    try {
        const user = await getUserByUsername(username);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const { email, password, ...safeUser } = user;

        res.json(safeUser);
    } catch (error) {
        res.status(500).json({ error: "Database error" });
    }
});





module.exports = router;
