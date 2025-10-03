import express from "express";
import authRoutes from "./routes/authRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import subCategoryRoutes from "./routes/subCategoryRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import testSessionRoutes from "./routes/testSessionRoutes.js";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
// import rateLimiter from "./middleware/rateLimiter.js"; // DISABLED - Redis not configured
import cors from "cors";

dotenv.config();

console.log(process.env.MONGO_URI);
const app = express();
const PORT = process.env.PORT || 5001;

// middleware
app.use(express.json()); // middleware ini untuk parse json bodies : req.body
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
// app.use(rateLimiter); // DISABLED - Redis not configured

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/subcategories", subCategoryRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/test-sessions", testSessionRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ message: "SNBT Tryout API is running!" });
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("🚀 Server is running on PORT:", PORT);
    console.log("📚 SNBT Tryout API Ready!");
  });
});
