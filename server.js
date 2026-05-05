import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST"]
}));

app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!userMessage) {
      return res.json({ reply: "Empty message" });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-latest"
    });

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{
            text: "You are Vedang's portfolio assistant. Speak professionally and highlight his projects like Unity game, Tax Detection system, and Marg Dristi navigation system."
          }]
        }
      ]
    });

    const result = await chat.sendMessage(userMessage);
    const reply = result.response.text();

    res.json({ reply });

  } catch (err) {
    console.error("ERROR:", err?.response?.data || err.message || err);

    res.json({
      reply: "Server error. Try again later."
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
