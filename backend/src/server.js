// backend/src/server.js
import express from "express";
import notesRoutes from "./routes/notesRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
import rateLimiter from "./middleware/rateLimiter.js";
import cors from "cors";
import path from "path";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: [
      "https://202.74.74.144",
      "http://202.74.74.144",
      "http://localhost:5173",
    ],
    credentials: true,
  })
);
app.use(rateLimiter);

// API Routes
app.use("/api/notes", notesRoutes);
app.use("/api/categories", categoryRoutes);

// Production static files
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
  });
}

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server is running on PORT:", PORT);
  });
});
