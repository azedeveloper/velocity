const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.SECRET_KEY;

// Middleware for authentication
const authenticate = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: "No token provided" });

    try {
        req.user = jwt.verify(token, SECRET_KEY);
        next();
    } catch (error) {
        res.status(401).json({ error: "Invalid token" });
    }
};

function authenticateOptional(req, res, next) {
    if (req.cookies.token) {
        return authenticate(req, res, next); 
    }
    req.user = null; 
    next();
}

module.exports = { authenticate, authenticateOptional };
