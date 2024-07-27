const express = require('express');
const { pool, createTables } = require('../config/database');
const { format } = require('date-fns');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

// Roep createTables aan om ervoor te zorgen dat tabellen bestaan
createTables();

// GET all users
router.get('/', authenticateToken, async (req, res) => {
    try {
        const [results] = await pool.query('SELECT * FROM users');
        res.json(results);
    } catch (err) {
        console.error('Error querying database:', err);
        res.status(500).send('Error querying database');
    }
});

// PUT update a user
router.put('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { username, password, first_name, last_name, email_address, isEnabled } = req.body;
    if (!id || !username || !email_address) {
        return res.status(400).send('Missing required fields: id, username, and email_address');
    }

    try {
        await pool.query(
            'UPDATE users SET username = ?, password = ?, first_name = ?, last_name = ?, email_address = ?, isEnabled = ? WHERE id = ?',
            [username, password, first_name, last_name, email_address, isEnabled, id]
        );
        res.status(200).send({ message: 'User updated successfully' });
    } catch (err) {
        console.error('Error updating user in database:', err);
        res.status(500).send('Error updating user in database');
    }
});


// DELETE delete a user
router.delete('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).send('Missing required field: id');
    }

    try {
        await pool.query('DELETE FROM users WHERE id = ?', [id]);
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error('Error deleting user from database:', err);
        res.status(500).send('Error deleting user from database');
    }
});

// GET route to fetch count of registered users
router.get('/count', authenticateToken, async (req, res) => {
    try {
        const [results] = await pool.query('SELECT COUNT(*) AS count FROM users');
        const count = results[0].count;
        res.json({ count });
    } catch (err) {
        console.error('Error querying database:', err);
        res.status(500).send('Error querying database');
    }
});

module.exports = router;