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
    
    // Hash the password before storing it
    try {
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

    try {
        let query = 'UPDATE users SET username = ?, first_name = ?, last_name = ?, email_address = ?, isEnabled = ?';
        const updates = [username, first_name, last_name, email_address, isEnabled];

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            query += ', password = ?';
            updates.push(hashedPassword);
        }

        query += ' WHERE id = ?';
        updates.push(id);

        await pool.query(query, updates);
        res.status(200).send('User updated successfully');
    } catch (err) {
        console.error('Error updating user in database:', err);
        res.status(500).send('Error updating user in database');
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
