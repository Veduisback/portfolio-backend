import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST"]
}));

app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// Chat route
app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;
    console.log("User:", userMessage);

    if (!userMessage) {
      return res.json({ reply: "Empty message" });
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct",
        messages: [
          {
            role: "system",
            content: `You are Vedang's portfolio assistant.
Talk professionally and highlight:
- Unity Game Project
- Tax Detection System
- Marg Dristi navigation system`
          },
          {
            role: "user",
            content: userMessage
          }
        ]
      })
    });

    const data = await response.json();

    console.log("AI RAW RESPONSE:", JSON.stringify(data, null, 2));

    const reply =
      data.choices?.[0]?.message?.content ||
      data.error?.message ||
      "No response from AI";

    res.json({ reply });

  } catch (err) {
    console.error("ERROR:", err);
    res.json({ reply: "Server error. Try again later." });
  }
});

// Port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
