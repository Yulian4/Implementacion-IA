
const api1 = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY1}`;
const api2 = "https://api.openai.com/v1/chat/completions";
const api3 = "https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta";


document.getElementById("generar").addEventListener("click", obtenerRespuesta);

async function obtenerRespuesta() {
  try {
    const prompt = document.getElementById("prompt").value;

    const bodyGemini = {
      contents: [
        {
          parts: [{ text: prompt }]
        }
      ]
    };

    // const bodyChatGPT = {
    //   model: "gpt-3.5-turbo",
    //   messages: [{ role: "user", content: prompt }],
    //   temperature: 0.7
    // };
    const bodyHuggin = {
      inputs: prompt,
      parameters: {
        max_new_tokens: 100,
        temperature: 0.7
      }
    };

    const [resGemini, resHuggin] = await Promise.all([
      fetch(api1, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(bodyGemini)
      }),
      // fetch(api2, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: `Bearer ${API_KEY2}`
      //   },
      //   body: JSON.stringify(bodyChatGPT)
      // }),
      fetch(api3, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": API_KEY3
        },
         body: JSON.stringify(bodyHuggin)
      })
    ]);

    const dataGemini = await resGemini.json();
    // const dataChatGPT = await resChatGPT.json();
    const dataHuggin = await resHuggin.json();

    const respuestaGemini = dataGemini.candidates?.[0]?.content?.parts?.[0]?.text || "Sin respuesta de Gemini.";
    // const respuestaChatGPT = dataChatGPT.choices?.[0]?.message?.content || "Sin respuesta de ChatGPT.";
    const respuestaHuggin = dataHuggin?.[0]?.generated_text || "Sin respuesta de Hugging Face."; 
    const respuestaChatGPT  =0;
     document.getElementById("respuestaGemini").textContent = `Gemini dice:\n${respuestaGemini}`;
    document.getElementById("respuestaChatGPT").textContent = `ChatGPT dice:\n${respuestaChatGPT}`;
    document.getElementById("respuestaHuggin").textContent = `Hugging Face dice:\n${respuestaHuggin}`;

  } catch (error) {
    console.error("No se pudo obtener resultados:", error.message);
    document.getElementById("respuestaGemini").textContent = "Error en Gemini.";
    document.getElementById("respuestaChatGPT").textContent = "Error en ChatGPT.";
    document.getElementById("respuestaHuggin").textContent = "Error en Hugging Face.";
  }
}
