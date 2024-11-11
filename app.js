const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const readingsRoutes = require("./routes/readings.js");
const wordsRoutes = require("./routes/words.js");

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  const message = "Welcome to the secret backend!";
  res.send(message);
});

app.use("/readings", readingsRoutes);
app.use("/words", wordsRoutes);

app.listen(8000, () => {
  console.log(`Server is running at http://localhost:8000`);
});

module.exports = app;
