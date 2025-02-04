const express = require("express");
const { db } = require("../db/database");
const authenticate = require("../middleware/auth");
const router = express.Router();

// Create a new post (authenticated users only)
router.post("/posts", authenticate, (req, res) => {
    const { content } = req.body;
    const author = req.user.id;

    if (!content) {
        return res.status(400).json({ error: "Content is required" });
    }

    const query = `INSERT INTO posts (author, content) VALUES (?, ?)`;
    db.run(query, [author, content], function (err) {
        if (err) {
            return res.status(500).json({ error: "Database error" });
        }
        res.status(201).json({ message: "Post created", postId: this.lastID });
    });
});

// Delete a post (authenticated users only, must be the author)
router.delete("/posts/:postId", authenticate, (req, res) => {
    const { postId } = req.params;
    const author = req.user.id;

    const query = `DELETE FROM posts WHERE id = ? AND author = ?`;
    db.run(query, [postId, author], function (err) {
        if (err) {
            return res.status(500).json({ error: "Database error" });
        }
        if (this.changes === 0) {
            return res.status(403).json({ error: "You can only delete your own posts" });
        }
        res.json({ message: "Post deleted" });
    });
});

// Get a post by postId
router.get("/posts/:postId", (req, res) => {
    const { postId } = req.params;

    const query = `
        SELECT posts.id, posts.content, posts.created_at, users.username
        FROM posts
        JOIN users ON posts.author = users.id
        WHERE posts.id = ?
    `;
    db.get(query, [postId], (err, post) => {
        if (err) {
            return res.status(500).json({ error: "Database error" });
        }
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }
        res.json(post);
    });
});

// Get a post by username and postId
router.get("/users/:username/:postId", (req, res) => {
    const { username, postId } = req.params;

    const query = `
        SELECT posts.id, posts.content, posts.created_at, users.username
        FROM posts
        JOIN users ON posts.author = users.id
        WHERE posts.id = ? AND users.username = ?
    `;
    db.get(query, [postId, username], (err, post) => {
        if (err) {
            return res.status(500).json({ error: "Database error" });
        }
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }
        res.json(post);
    });
});

router.get("/posts", (req, res) => {
    const query = `
        SELECT posts.id, posts.content, posts.created_at, posts.author, posts.likes, users.username, users.pfp 
        FROM posts
        JOIN users ON posts.author = users.id
        ORDER BY posts.id DESC
        LIMIT 50;
    `;
    
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: "Failed to fetch posts" });
        }
        
        res.json(rows);
    });
});

// Like a post (authenticated users only)
router.post("/posts/:postId/like", authenticate, (req, res) => {
    const { postId } = req.params;
    const userId = req.user.id;

    // Check if the user has already liked the post
    const checkQuery = `SELECT * FROM likes WHERE post_id = ? AND user_id = ?`;
    db.get(checkQuery, [postId, userId], (err, row) => {
        if (err) {
            return res.status(500).json({ error: "Database error" });
        }
        if (row) {
            return res.status(400).json({ error: "You have already liked this post" });
        }

        // Insert into likes table
        const insertQuery = `INSERT INTO likes (post_id, user_id) VALUES (?, ?)`;
        db.run(insertQuery, [postId, userId], function (err) {
            if (err) {
                return res.status(500).json({ error: "Database error" });
            }

            // Increment the likes count in the posts table
            const updateQuery = `UPDATE posts SET likes = likes + 1 WHERE id = ?`;
            db.run(updateQuery, [postId], function (err) {
                if (err) {
                    return res.status(500).json({ error: "Database error" });
                }
                res.json({ message: "Post liked" });
            });
        });
    });
});


module.exports = router;
