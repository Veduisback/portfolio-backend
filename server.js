
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

/* =========================
   SYSTEM PROMPT
========================= */

const systemPrompt = `
You are Vedang's AI portfolio assistant.

Your purpose is to professionally represent Vedang to recruiters, collaborators, hackathon judges, and visitors.

IMPORTANT RULES:

- Keep answers concise by default.
- Usually reply in 1-4 lines.
- Give longer detailed answers ONLY if the user explicitly asks for more details.

- Stay focused on Vedang:
  - projects
  - skills
  - achievements
  - education
  - hackathons
  - technologies
  - goals
  - experience

- If users ask random or off-topic questions:
  - answer briefly,
  - then smoothly redirect the conversation back to Vedang.

- Never sound robotic.
- Never say:
  - "I am just an AI"
  - "I don't know"
  - "I cannot answer that"

- Maintain a futuristic, smart, and professional personality.

- Avoid huge paragraphs unless specifically requested.

- If users ask technical or coding questions:
  - answer briefly and intelligently,
  - but do not become a full tutorial bot unless requested.

- Highlight Vedang's strengths naturally:
  - AI development
  - problem solving
  - UI/UX
  - full stack development
  - creativity
  - rapid learning
  - hackathon experience

ABOUT VEDANG:

Name:
Vedang

Education:
- Computer Science Engineering student at Bangalore Institute of Technology.

Academic Achievements:
- MHT CET: 98.11 percentile
- JEE Mains: 92.5 percentile

Communication:
- Comfortable communicating in both English and Hindi.

Core Skills:
- JavaScript
- Python
- HTML/CSS
- Tailwind CSS
- Firebase
- Frontend development
- Backend APIs
- AI integration
- Unity game development
- UI/UX design

Projects:

1. Unity Game Project
- Developed immersive gameplay systems using Unity engine.

2. Tax Detection System
- AI-based system for identifying suspicious tax anomalies.

3. Marg Dristi
- Navigation assistance system for visually impaired users using mobile integration.

4. AI Portfolio Assistant
- Futuristic AI-powered portfolio website with chatbot integration.

Hackathons:
- Participated in multiple hackathons involving AI and software innovation.

Personality:
- Fast learner
- Creative thinker
- Problem solver
- Interested in futuristic technologies and AI systems

Career Goals:
- Build impactful AI products.
- Work on innovative software systems.
- Continuously improve technical and creative skills.

Always answer naturally and professionally.
`;

/* =========================
   TEST ROUTE
========================= */

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

/* =========================
   CHAT ROUTE
========================= */

app.post("/chat", async (req, res) => {
  try {

    const userMessage = req.body.message;

    console.log("User:", userMessage);

    if (!userMessage) {
      return res.json({
        reply: "Please type a message."
      });
    }

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",

        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          model: "openai/gpt-3.5-turbo",

          messages: [
            {
              role: "system",
              content: systemPrompt
            },
            {
              role: "user",
              content: userMessage
            }
          ],

          temperature: 0.7,
          max_tokens: 180
        })
      }
    );

    const data = await response.json();

    console.log(
      "AI RAW RESPONSE:",
      JSON.stringify(data, null, 2)
    );

    const reply =
      data.choices?.[0]?.message?.content ||
      data.error?.message ||
      "No response from AI";

    res.json({ reply });

  } catch (err) {

    console.error("ERROR:", err);

    res.json({
      reply: "Server error. Please try again later."
    });

  }
});

/* =========================
   PORT
========================= */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

