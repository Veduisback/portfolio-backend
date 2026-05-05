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
      model: "models/gemini-1.5-flash"
    });

    const prompt = `
You are Vedang's portfolio assistant.
Talk professionally and highlight:
- Unity Game Project
- Tax Detection System
- Marg Dristi navigation system

User: ${userMessage}
`;

    const result = await model.generateContent(prompt);
    const reply = result.response.text();

    res.json({ reply });

  } catch (err) {
    console.error("ERROR:", err);
    res.json({ reply: "Server error. Try again later." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
