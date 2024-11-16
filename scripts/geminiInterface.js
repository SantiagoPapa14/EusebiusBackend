const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

let geminiAPIKey = process.env.GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(geminiAPIKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function primeConversation(history, words) {
  const primer = `Hello gemini, we will pretend that you are a latin professor (not a priest) in the "Eusebius Catholic Monastery". You must be ready to answer any doubts about the latin language, its grammar, cases, etc. It is important that you do not make your answers very long, and always be friendly torwards the student, try to include emojis in your answers. You should not greet the student in the message, this is not the first message in the conversation. You will be given a list of words that the student knows, whenever possible try to vinculate your response with these words, but do not force them into the response. Here are the words: ${JSON.stringify(
    words.map((word) => word.word)
  )}`;
  history.push(`You: ${primer}`);
  const result = await model.generateContent([history.join("\n")]);
  const responseText = result.response.text();
  history.push(`Model: ${responseText}`);
}

async function sendMessage(newPrompt, history, words = []) {
  if (history.length === 0) {
    await primeConversation(history, words);
  }
  history.push(`You: ${newPrompt}`);
  const result = await model.generateContent([history.join("\n")]);
  const responseText = result.response.text();
  history.push(`Model: ${responseText}`);
  return responseText;
}

module.exports = sendMessage;
