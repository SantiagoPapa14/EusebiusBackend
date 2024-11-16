const { queryDatabase } = require("../managers/pgAsyncManager");

const express = require("express");
const sendMessage = require("../scripts/geminiInterface");
const router = express.Router();
router.use(express.json());

router.post("/sendMessage", async (req, res) => {
  const { message, history } = req.body;
  if (!message) {
    res.json({ message: "Missing message." });
    return;
  }
  try {
    if (history.length === 0) {
      const words = await queryDatabase(
        `SELECT * FROM "Word" WHERE "userId" = $1`,
        [req.userData.id]
      );
      const answer = await sendMessage(message, history, words);
      res.json({ response: answer });
    } else {
      const answer = await sendMessage(message, history);
      res.json({ response: answer });
    }
  } catch (e) {
    console.log(e);
    res.json({
      response:
        "Sorry, the server is overloaded right now and I can't answer, please text me back later 😔",
    });
  }
});

module.exports = router;
