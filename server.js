import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = process.env.PORT || 3000;


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());

app.post('/api/cohere', async (req, res) => {
    const { message } = req.body;
    try {
        const response = await fetch('https://api.cohere.ai/v1/chat', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.COHERE_API_KEY}`,
                'Content-Type': 'application/json',
                'Cohere-Version': '2022-12-06'
            },
            body: JSON.stringify({
                message,
                model: 'command-r-plus',
                temperature: 0.7
            })
        });
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener respuesta de Cohere.' });
    }
});

app.post('/api/mistral', async (req, res) => {
    const { prompt } = req.body;
    try {
        const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.API_KEY3}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "mistral-medium",  
                messages: [{ role: "user", content: prompt }],
                temperature: 0.7,
                max_tokens: 200
            })
        });
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error("Error en Mistral:", error);
        res.status(500).json({ error: 'Error al obtener respuesta de Mistral.' });
    }
});

app.post('/api/gemini', async (req, res) => {
    const { prompt } = req.body;

    const bodyGemini = {
        contents: [
            {
                parts: [{ text: prompt }]
            }
        ]
    };

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bodyGemini)
        });

        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener respuesta de Gemini.' });
    }
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY);
console.log('COHERE_API_KEY:', process.env.COHERE_API_KEY);
console.log('API_KEY3:', process.env.API_KEY3);