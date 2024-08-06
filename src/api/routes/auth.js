// routes/auth.js

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool, createTables } = require('../config/database');
const checkToken = require('../middleware/checkToken'); // Importeer de nieuwe middleware
require('dotenv').config();

const router = express.Router();

createTables();

const generateToken = (user) => {
    return jwt.sign({ userId: user.id, username: user.username }, process.env.JWT_SECRET, {
        expiresIn: '1h',
    });
};

const isRegistrationEnabled = async () => {
    const [rows] = await pool.query('SELECT setting_value FROM settings WHERE setting_key = "registration_enabled"');
    return rows.length > 0 && rows[0].setting_value === '1';
};

router.post('/register', async (req, res) => {
    const { username, password, email_address, first_name, last_name, isEnabled } = req.body;

    if (!await isRegistrationEnabled()) {
        return res.status(403).send('Registration is currently disabled');
    }

    if (!username || !password || !email_address || !first_name || !last_name || isEnabled === undefined) {
        return res.status(400).send('All fields are required');
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await pool.query('INSERT INTO users (username, password, email_address, first_name, last_name, isEnabled) VALUES (?, ?, ?, ?, ?, ?)', [username, hashedPassword, email_address, first_name, last_name, isEnabled]);
        res.status(201).send('User registered successfully');
    } catch (error) {
        console.error('Error inserting user into database:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).send('Username or email already exists');
        } else {
            return res.status(500).send('Error inserting user into database');
        }
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
        
        if (rows.length === 0) {
            return res.status(401).send('Invalid credentials');
        }

        const user = rows[0];
        if (!user.isEnabled) {
            return res.status(403).send('User account is not enabled');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).send('Invalid credentials');
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        await pool.query('INSERT INTO user_tokens (user_id, token) VALUES (?, ?)', [user.id, token]);

        res.json({ token, user_id: user.id });
    } catch (err) {
        console.error('Error logging in user:', err);
        res.status(500).send('Error logging in user');
    }
});

router.put('/users/:id', checkToken, async (req, res) => {
    const { id } = req.params;
    const { username, email_address, isEnabled } = req.body;

    if (!id || !username || !email_address) {
        return res.status(400).send('Missing required fields: id, username, and email_address');
    }

    try {
        const [result] = await pool.query('UPDATE users SET username = ?, email_address = ?, isEnabled = ? WHERE id = ?', [username, email_address, isEnabled, id]);
        if (result.affectedRows === 0) {
            return res.status(404).send('User not found');
        }
        res.send('User updated successfully');
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).send('Error updating user');
    }
});

router.get('/userinfo', checkToken, async (req, res) => {
    try {
        const { userId } = req.user;

        const [rows] = await pool.query('SELECT id, username, first_name, last_name FROM users WHERE id = ?', [userId]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = rows[0];
        res.status(200).json({ id: user.id, username: user.username, first_name: user.first_name, last_name: user.last_name });
    } catch (error) {
        console.error('Error fetching user info:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Endpoint to check if the token is valid
router.post('/checkToken', checkToken, async (req, res) => {
    res.status(200).json({ valid: true, message: 'Token is valid' });
});

module.exports = router;
