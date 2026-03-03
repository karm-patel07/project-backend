const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }),
);

// MongoDB Connection (Only connect once)
let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  try {
    const db = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    isConnected = db.connections[0].readyState;
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
  }
};

// Schema
const reservationSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: Number, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
  },
  { collection: "rest" },
);

// Model
const Reservation =
  mongoose.models.Reservation ||
  mongoose.model("Reservation", reservationSchema);

// POST API
app.post("/api/reservation", async (req, res) => {
  await connectDB();

  try {
    const newReservation = new Reservation(req.body);
    await newReservation.save();

    res.status(201).json({
      success: true,
      message: "Reservation saved successfully!",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error saving data",
    });
  }
});

// GET API
app.get("/api/reservation", async (req, res) => {
  await connectDB();

  try {
    const data = await Reservation.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching data",
    });
  }
});

// Export for Vercel
module.exports = app;
