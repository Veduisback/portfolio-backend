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

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash"
    });

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: userMessage }]
        }
      ],
      systemInstruction: {
        role: "system",
        parts: [{
          text: "You are Vedang's portfolio assistant. Answer briefly."
        }]
      }
    });

    const reply = result.response.text();

    res.json({ reply });

  } catch (err) {
    console.error(err);
    res.json({ reply: "Server error" });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
