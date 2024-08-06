// middleware/checkToken.js

const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');
require('dotenv').config();

const checkToken = async (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Access denied, no token provided' });
    }

    try {
        // Check if token is blacklisted
        const [blacklistRows] = await pool.query('SELECT * FROM blacklist_tokens WHERE token = ?', [token]);
        if (blacklistRows.length > 0) {
            return res.status(401).json({ message: 'Token is blacklisted' });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded || !decoded.userId) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        // Attach the user information to the request object
        req.user = decoded;

        next();
    } catch (error) {
        console.error('Token verification error:', error);
        res.status(400).json({ message: 'Invalid token' });
    }
};

module.exports = checkToken;
