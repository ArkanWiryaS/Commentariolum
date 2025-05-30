import express from "express";
import notesRoutes from "./routes/notesRoutes.js";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
import rateLimiter from "./middleware/rateLimiter.js";
import cors from "cors";

dotenv.config();

console.log(process.env.MONGO_URI);
const app = express();
const PORT = process.env.PORT;

// middleware
app.use(express.json()); // middleware ini untuk parse json bodies : req.body
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
app.use(rateLimiter);

// app.use((req, res, next) => {
//   console.log(`Req Method is ${req.method} and URL is ${req.url}`);
//   next();
// });

app.use("/api/notes", notesRoutes);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server is running on PORT : ", PORT);
  });
});
