// /middleware/checkBlacklistToken.js

const { pool } = require('../config/database');

const checkBlacklistToken = async (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).send('Access token missing or invalid');
    }

    try {
        const [results] = await pool.query('SELECT * FROM blacklist_tokens WHERE token = ?', [token]);

        if (results.length > 0) {
            const tokenData = results[0];
            console.log(`Blacklisted token: ${token}, Expires at: ${tokenData.expires_at}`);
            if (tokenData.expires_at && new Date(tokenData.expires_at) <= new Date()) {
                return res.status(403).send('Token is blacklisted');
            }
        }

        next();
    } catch (err) {
        console.error('Error checking token in blacklist:', err);
        res.status(500).send('Internal server error');
    }
};

module.exports = checkBlacklistToken;
