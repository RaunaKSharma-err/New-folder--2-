const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const fs = require("fs");
const csvParser = require("csv-parser");

// Initialize the app
const app = express();
const PORT = 5000;

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173", // Allow only the frontend to access the backend
    methods: ["GET", "POST", "PUT", "DELETE"], // Allow these HTTP methods
    allowedHeaders: ["Content-Type"], // Allow these headers
  })
);
app.options("*", cors()); // This handles preflight OPTIONS requests

app.use(bodyParser.json());

// MongoDB connection setup
const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/football", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};
connectDB();

// Mongoose Schema and Model
const footballSchema = new mongoose.Schema({
  team: { type: String, required: true },
  gamesPlayed: { type: Number, required: true },
  win: { type: Number, required: true },
  draw: { type: Number, required: true },
  loss: { type: Number, required: true },
  goalsFor: { type: Number, required: true },
  goalsAgainst: { type: Number, required: true },
  points: { type: Number, required: true },
  year: { type: Number, required: true },
});

const Football = mongoose.model("Football", footballSchema);

// Routes

// POST: Add a new record
app.post("/api/football/add", async (req, res) => {
  const {
    team,
    gamesPlayed,
    win,
    draw,
    loss,
    goalsFor,
    goalsAgainst,
    points,
    year,
  } = req.body;
  try {
    const newFootballRecord = new Football({
      team,
      gamesPlayed,
      win,
      draw,
      loss,
      goalsFor,
      goalsAgainst,
      points,
      year,
    });
    await newFootballRecord.save();
    res.status(201).json(newFootballRecord);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST: Update a record
app.post("/api/football/update", async (req, res) => {
  const {
    team,
    gamesPlayed,
    win,
    draw,
    loss,
    goalsFor,
    goalsAgainst,
    points,
    year,
  } = req.body;
  try {
    const updatedRecord = await Football.findOneAndUpdate(
      { team, year },
      {
        gamesPlayed,
        win,
        draw,
        loss,
        goalsFor,
        goalsAgainst,
        points,
      },
      { new: true }
    );
    res.status(200).json(updatedRecord);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST: Delete a record
app.post("/api/football/delete", async (req, res) => {
  const { team, year } = req.body;
  try {
    const deletedRecord = await Football.findOneAndDelete({ team, year });
    res.status(200).json(deletedRecord);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET: Query total games played, draws, and wins for a given year
app.get("/api/football/summary/:year", async (req, res) => {
  const { year } = req.params;
  try {
    const summary = await Football.aggregate([
      { $match: { year: parseInt(year) } },
      {
        $group: {
          _id: null,
          totalGamesPlayed: { $sum: "$gamesPlayed" },
          totalDraws: { $sum: "$draw" },
          totalWins: { $sum: "$win" },
        },
      },
    ]);
    res.status(200).json(summary);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET: Query top 10 teams with "won" greater than a given value
app.get("/api/football/top-teams/:won", async (req, res) => {
  const { won } = req.params;
  try {
    const teams = await Football.find({ win: { $gt: parseInt(won) } }).limit(
      10
    );
    res.status(200).json(teams);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET: Query teams with average goals greater than a given value for a specific year
app.get("/api/football/avg-goals/:year/:goalFor", async (req, res) => {
  const { year, goalFor } = req.params;
  try {
    const teams = await Football.aggregate([
      { $match: { year: parseInt(year) } },
      {
        $group: {
          _id: "$team",
          avgGoalsFor: { $avg: "$goalsFor" },
        },
      },
      { $match: { avgGoalsFor: { $gt: parseInt(goalFor) } } },
    ]);
    res.status(200).json(teams);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST: Load data from CSV file
app.get("/api/football/load-csv", (req, res) => {
  const results = [];

  // Read and parse the CSV file
  fs.createReadStream(csvFilePath)
    .pipe(csvParser())
    .on("data", (row) => {
      results.push(row);
    })
    .on("end", () => {
      // Send the parsed data as a JSON response
      res.json(results);
    })
    .on("error", (err) => {
      // Handle file reading errors
      res
        .status(500)
        .json({ error: "Error reading CSV file", details: err.message });
    });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on the PORT:${PORT}`);
});
