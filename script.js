document.addEventListener("DOMContentLoaded", () => {
  let klassSelect = document.getElementById("klass");
  let ämneSelect = document.getElementById("ämne");
  let frågaSelect = document.getElementById("frågor");
  let questionContainer = document.getElementById("question-container");
  let feedback = document.getElementById("feedback");

  let frågor = [];

  fetch("frågebank_skolan.json")
    .then((response) => response.json())
    .then((data) => {
      frågor = data;
      let klasser = [...new Set(frågor.map(q => q.årskurs))].sort();
      klasser.forEach(k => {
        let option = document.createElement("option");
        option.value = k;
        option.textContent = "Årskurs " + k;
        klassSelect.appendChild(option);
      });
    });

  klassSelect.addEventListener("change", () => {
    ämneSelect.innerHTML = "";
    frågaSelect.innerHTML = "";
    let valda = frågor.filter(q => q.årskurs === klassSelect.value);
    let ämnen = [...new Set(valda.map(q => q.ämne))];
    ämnen.forEach(a => {
      let option = document.createElement("option");
      option.value = a;
      option.textContent = a;
      ämneSelect.appendChild(option);
    });
  });

  ämneSelect.addEventListener("change", () => {
    frågaSelect.innerHTML = "";
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
    if (!fråga) return;

    let frågaEl = document.createElement("h2");
    frågaEl.textContent = fråga.fråga;
    questionContainer.appendChild(frågaEl);

    fråga.alternativ.forEach(alt => {
      let btn = document.createElement("button");
      btn.textContent = alt;
      btn.className = "alternativ-btn";
      btn.onclick = () => {
        feedback.textContent = alt === fråga.rätt_svar ? "Rätt svar!" : "Fel svar, försök igen.";
        feedback.style.color = alt === fråga.rätt_svar ? "green" : "red";
      };
      questionContainer.appendChild(btn);
    });
  };
});
