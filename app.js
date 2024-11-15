const express = require("express");
const bodyParser = require("body-parser");
const { validateAuthorization } = require("./middleware/authware");

const port = process.env.PORT || 4000;

const app = express();
const readingsRoutes = require("./routes/readings.js");
const wordsRoutes = require("./routes/words.js");
const userRoutes = require("./routes/user.js");
const bibleRoutes = require("./routes/bible.js");

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(validateAuthorization);

app.use((req, res, next) => {
  const now = new Date().toISOString();
  console.log(
    `\n[${now.split(".")[0].replace("T", " ")}] ${JSON.stringify(
      req.method
    )} ${JSON.stringify(req.url)} \n body: ${JSON.stringify(
      req.body
    )} \n tokenData: ${JSON.stringify(req.userData)}`
  );
  next();
});

app.get("/", (req, res) => {
  const message = "Welcome to the secret backend!";
  res.send(message);
});

app.use("/readings", readingsRoutes);
app.use("/words", wordsRoutes);
app.use("/user", userRoutes);
app.use("/bible", bibleRoutes);

app.listen(port, "0.0.0.0", () => {
  console.log(`Server is running at http://localhost:${port}`);
});

module.exports = app;
