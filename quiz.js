document.getElementById("quiz-form").addEventListener("submit", function(event) {
    event.preventDefault();
    
    let score = 0;
    let results = [];

    // Answers
    let answers = {
        q1: "c",
        q2: "d",
        q3: "a",
        q4: "Hypertext Transfer Protocol",
        q5: ["a", "b", "d"]
    };

    // Question 1-3: Single Choice
    for (let i = 1; i <= 3; i++) {
        let selected = document.querySelector(`input[name="q${i}"]:checked`);
        if (selected && selected.value === answers[`q${i}`]) {
            score++;
            results.push(`Question ${i}: ✅ Correct`);
        } else {
            results.push(`Question ${i}: ❌ Incorrect`);
        }
    }

    // Question 4: Fill in the Blank
    let q4Input = document.querySelector(`input[name="q4"]`).value.trim();
    if (q4Input.toLowerCase() === answers.q4.toLowerCase()) {
        score++;
        results.push(`Question 4: ✅ Correct`);
    } else {
        results.push(`Question 4: ❌ Incorrect (Correct answer: ${answers.q4})`);
    }

    // Question 5: Multiple Correct Choices
    let selectedCheckboxes = Array.from(document.querySelectorAll(`input[name="q5"]:checked`)).map(cb => cb.value);
    if (JSON.stringify(selectedCheckboxes.sort()) === JSON.stringify(answers.q5.sort())) {
        score++;
        results.push(`Question 5: ✅ Correct`);
    } else {
        results.push(`Question 5: ❌ Incorrect`);
    }

    // Display results
    document.getElementById("quiz-results").innerHTML = `<h2>Your Score: ${score}/5</h2><p>${results.join("<br>")}</p>`;
});
