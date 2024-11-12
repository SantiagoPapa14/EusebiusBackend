const express = require("express");
const bodyParser = require("body-parser");

const port = process.env.PORT || 4000;

const app = express();
const readingsRoutes = require("./routes/readings.js");
const wordsRoutes = require("./routes/words.js");
const userRoutes = require("./routes/user.js");

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  const now = new Date().toISOString();
  console.log(`[${now}] ${req.method} ${req.url} ${req.body}`);
  next(); // Pass control to the next middleware/route handler
});

app.get("/", (req, res) => {
  const message = "Welcome to the secret backend!";
  res.send(message);
});

app.use("/readings", readingsRoutes);
app.use("/words", wordsRoutes);
app.use("/user", userRoutes);

app.listen(port, "0.0.0.0", () => {
  console.log(`Server is running at http://localhost:${port}`);
});

module.exports = app;
