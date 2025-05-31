console.log("Script cargado correctamente");

document.getElementById("generar").addEventListener("click", async () => {
  console.log("Botón presionado");
  document.getElementById("log").textContent = "Cargando respuestas...."
  const prompt = document.getElementById("prompt").value;

  let respuestaCohere = "Sin respuesta de Cohere.";
  let respuestaMistral = "Sin respuesta de Mistral";
  let respuestaGemini = "Sin respuesta de Gemini.";

  try {
    const resCohere = await fetch("/api/cohere", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: prompt })
    });
    if (resCohere.ok) {
      const dataCohere = await resCohere.json();
      respuestaCohere = dataCohere.text || dataCohere.generations?.[0]?.text || respuestaCohere;
    }
  } catch (error) {
    console.error("Error al obtener respuesta de Cohere:", error);
  }

  try {
    const resMistral = await fetch("/api/mistral", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });

    if (resMistral.ok) {
      const dataMistral = await resMistral.json();
      respuestaMistral = dataMistral.choices?.[0]?.message?.content || respuestaMistral;
    }
  } catch (error) {
    console.error("Error al obtener respuesta de Mistral:", error);
  }


  try {
    const resGemini = await fetch("/api/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });
    if (resGemini.ok) {
      const dataGemini = await resGemini.json();
      respuestaGemini = dataGemini.candidates?.[0]?.content?.parts?.[0]?.text || respuestaGemini;
    }
  } catch (error) {
    console.error("Error al obtener respuesta de Gemini:", error);
  }

  document.getElementById("log").textContent = "Respuesta generadas."

  document.getElementById("respuestaGemini").textContent = `Gemini dice:\n${respuestaGemini}`;
  document.getElementById("respuestaCohere").textContent = `Cohere dice:\n${respuestaCohere}`;
  document.getElementById("respuestaMistral").textContent = `Mistral dice:\n${respuestaMistral}`;
});
