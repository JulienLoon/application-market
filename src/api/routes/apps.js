const express = require('express');
const { pool, createTables } = require('../config/database');
const { format } = require('date-fns');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

// Roep createTables aan om ervoor te zorgen dat tabellen bestaan
createTables();

// GET route for apps (publicly accessible)
router.get('/windows-apps', async (req, res) => {
    const clientIp = req.headers['x-forwarded-for'] || req.ip || req.socket.remoteAddress;
    const timestamp = format(new Date(), 'dd-MM-yyyy HH:mm:ss');

    const logMessage = `
    ----------------------------------------
    [${timestamp}]
    Request received:
    - Method: ${req.method}
    - URL: ${req.originalUrl}
    - Client IP: ${clientIp}
    - x-forwarded-for: ${req.headers['x-forwarded-for']}
    - req.ip: ${req.ip}
    - req.socket.remoteAddress: ${req.socket.remoteAddress}
    ----------------------------------------
    `;
    console.log(logMessage);

    try {
        // Adjust the query to join with the users table and get the username
        const [results] = await pool.query(`
            SELECT apps.*, users.username AS created_by_username
            FROM windows_apps AS apps
            JOIN users ON apps.created_by = users.id
        `);
        res.json(results);
    } catch (err) {
        console.error('Error querying database:', err);
        res.status(500).send('Error querying database');
    }
});

// The rest of the routes remain unchanged

// POST route for creating an app
router.post('/windows-apps', authenticateToken, async (req, res) => {
    const { name, description, download_url, image_url, created_by, last_modified_by } = req.body;

    if (!created_by || !last_modified_by) {
        return res.status(400).send('Missing required fields: created_by and last_modified_by');
    }

    try {
        const [result] = await pool.query(
            `INSERT INTO windows_apps (name, description, download_url, image_url, created_by, last_modified_by)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [name, description, download_url, image_url, created_by, last_modified_by]
        );
        res.status(201).json({ message: 'App created successfully', id: result.insertId });
    } catch (err) {
        console.error('Error inserting app into database:', err);
        res.status(500).send('Error inserting app into database');
    }
});

// PUT route for updating an app
router.put('/windows-apps/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { name, description, download_url, image_url, last_modified_by } = req.body;

    if (!id || !name || !last_modified_by) {
        return res.status(400).json({ error: 'ID, name, and last_modified_by are required' });
    }

    try {
        const query = `
            UPDATE windows_apps
            SET name = ?, description = ?, download_url = ?, image_url = ?, last_modified_by = ?, updated_at = NOW()
            WHERE id = ?
        `;

        const values = [name, description, download_url, image_url, last_modified_by, id];
        await pool.query(query, values);
        res.status(200).json({ message: 'App updated successfully' });
    } catch (err) {
        console.error('Error updating app in database:', err);
        res.status(500).send('Error updating app in database');
    }
});

// DELETE route for deleting an app
router.delete('/windows-apps/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;

    try {
        const query = 'DELETE FROM windows_apps WHERE id = ?';
        await pool.query(query, [id]);
        res.json({ message: 'App deleted successfully' });
    } catch (err) {
        console.error('Error deleting app from database:', err);
        res.status(500).send('Error deleting app from database');
    }
});

// GET route to fetch count of windows apps
router.get('/windows-apps/count', authenticateToken, async (req, res) => {
    try {
        const [results] = await pool.query('SELECT COUNT(*) AS count FROM windows_apps');
        const count = results[0].count;
        res.json({ count });
    } catch (err) {
        console.error('Error querying database:', err);
        res.status(500).send('Error querying database');
    }
});

module.exports = router;