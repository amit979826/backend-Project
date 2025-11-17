require('dotenv').config();
const express = require('express');
const { sequelize } = require('./config/db');
const app = express();
app.use(express.json());

// routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/user', require('./routes/userRoutes'));
app.use('/api/store', require('./routes/storeRoutes'));

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await sequelize.authenticate();
    console.log("DB Connected");

    // 🚨 IMPORTANT: This creates ALL TABLES
    await sequelize.sync({ force: true }); 
    // if you want to keep old data use: alter: true

    console.log("Tables created");

    app.listen(PORT, () => console.log("Server running on " + PORT));
  } catch (err) {
    console.error("Failed to start", err);
  }
}

start();
