const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config({
  path: path.join(__dirname, "config", "config.env"),
});

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }),
);
//Reservation;
// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Schema + Model
const reservationSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    email: String,
    phone: Number,
    date: String,
    time: String,
  },
  { collection: "rest" },
);

const Reservation = mongoose.model("", reservationSchema);

// POST API
app.post("/api/reservation", async (req, res) => {
  try {
    const newReservation = new Reservation(req.body);
    await newReservation.save();
    res.json({ success: true, message: "Reservation saved successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error saving data" });
  }
});

// GET API
app.get("/api/reservation", async (req, res) => {
  const data = await Reservation.find();
  res.json(data);
});

// Server
app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT || 5000}`),
);
