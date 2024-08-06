// api/config/cronJobs.js

const cron = require('node-cron');
const { pool } = require('./database');

const deleteExpiredTokens = async () => {
    try {
        const [result] = await pool.query('DELETE FROM blacklist_tokens WHERE expires_at <= NOW()');
        console.log(`${result.affectedRows} expired tokens deleted from blacklist`);
    } catch (err) {
        console.error('Error deleting expired tokens:', err);
    }
};

// Function to get current time in HH:MM format
const getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
};

// Schedule the task to run every hour
cron.schedule('0 * * * *', () => {
    const currentTime = getCurrentTime();
    console.log(`Running cron job to delete expired tokens at ${currentTime}`);
    deleteExpiredTokens();
});
