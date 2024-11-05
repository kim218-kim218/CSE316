/** 
  name: Nahyun Kim
  email: nahyun.kim.4@stonybrook.edu
**/

// server.js
const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3001;

app.use(express.json());
require('dotenv').config();

// MySQL 
const db = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE 
});

db.connect(err => {
    if (err) {
        console.error('MySQL is NOT CONNECTED:', err);
        return;
    }
    console.log('MySQL is CONNCECTED.');

    // create facilities table query
    const createFacilitiesTable = `
    CREATE TABLE IF NOT EXISTS facilities (
        id INT AUTO_INCREMENT PRIMARY KEY,
        facility_name VARCHAR(255) NOT NULL,
        facility_description TEXT,
        image_source VARCHAR(255),
        available_days VARCHAR(255),
        min_capacity INT,
        max_capacity INT,
        location VARCHAR(50),
        only_for_suny BOOLEAN DEFAULT FALSE
    );
    `;

    db.query(createFacilitiesTable, (err, result) => {
        if (err) {
            console.error("facilities table err:", err);
            return;
        }
        console.log("facilities is created.");
    });
});

app.get('/', (req, res) => {
    res.send('Server is open');
});

app.listen(port, () => {
    console.log(`Server at ${port}.`);
});
