// /routes/admin.js

const express = require('express');
const { pool } = require('../config/database');
const authenticateToken = require('../middleware/auth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const moment = require('moment-timezone');  // Voeg deze regel toe

const router = express.Router();

// GET all users
router.get('/users', authenticateToken, async (req, res) => {
    try {
        const [results] = await pool.query('SELECT * FROM users');
        res.json(results);
    } catch (err) {
        console.error('Error querying database:', err);
        res.status(500).send('Error querying database');
    }
});

// POST add a new user
router.post('/users', authenticateToken, async (req, res) => {
    const { username, password, first_name, last_name, email_address, isEnabled } = req.body;

    try {
        // Check if username or email already exists
        const [existingUser] = await pool.query('SELECT * FROM users WHERE username = ? OR email_address = ?', [username, email_address]);
        if (existingUser.length > 0) {
            const existingUsername = existingUser.find(user => user.username === username);
            const existingEmail = existingUser.find(user => user.email_address === email_address);
            if (existingUsername) {
                return res.status(400).json({ field: 'username', message: 'Username already exists' });
            }
            if (existingEmail) {
                return res.status(400).json({ field: 'email_address', message: 'Email address already exists' });
            }
        }

        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query(
            'INSERT INTO users (username, password, first_name, last_name, email_address, isEnabled) VALUES (?, ?, ?, ?, ?, ?)',
            [username, hashedPassword, first_name, last_name, email_address, isEnabled]
        );
        res.status(201).send('User created successfully');
    } catch (err) {
        console.error('Error creating user in database:', err);
        res.status(500).send('Error creating user in database');
    }
});

// PUT update a user
router.put('/users/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { username, password, first_name, last_name, email_address, isEnabled } = req.body;

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // Haal de huidige staat van isEnabled op
        const [currentStatusRows] = await connection.query('SELECT isEnabled FROM users WHERE id = ?', [id]);
        const currentIsEnabled = currentStatusRows[0]?.isEnabled;

        let query = 'UPDATE users SET username = ?, first_name = ?, last_name = ?, email_address = ?, isEnabled = ?';
        const updates = [username, first_name, last_name, email_address, isEnabled];

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            query += ', password = ?';
            updates.push(hashedPassword);
        }

        query += ' WHERE id = ?';
        updates.push(id);

        await connection.query(query, updates);

        // Controleer of de gebruiker wordt uitgeschakeld
        if (currentIsEnabled && !isEnabled) {
            // Haal de tokens op van de gebruiker die wordt uitgeschakeld
            const [tokens] = await connection.query('SELECT token FROM user_tokens WHERE user_id = ?', [id]);

            // Voeg de tokens toe aan de blacklist met vervaldatum
            for (const { token } of tokens) {
                const decoded = jwt.decode(token);
                if (decoded && decoded.exp) {
                    const expiresAt = moment.tz(decoded.exp * 1000, 'Europe/Amsterdam').format('YYYY-MM-DD HH:mm:ss');
                    await connection.query('INSERT INTO blacklist_tokens (token, expires_at) VALUES (?, ?)', [token, expiresAt]);
                } else {
                    await connection.query('INSERT INTO blacklist_tokens (token) VALUES (?)', [token]);
                }
            }
        }

        await connection.commit();
        res.status(200).send('User updated successfully');
    } catch (err) {
        await connection.rollback();
        console.error('Error updating user in database:', err);
        res.status(500).send('Error updating user in database');
    } finally {
        connection.release();
    }
});

// DELETE delete a user
router.delete('/users/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        
        // Haal de tokens op van de gebruiker die verwijderd wordt
        const [tokens] = await connection.query('SELECT token FROM user_tokens WHERE user_id = ?', [id]);

        // Voeg de tokens toe aan de blacklist met vervaldatum
        for (const { token } of tokens) {
            const decoded = jwt.decode(token);
            if (decoded && decoded.exp) {
                const expiresAt = moment.tz(decoded.exp * 1000, 'Europe/Amsterdam').format('YYYY-MM-DD HH:mm:ss');
                console.log(`Decoded token: ${token}, Expires at: ${expiresAt}`);
                await connection.query('INSERT INTO blacklist_tokens (token, expires_at) VALUES (?, ?)', [token, expiresAt]);
            } else {
                await connection.query('INSERT INTO blacklist_tokens (token) VALUES (?)', [token]);
            }
        }

        // Verwijder de gebruiker
        await connection.query('DELETE FROM users WHERE id = ?', [id]);
        
        await connection.commit();
        res.status(200).send('User deleted and tokens blacklisted successfully');
    } catch (err) {
        await connection.rollback();
        console.error('Error deleting user from database:', err);
        res.status(500).send('Error deleting user from database');
    } finally {
        connection.release();
    }
});

module.exports = router;