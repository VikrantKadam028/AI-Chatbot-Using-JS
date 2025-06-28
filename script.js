const userInput = document.querySelector(".input input");
const btn = document.querySelector(".input button");
const output = document.querySelector(".output p");
const outputDiv = document.querySelector(".output");
const tableBody = document.getElementById("tableBody");

let srno = 1;

btn.addEventListener("click", () => {
    outputDiv.style.display = "flex";
    outputDiv.style.height = "50px";
  output.innerHTML =
    "<i class='fa-solid fa-spinner fa-spin' style='color: black;'></i> Generating content, please wait...";
  getData();
});

window.onload = () => {
  loadFromLocalStorage();
};

async function getData() {
  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyDSGy7RDlFf_YzKXF4DtKrroCUmofQg1yg",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: userInput.value,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();
    const botText =
      data.candidates?.[0]?.content?.parts?.[0]?.text || "No reply from Gemini";

    const cleanText = formatMarkdown(botText);
    let prompt = userInput.value;
    let outputResponse = cleanText;
    localStorage.setItem(prompt, outputResponse);
    addRow(prompt, outputResponse);
    // outputDiv.style.display = "flex";
    outputDiv.style.height = "400px";
    output.innerHTML = cleanText;
  } catch (error) {
    output.innerHTML = "Error: " + error.message;
  }
}

function addRow(prompt, response) {
  const row = document.createElement("tr");
  row.innerHTML = `
    <th scope="row">${srno}</th>
    <td>${prompt}</td>
    <td>${response}</td>
  `;
  tableBody.appendChild(row);
  srno++; 
}

function loadFromLocalStorage() {
  for (let i = 0; i < localStorage.length; i++) {
    let key = localStorage.key(i); // prompt
    let value = localStorage.getItem(key); 
    addRow(key, value);
  }
}

function formatMarkdown(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
    .replace(/\n/g, "<br>")
    .replace(/^\* /gm, "~,* ");
}
