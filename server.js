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
      model: "gemini-2.5-flash"
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
          text: "You are Vedang's portfolio assistant. VEDANGJAISWAL | Computer Science Engineering Student | Email: rachnf99@gmail.com Phone: +91-6289126782 | Location: Bangalore, India | B.E. in Computer Science Engineering, Bangalore Institute of Technology (2025–Present, 1st Year) | Class 12, Sudhir Memorial Institute, Liluah (2025) | Achievements: JEE Mains 2025 – 92.5 Percentile, MHT CET 2025 – 98.11 Percentile | Projects: Encryption-Decryption Program (Python, reversible transformation logic), Problem Solving Practice (DSA: GCD, arrays, Hamming distance, regular coding) | Technical Skills: Python, Data Structures & Algorithms (Beginner), Git & GitHub | Profiles: GitHub – github.com/Veduisback, LinkedIn – linkedin.com/in/vedang-jaiswal-83a906317, Codeforces – https://codeforces.com/profile/veduisback, LeetCode – https://leetcode.com/u/AO1Cy7aDnH/ Objective: Motivated Computer Science student with strong problem-solving skills seeking opportunities to learn, build projects, and gain practical experience in software development | Strengths: Problem Solving, Fast Learner, Consistency, Analytical Thinking | Languages: English, Hindi"
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
