import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.json());

// Servir frontend
app.use(express.static("public"));

// CORS (si accedes desde otra URL externa, por ejemplo desde localhost)
app.use((_, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// Ruta Gemini
app.post("/api/gemini", async (req, res) => {
  const { prompt } = req.body;
  const body = {
    contents: [{ parts: [{ text: prompt }] }]
  };

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.API_KEY1}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Error en Gemini", detail: err.message });
  }
});

// Ruta Cohere
app.post("/api/cohere", async (req, res) => {
  const { prompt } = req.body;
  const body = {
    message: prompt,
    model: "command-r-plus",
    temperature: 0.7
  };

  try {
    const response = await fetch("https://api.cohere.ai/v1/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.COHERE_API_KEY}`,
        "Cohere-Version": "2022-12-06"
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Error en Cohere", detail: err.message });
  }
});

// Ruta Hugging Face
app.post("/api/huggingface", async (req, res) => {
  const { prompt } = req.body;
  const body = {
    inputs: prompt,
    parameters: {
      max_new_tokens: 100,
      temperature: 0.7
    }
  };

  try {
    const response = await fetch("https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": process.env.API_KEY3
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Error en Hugging Face", detail: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
