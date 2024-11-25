const express = require("express");
const mysql = require("mysql");
const app = express();
const port = 3000;

const db = mysql.createConnection({
    host: "localhost",     
    user: "root",          
    password: "password",  
    database: "smart_parking"
});

db.connect((err) => {
    if (err) throw err;
    console.log("Connected to MySQL database");
});

app.use(express.json());

app.post("/save-count", (req, res) => {
    const { date, count } = req.body;
    const query = `
        INSERT INTO car_counts (date, count)
        VALUES (?, ?)
        ON DUPLICATE KEY UPDATE count = count + VALUES(count);
    `;
    db.query(query, [date, count], (err, result) => {
        if (err) throw err;
        res.send({ success: true, result });
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
