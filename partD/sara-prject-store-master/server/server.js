require("dotenv").config();
const path = require('path');
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const initializeDB = require("./config/dbConn");
const corsConfig = require("./config/corsOption");

const server = express();

const PORT = process.env.PORT || 2000;

// התחברות למסד MongoDB
initializeDB();

// הגדרת מדיניות CORS מותאמת
server.use(cors(corsConfig));

// תמיכה בפריסת JSON בבקשות
server.use(express.json());

// הגדרת תיקיית קבצים סטטיים לשרת
server.use(express.static("public"));

// מסלול ראשי בסיסי
server.get("/", (req, res) => {
  res.send("Welcome to the main page");
});

// הגדרת מסלולים תחת /api/suppliers
server.use('/api/suppliers', require('./routes/vendorRoute'));

// טיפול בכל שאר המסלולים לשליחת ה-React build
server.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// מאזינים לאירועים של מסד הנתונים
mongoose.connection.once("open", () => {
  console.log("Database connected successfully");
  server.listen(PORT, () => {
    console.log(`Server is up and running on port ${PORT}`);
  });
});

mongoose.connection.on("error", (error) => {
  console.error("********** MongoDB connection error **********");
  console.error(error);
});
