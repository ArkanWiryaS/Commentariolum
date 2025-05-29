import express from "express";

const app = express();

app.get("/api/notes", (req, res) => {
  res.send("you got 5 notes");
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(5001, () => {
  console.log("Server is running on port 5001");
});
