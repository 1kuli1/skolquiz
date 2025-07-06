let questions = [];

fetch('frågebank_skolan.json')
  .then(response => response.json())
  .then(data => {
    questions = data;
  });

document.getElementById('year').addEventListener('change', updateQuestionList);
document.getElementById('subject').addEventListener('change', updateQuestionList);

function updateQuestionList() {
  const year = document.getElementById('year').value;
  const subject = document.getElementById('subject').value;
  const questionSelect = document.getElementById('question');

  questionSelect.innerHTML = '<option value="">Välj en fråga</option>';

  const filtered = questions.filter(q => q.Årskurs === year && q.Ämne === subject);
  filtered.forEach((q, index) => {
    const option = document.createElement('option');
    option.value = index;
    option.textContent = q.Fråga;
    questionSelect.appendChild(option);
  });
}
