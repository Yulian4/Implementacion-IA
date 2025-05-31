document.getElementById("generar").addEventListener("click", obtenerRespuesta);

async function obtenerRespuesta() {
  const prompt = document.getElementById("prompt").value;

  const [resGemini, resCohere, resHuggin] = await Promise.all([
    fetch("/api/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    }),
    fetch("/api/cohere", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    }),
    fetch("/api/huggingface", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    })
  ]);

  const dataGemini = await resGemini.json();
  const dataCohere = await resCohere.json();
  const dataHuggin = await resHuggin.json();

  const respuestaGemini = dataGemini.candidates?.[0]?.content?.parts?.[0]?.text || "Sin respuesta de Gemini.";
  const respuestaCohere = dataCohere.text || "Sin respuesta de Cohere.";
  const respuestaHuggin = dataHuggin?.[0]?.generated_text || "Sin respuesta de Hugging Face.";

  document.getElementById("respuestaGemini").textContent = `Gemini dice:\n${respuestaGemini}`;
  document.getElementById("respuestaCohere").textContent = `Cohere dice:\n${respuestaCohere}`;
  document.getElementById("respuestaHuggin").textContent = `Hugging Face dice:\n${respuestaHuggin}`;
}
