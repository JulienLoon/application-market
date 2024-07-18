// /index.js

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { createTables } = require('./config/database');  // Importeer createTables functie
const authRoutes = require('./routes/auth');
const appsRoutes = require('./routes/apps');
const usersRoutes = require('./routes/users');

const app = express();
const PORT = 8080;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204
}));

// Trust proxy settings if behind a reverse proxy (e.g., Nginx)
app.set('trust proxy', true);

// Gebruik routes
app.use('/api/auth', authRoutes);
app.use('/api/apps', appsRoutes);
app.use('/api/users', usersRoutes);

// Functie om tabellen te creëren en de server te starten
async function startServer() {
    await createTables();
    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
}

// Start de server
startServer();