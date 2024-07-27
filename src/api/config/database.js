// api/config/database.js

require('dotenv').config();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST || "127.0.0.1",
    port: "3306",
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function createTables() {
    const createUsersTable = `
        CREATE TABLE IF NOT EXISTS users (
            id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
            username VARCHAR(255) NOT NULL,
            password VARCHAR(255) NOT NULL,
            first_name VARCHAR(255),
            last_name VARCHAR(255),
            email_address VARCHAR(255) UNIQUE,
            isEnabled BOOLEAN DEFAULT true,
            created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            UNIQUE KEY username (username)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
    `;

    const createWindowsAppsTable = `
        CREATE TABLE IF NOT EXISTS windows_apps (
            id bigint unsigned NOT NULL AUTO_INCREMENT,
            name varchar(255) NOT NULL,
            description text,
            download_url varchar(255) DEFAULT NULL,
            image_url varchar(255) DEFAULT NULL,
            created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
            created_by int DEFAULT NULL,
            updated_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
            last_modified_by int DEFAULT NULL,
            PRIMARY KEY (id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
    `;

    const createSettingsTable = `
        CREATE TABLE IF NOT EXISTS settings (
            id INT UNSIGNED NOT NULL AUTO_INCREMENT,
            setting_key VARCHAR(255) NOT NULL,
            setting_value VARCHAR(255) NOT NULL,
            PRIMARY KEY (id),
            UNIQUE KEY setting_key (setting_key)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
    `;

    const connection = await pool.getConnection();
    try {
        await connection.query(createUsersTable);
        await connection.query(createWindowsAppsTable);
        await connection.query(createSettingsTable);
        console.log('Tables created or already exist');

        // Voeg een standaard admin-gebruiker toe als deze nog niet bestaat
        const [rows] = await connection.query('SELECT COUNT(*) as count FROM users WHERE username = "admin"');
        if (rows[0].count === 0) {
            const insertAdmin = `
                INSERT INTO users (username, password, first_name, last_name, email_address, isEnabled)
                VALUES ("admin", "$2a$10$6MIp/DwxHi29wF2337kHfuJ/XPxprJzH30VwqfZal9bKAifcDoK7e", "Admin", "User", "admin@example.com", true);
            `;
            await connection.query(insertAdmin);
            console.log('Default admin user created');
        } else {
            console.log('Admin user already exists');
        }

        // Voeg een standaard instelling toe om de registerpagina te beheren
        const [settingsRows] = await connection.query('SELECT COUNT(*) as count FROM settings WHERE setting_key = "registration_enabled"');
        if (settingsRows[0].count === 0) {
            const insertSetting = `
                INSERT INTO settings (setting_key, setting_value)
                VALUES ("registration_enabled", "0");
            `;
            await connection.query(insertSetting);
            console.log('Default setting for registration page created');
        } else {
            console.log('Setting for registration page already exists');
        }
    } catch (error) {
        console.error('Error creating tables:', error);
    } finally {
        connection.release();
    }
}

module.exports = { pool, createTables };
