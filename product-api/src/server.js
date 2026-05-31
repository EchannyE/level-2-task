import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";

// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

// Set the port
const PORT = process.env.PORT || 5000;

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// home route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Product Catalog API is running"
  });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);


// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});