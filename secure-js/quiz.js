const quizWrapper = document.querySelector('.quiz_wrapper'),
    next_Que = quizWrapper.querySelector('.next_que'),
    timeCount = quizWrapper.querySelector(".timer .timer_sec");
resultBox = document.querySelector('.result_wrapper');


ContinueBtn.addEventListener("click", async () => {
    chapterValue.classList.add("blur");
    ContinueBtn.innerHTML = `<div class="loader"></div>`;

    // Load and merge questions
    const mergedQuestions = await loadAndMergeCheckedChapters();
    queLimit.value = '';
    limitBox.style.pointerEvents = "none";
    ContinueBtn.innerHTML = "Quiz Started";
    ContinueBtn.classList.remove("enable");
    selectBtn.style.pointerEvents = "none";

    window.questions = mergedQuestions;  // Assign to `window.questions`
    // console.log(mergedQuestions);
    chapterValue.innerHTML = '';
    quizWrapper.classList.add('active');
    showQuestion(0);
    queCounter(1);
    startTimer(timeValue);
    startTimerLine(0);
});


