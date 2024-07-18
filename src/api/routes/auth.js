// /routes/auth.js

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool, createTables } = require('../config/database');
require('dotenv').config();

const router = express.Router();

// Roep createTables aan om ervoor te zorgen dat tabellen bestaan
createTables();

const generateToken = (user) => {
    return jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
        expiresIn: '1h',
    });
};

router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send('Username and password are required');
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await pool.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);
        res.status(201).send('User registered successfully');
    } catch (error) {
        console.error('Error inserting user into database:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).send('Username already exists');
        } else {
            return res.status(500).send('Error inserting user into database');
        }
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);

        if (rows.length === 0 || !bcrypt.compareSync(password, rows[0].password)) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const user = rows[0];
        const token = generateToken(user);
        res.json({ token, user_id: user.id });
    } catch (error) {
        console.error('Error querying database:', error);
        return res.status(500).send('Error querying database');
    }
});

router.get('/userinfo', async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Authorization token missing' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const [rows] = await pool.query('SELECT id, username FROM users WHERE id = ?', [decoded.id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = rows[0];
        res.status(200).json({ id: user.id, username: user.username });
    } catch (error) {
        console.error('Error verifying token:', error);
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' });
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token' });
        } else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
});

module.exports = router;
