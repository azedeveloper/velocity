const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.SECRET_KEY;

function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "No token provided" });

    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: "Invalid token" });
    }
}

function authenticateOptional(req, res, next) {
    if (req.headers.authorization) {
        return authenticate(req, res, next); // Use normal authentication
    }
    req.user = null; // User not authenticated
    next();
}

module.exports = { authenticate, authenticateOptional };
