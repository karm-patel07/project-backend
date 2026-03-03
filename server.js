// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*", // allow all if not set
    credentials: true,
  }),
);

// MongoDB Connection (singleton)
let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  try {
    const db = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    isConnected = db.connections[0].readyState;
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    throw error;
  }
};

// Reservation Schema
const reservationSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true }, // changed to String
    date: { type: String, required: true },
    time: { type: String, required: true },
  },
  { collection: "rest" },
);

// Reservation Model
const Reservation =
  mongoose.models.Reservation ||
  mongoose.model("Reservation", reservationSchema);

// POST API - Create Reservation
app.post("/api/reservation", async (req, res) => {
  try {
    await connectDB();

    const newReservation = new Reservation(req.body);
    await newReservation.save();

    res.status(201).json({
      success: true,
      message: "Reservation saved successfully!",
    });
  } catch (error) {
    console.error("Reservation POST Error:", error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// GET API - Get All Reservations
app.get("/api/reservation", async (req, res) => {
  try {
    await connectDB();

    const reservations = await Reservation.find();
    res.status(200).json(reservations);
  } catch (error) {
    console.error("Reservation GET Error:", error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Export for Vercel
module.exports = app;
