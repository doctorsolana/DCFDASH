const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require('fs');
const https = require('https');

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

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} to ${req.url}`);
  next();
});

app.get("/balances/range", (req, res) => {
  const start = req.query.start;
  const end = req.query.end;

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



app.get("/latest-date", (req, res) => {
  const query = `SELECT MAX(blockTime) as latest_block_time FROM balances`;

  db.get(query, (err, row) => {
    if (err) {
      res.status(500).send({ error: "Error fetching data", details: err.message });
      return;
    }

    res.status(200).send({ latestBlockTime: row.latest_block_time });
  });
});



const privateKey = fs.readFileSync('', 'utf8');
const certificate = fs.readFileSync('', 'utf8');
const ca = fs.readFileSync('', 'utf8');


const credentials = {
  key: privateKey,
  cert: certificate,
  ca: ca,
};

const port = process.env.PORT || 3003;
const httpsServer = https.createServer(credentials, app);

httpsServer.listen(port, () => {
  console.log(`HTTPS Server running on port ${port}`);
});


