document.getElementById("generar").addEventListener("click",async()=>{
const API_KEY = "AIzaSyDQsUtn0MsaxqHSCX72sfEIGVfyUkVw7GM";
const endpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + API_KEY;
 

const prompt = document.getElementById("prompt").value

const body = {
  contents: [
    {
      parts: [{ text: prompt }]
    }
  ]
};

fetch(endpoint, {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify(body)
})
  .then(res => res.json())
  .then(data => {
    const response = data.candidates?.[0]?.content?.parts?.[0]?.text;
     document.getElementById("tituloRespuesta").style.display = "block";
    document.getElementById("respuesta").textContent = ` ${response}`;

    
  })
  .catch(err => {
    console.error("❌ Error al llamar a Gemini:", err);
  });



})