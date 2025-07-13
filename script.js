
document.addEventListener("DOMContentLoaded", () => {
  let klassSelect = document.getElementById("klass");
  let ämneSelect = document.getElementById("ämne");
  let frågaSelect = document.getElementById("frågor");
  let questionContainer = document.getElementById("question-container");
  let feedback = document.getElementById("feedback");

  let frågor = [];

  fetch("https://raw.githubusercontent.com/1kuli1/skolquiz/main/questions.json")
    .then(response => {
      if (!response.ok) throw new Error("Kunde inte ladda frågefilen.");
      return response.json();
    })
    .then(data => {
      frågor = data.map(f => ({
        ...f,
        årskurs: f.årskurs.toString().trim(),
        ämne: f.ämne.trim()
      }));
      let klasser = [...new Set(frågor.map(q => q.årskurs))].sort();
      klasser.forEach(k => {
        let option = document.createElement("option");
        option.value = k;
        option.textContent = "Årskurs " + k;
        klassSelect.appendChild(option);
      });
    })
    .catch(err => {
      console.error("Fel vid inläsning:", err);
      feedback.textContent = "Det gick inte att läsa in frågorna. Kontrollera filen.";
      feedback.style.color = "red";
    });

  klassSelect.addEventListener("change", () => {
    ämneSelect.innerHTML = "<option disabled selected>Välj ämne</option>";
    frågaSelect.innerHTML = "";
    feedback.textContent = "";
    questionContainer.innerHTML = "";
    let valda = frågor.filter(q => q.årskurs === klassSelect.value);
    let ämnen = [...new Set(valda.map(q => q.ämne))].sort();
    ämnen.forEach(a => {
      let option = document.createElement("option");
      option.value = a;
      option.textContent = a;
      ämneSelect.appendChild(option);
    });
  });

  ämneSelect.addEventListener("change", () => {
    frågaSelect.innerHTML = "<option disabled selected>Välj fråga</option>";
    feedback.textContent = "";
    questionContainer.innerHTML = "";
    let valda = frågor.filter(q => q.årskurs === klassSelect.value && q.ämne === ämneSelect.value);
    valda.forEach((q, index) => {
      let option = document.createElement("option");
      option.value = index;
      option.textContent = q.fråga;
      frågaSelect.appendChild(option);
    });
  });

  window.visaFråga = () => {
    questionContainer.innerHTML = "";
    feedback.textContent = "";
    let valda = frågor.filter(q => q.årskurs === klassSelect.value && q.ämne === ämneSelect.value);
    let fråga = valda[frågaSelect.value];
    if (!fråga) {
      feedback.textContent = "Kunde inte hitta vald fråga.";
      feedback.style.color = "red";
      return;
    }
    let frågaEl = document.createElement("h2");
    frågaEl.textContent = fråga.fråga;
    questionContainer.appendChild(frågaEl);
    fråga.alternativ.forEach(alt => {
      let btn = document.createElement("button");
      btn.textContent = alt;
      btn.className = "alternativ-btn";
      btn.onclick = () => {
        if (alt === fråga.rätt_svar) {
          feedback.textContent = "Rätt svar!";
          feedback.style.color = "green";
        } else {
          feedback.textContent = "Fel svar, försök igen.";
          feedback.style.color = "red";
        }
      };
      questionContainer.appendChild(btn);
    });
  };
});
