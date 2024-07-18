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

// Functie om tabellen te creëren als ze niet bestaan
async function createTables() {
    const createUsersTable = `
        CREATE TABLE IF NOT EXISTS users (
            id bigint unsigned NOT NULL AUTO_INCREMENT,
            username varchar(255) NOT NULL,
            password varchar(255) NOT NULL,
            created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
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

    const connection = await pool.getConnection();
    try {
        await connection.query(createUsersTable);
        await connection.query(createWindowsAppsTable);
        console.log('Tables created or already exist');
    } catch (error) {
        console.error('Error creating tables:', error);
    } finally {
        connection.release();
    }
}

// Exporteer pool en createTables functie
module.exports = { pool, createTables };
