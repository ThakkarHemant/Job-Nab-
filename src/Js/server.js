const express = require("express");
const mysql = require("mysql");
const multer = require("multer");
const cors = require("cors");
const bcrypt = require("bcrypt"); // For hashing passwords
const path = require("path");

const app = express();
const port = 3000;

// Enable CORS
app.use(cors());

// Body parser middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set up multer for file upload
const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(pdf|doc|docx)$/)) {
      return cb(new Error("Only PDF, DOC, and DOCX files are allowed"));
    }
    cb(null, true);
  },
});

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "jobnab",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to database:", err);
    return;
  }
  console.log("Connected to MySQL database");
});

// Route to handle signup (registration)
app.post("/signup", upload.single("resume"), (req, res) => {
  const { name, email, phone, password, domain } = req.body;
  const resume = req.file;

  // Check if required fields are provided
  if (!name || !email || !password || !phone || !resume) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Hash the password
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      return res.status(500).json({ message: "Error hashing password" });
    }

    // SQL query to insert data into the database
    const sql = "INSERT INTO users (first_name, email, password, phone, domain, resume) VALUES (?, ?, ?, ?, ?, ?)";
    const values = [name, email, hashedPassword, phone, domain, resume.filename];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error("Error inserting into database:", err.message); // More detailed error logging
        return res.status(500).json({ message: "Error inserting into database", error: err.message });
      }
      console.log("Insert successful:", result);
      res.status(200).json({ message: "User registered successfully" });
    });
  });
});

// Route to handle login
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please provide email and password" });
  }

  // SQL query to get the user based on email
  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], (err, result) => {
    if (err) {
      console.error("Database error:", err.message);
      return res.status(500).json({ message: "Error querying database", error: err.message });
    }

    if (result.length === 0) {
      return res.status(401).json({ message: "User not found" });
    }

    // Compare hashed password with the one from the database
    bcrypt.compare(password, result[0].password, (err, isMatch) => {
      if (err) {
        return res.status(500).json({ message: "Error comparing passwords", error: err.message });
      }

      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Successful login
      res.status(200).json({ message: "Login successful", user: result[0] });
    });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
