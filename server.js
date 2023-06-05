const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const dbPath = path.join(__dirname, "balances.db");
console.log("Using database file at:", dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error opening the database:", err.message);
  } else {
    console.log("Connected to the database");
  }
});

app.use(cors());
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Log each request
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} to ${req.url}`);
  next();
});

app.get("/balances/range", (req, res) => {
  const start = req.query.start;
  const end = req.query.end;

  // Validate input
  if (!start || !end) {
    res.status(400).json({ error: "Please provide 'start' and 'end' query parameters in UNIX timestamp format." });
    return;
  }

  db.all("SELECT * FROM balances WHERE blockTime BETWEEN ? AND ?", [start, end], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      balances: rows,
    });
  });
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
