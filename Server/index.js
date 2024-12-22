const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const fs = require("fs");
const csvParser = require("csv-parser");

const app = express();
const PORT = 5000;

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);
app.options("*", cors());

app.use(bodyParser.json());

const { connectMongoDB } = require("./src/mongoDBconnect");
connectMongoDB("mongodb://127.0.0.1:27017/football")
  .then(() => console.log("MongoDB connected!"))
  .catch((err) => console.log("MongoDB error", err));

const Football = require("./src/schema");

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
app.get("/api/football/top-teams/:minWins", async (req, res) => {
  const { minWins } = req.params;

  // Parse minWins to an integer
  const minWinsNumber = parseInt(minWins, 10);

  // Check if minWinsNumber is a valid number
  if (isNaN(minWinsNumber)) {
    return res.status(400).json({ message: "Invalid 'minWins' parameter. Please provide a valid number." });
  }

  try {
    const teams = await Football.find({ win: { $gte: minWinsNumber } })
      .sort({ win: -1 }) // Sort by wins in descending order
      .limit(10); // Limit to top 10 teams

    if (teams.length === 0) {
      return res.status(404).json({ message: "No teams found with the given criteria" });
    }

    res.status(200).json(teams);
  } catch (error) {
    console.error("Error fetching teams:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// GET: Query teams with average goals greater than a given value for a specific year
app.get("/api/football/avg-goals/:year/:goalFor", async (req, res) => {
  const { year, goalFor } = req.params;
  try {
    const teams = await Football.aggregate([
      { $match: { year: parseInt(year) } },  // Match teams for the given year
      {
        $group: {
          _id: "$team",
          avgGoalsFor: { $avg: "$goalsFor" },  // Calculate average goalsFor
        },
      },
      { $match: { avgGoalsFor: { $gt: parseFloat(goalFor) } } },  // Filter teams with avgGoalsFor greater than the given value
    ]);
    res.status(200).json(teams);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST: Load data from CSV file
app.get("/api/football/load-csv", (req, res) => {
  const results = [];

  fs.createReadStream("./FootbalCSV.csv")
    .pipe(csvParser())
    .on("data", (row) => {
      results.push(row);
    })
    .on("end", async () => {
      try {
        // Insert all rows into MongoDB
        await FootballModel.insertMany(results);
        res.status(200).json({
          message: "CSV data successfully loaded into MongoDB",
          data: results,
        });
      } catch (error) {
        res.status(500).json({
          error: "Error inserting data into MongoDB",
          details: error.message,
        });
      }
    })
    .on("error", (err) => {
      res
        .status(500)
        .json({ error: "Error reading CSV file", details: err.message });
    });
});

app.listen(PORT, () => {
  console.log(`Server running on the PORT:${PORT}`);
});
