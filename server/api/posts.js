const express = require("express");
const { db } = require("../db/database");
const { authenticate, authenticateOptional}= require("../middleware/auth");
const router = express.Router();

// Create a new post (authenticated users only)
router.post("/posts", authenticate, (req, res) => {
    const { content, parent_id = null } = req.body;
    const author = req.user.id;

    if (!content) {
        return res.status(400).json({ error: "Content is required" });
    }

    const query = `INSERT INTO posts (author, content, parent_id) VALUES (?, ?, ?)`;
    db.run(query, [author, content, parent_id], function (err) {
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

// Get a post by postId (with like status if authenticated)
router.get("/posts/:postId", authenticateOptional, (req, res) => {
    const { postId } = req.params;
    const userId = req.user ? req.user.id : null;

    const query = userId
        ? `
            SELECT posts.id, posts.content, posts.created_at, posts.likes, users.username, users.pfp,
                   EXISTS (SELECT 1 FROM likes WHERE likes.post_id = posts.id AND likes.user_id = ?) AS liked
            FROM posts
            JOIN users ON posts.author = users.id
            WHERE posts.id = ?
        `
        : `
            SELECT posts.id, posts.content, posts.created_at, posts.likes, users.username, users.pfp, 0 AS liked
            FROM posts
            JOIN users ON posts.author = users.id
            WHERE posts.id = ?
        `;

    const params = userId ? [userId, postId] : [postId];

    db.get(query, params, (err, post) => {
        if (err) return res.status(500).json({ error: "Database error" });
        if (!post) return res.status(404).json({ error: "Post not found" });

        post.liked = !!post.liked; // Convert to boolean
        res.json(post);
    });
});


// Get a post by username and postId (with like status if authenticated)
router.get("/users/:username/:postId", authenticateOptional, (req, res) => {
    const { username, postId } = req.params;
    const userId = req.user ? req.user.id : null;

    const query = userId
        ? `
            SELECT posts.id, posts.content, posts.created_at, posts.likes, users.username,
                   users.pfp,
                   (SELECT COUNT(*) FROM likes WHERE likes.post_id = posts.id AND likes.user_id = ?) AS liked
            FROM posts
            JOIN users ON posts.author = users.id
            WHERE posts.id = ? AND users.username = ?
        `
        : `
            SELECT posts.id, posts.content, posts.created_at, posts.likes, users.username, users.pfp
            FROM posts
            JOIN users ON posts.author = users.id
            WHERE posts.id = ? AND users.username = ?
        `;

    const params = userId ? [userId, postId, username] : [postId, username];

    db.get(query, params, (err, post) => {
        if (err) {
            return res.status(500).json({ error: "Database error" });
        }
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        if (userId) post.liked = !!post.liked;

        res.json(post);
    });
});

router.get("/posts/:postId/replies", authenticateOptional, (req, res) => {
    const { postId } = req.params;
    const userId = req.user ? req.user.id : null;

    const query = userId
        ? `
            WITH RECURSIVE reply_tree AS (
                SELECT posts.*, users.username, users.pfp,
                       EXISTS (SELECT 1 FROM likes WHERE likes.post_id = posts.id AND likes.user_id = ?) AS liked
                FROM posts
                JOIN users ON posts.author = users.id
                WHERE posts.id = ?

                UNION ALL

                SELECT p.*, u.username, u.pfp,
                       EXISTS (SELECT 1 FROM likes WHERE likes.post_id = p.id AND likes.user_id = ?) AS liked
                FROM posts p
                JOIN reply_tree rt ON p.parent_id = rt.id
                JOIN users u ON p.author = u.id
            )
            SELECT * FROM reply_tree ORDER BY created_at ASC;
        `
        : `
            WITH RECURSIVE reply_tree AS (
                SELECT posts.*, users.username, users.pfp, 0 AS liked
                FROM posts
                JOIN users ON posts.author = users.id
                WHERE posts.id = ?

                UNION ALL

                SELECT p.*, u.username, u.pfp, 0 AS liked
                FROM posts p
                JOIN reply_tree rt ON p.parent_id = rt.id
                JOIN users u ON p.author = u.id
            )
            SELECT * FROM reply_tree ORDER BY created_at ASC;
        `;

    const params = userId ? [userId, postId, userId] : [postId];

    db.all(query, params, (err, rows) => {
        if (err) return res.status(500).json({ error: "Failed to fetch replies" });

        if (rows.length === 0) return res.status(404).json({ error: "Post not found" });

        rows.forEach(reply => reply.liked = !!reply.liked); // Ensure boolean value
        res.json(rows);
    });
});

//Get replies count
router.get("/posts/:postId/replies/count", (req, res) => {
    const { postId } = req.params;

    const query = `SELECT COUNT(*) AS count FROM posts WHERE parent_id = ?`;

    db.get(query, [postId], (err, row) => {
        if (err) return res.status(500).json({ error: "Database error" });

        res.json(row);
    });
});


// Get all posts (with like status if authenticated)
router.get("/posts", authenticateOptional, (req, res) => {
    const userId = req.user ? req.user.id : null;

    const query = userId
        ? `
            SELECT posts.id, posts.content, posts.created_at, posts.likes, users.username, users.pfp,
                   EXISTS (SELECT 1 FROM likes WHERE likes.post_id = posts.id AND likes.user_id = ?) AS liked
            FROM posts
            JOIN users ON posts.author = users.id
            WHERE posts.parent_id IS NULL
            ORDER BY posts.id DESC
            LIMIT 50;
        `
        : `
            SELECT posts.id, posts.content, posts.created_at, posts.likes, users.username, users.pfp, 0 AS liked
            FROM posts
            JOIN users ON posts.author = users.id
            WHERE posts.parent_id IS NULL
            ORDER BY posts.id DESC
            LIMIT 50;
        `;

    const params = userId ? [userId] : [];

    db.all(query, params, (err, rows) => {
        if (err) return res.status(500).json({ error: "Failed to fetch posts" });

        rows.forEach(post => post.liked = !!post.liked);
        res.json(rows);
    });
});


//Like a post (authenticated users only)
router.post("/posts/:postId/like", authenticate, (req, res) => {
    const { postId } = req.params;
    const userId = req.user.id;

    const checkQuery = `SELECT 1 FROM likes WHERE post_id = ? AND user_id = ?`;
    
    db.get(checkQuery, [postId, userId], (err, row) => {
        if (err) return res.status(500).json({ error: "Database error" });

        if (row) {
            // Unlike post
            const deleteQuery = `DELETE FROM likes WHERE post_id = ? AND user_id = ?`;
            db.run(deleteQuery, [postId, userId], function (err) {
                if (err) return res.status(500).json({ error: "Database error" });

                const updateQuery = `UPDATE posts SET likes = likes - 1 WHERE id = ? AND likes > 0`;
                db.run(updateQuery, [postId], function (err) {
                    if (err) return res.status(500).json({ error: "Database error" });

                    res.json({ message: "Post unliked", liked: false });
                });
            });
        } else {
            // Like post
            const insertQuery = `INSERT INTO likes (post_id, user_id) VALUES (?, ?)`;
            db.run(insertQuery, [postId, userId], function (err) {
                if (err) return res.status(500).json({ error: "Database error" });

                const updateQuery = `UPDATE posts SET likes = likes + 1 WHERE id = ?`;
                db.run(updateQuery, [postId], function (err) {
                    if (err) return res.status(500).json({ error: "Database error" });

                    res.json({ message: "Post liked", liked: true });
                });
            });
        }
    });
});

module.exports = router;
