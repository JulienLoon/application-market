// /middleware/auth.js

const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');

const authenticateToken = async (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Access token is missing or invalid' });

    try {
        // Check if the token is blacklisted
        const [blacklistRows] = await pool.query('SELECT * FROM blacklist_tokens WHERE token = ?', [token]);
        if (blacklistRows.length > 0) {
            return res.status(401).json({ message: 'Token is blacklisted' });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        // Check if the token exists in the user_tokens table
        const [userTokenRows] = await pool.query('SELECT * FROM user_tokens WHERE token = ?', [token]);
        if (userTokenRows.length === 0) {
            return res.status(401).json({ message: 'Token is not valid for any user' });
        }

        next();
    } catch (err) {
        console.error('Token authentication error:', err);
        res.status(403).json({ message: 'Invalid or expired token' });
    }
};

module.exports = authenticateToken;