const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

app.use(cors()); 
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',      
    password: '',      
    database: 'ProDocDB'
});

db.connect((err) => {
    if (err) {
        console.error('❌ Error connecting to MySQL:', err);
        return;
    }
    console.log('✅ Connected to MySQL Database: ProDocDB');
});

// GET: Fetch all doctors (API route used by Axios)
app.get('/api/doctors', (req, res) => {
    const sql = "SELECT * FROM doctors";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// POST: Register a new doctor
app.post('/api/doctors/register', (req, res) => {
    const { name, email, specialization, experience, bio } = req.body;
    const sql = "INSERT INTO doctors (name, email, specialization, experience, bio) VALUES (?, ?, ?, ?, ?)";
    db.query(sql, [name, email, specialization, experience, bio], (err, result) => {
        if (err) return res.status(500).json({ error: "Failed to register doctor" });
        res.status(201).json({ message: "Doctor added!", id: result.insertId });
    });
});

// ROOT: Redirects to JSON data for easy verification
app.get('/', (req, res) => {
    const sql = "SELECT * FROM doctors";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: "Internal Server Error" });
        res.json(results);
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Backend running at http://localhost:${PORT}`);
});