import express from "express";
import notesRoutes from "./routes/notesRoutes.js";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";

dotenv.config();

console.log(process.env.MONGO_URI);
const app = express();
const PORT = process.env.PORT;

connectDB();
app.use(express.json());
app.use("/api/notes", notesRoutes);

app.listen(PORT, () => {
  console.log("Server is running on PORT : ", PORT);
});
