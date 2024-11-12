const timerText = document.querySelector(".timer .time_text");

next_Que.addEventListener("click", () => {
    if (que_count < window.questions.length - 1) {
        que_count++;
        que_number++;
        showQuestion(que_count); 
        queCounter(que_number); 
        cancelAnimationFrame(counter);
        cancelAnimationFrame(counterLine);
        timerText.textContent = "Time Left";
        next_Que.classList.remove("enable");
        startTimer(timeValue);
        startTimerLine(0);
    } else {
        showResultBox();
    }
})

const option_list = document.querySelector(".option_list");

function showQuestion(index) {
    const que_text = document.querySelector(".que_text");
    let que_tag = '<span>' + window.questions[index].numb + ". " + window.questions[index].question + '</span>';
    let option_tag = '<div class="option"><span>' + window.questions[index].options[0] + '</span></div>' + '<div class="option"><span>' + window.questions[index].options[1] + '</span></div>' + '<div class="option"><span>' + window.questions[index].options[2] + '</span></div>' + '<div class="option"><span>' + window.questions[index].options[3] + '</span></div>';
    que_text.innerHTML = que_tag;
    option_list.innerHTML = option_tag;

    const option = option_list.querySelectorAll(".option");
    for (let i = 0; i < option.length; i++) {
        option[i].setAttribute("onclick", "optionSelected(this)");
    }
}

function queCounter(index) {
    const bottom_ques_counter = quizWrapper.querySelector(".total_que");
    let totalQueCountTag = '<span><p>' + que_number + '</p>of <p>' + window.questions.length + '</p>Questions </span>';

    bottom_ques_counter.innerHTML = totalQueCountTag;
}

let tickIcon = '<div class="icon tick"><i class="bx bx-check"></i></div>';
let crossIcon = '<div class="icon cross"><i class="bx bx-x"></i></div>';

function optionSelected(answer) {
    let userAns = answer.textContent;
    let correctAns = window.questions[que_count].answer;
    let allOptions = option_list.children.length;

    if (userAns == correctAns) {
        answer.classList.add("correct");
        answer.insertAdjacentHTML("beforeend", tickIcon);
        userScrore++;

    } else {
        answer.classList.add("incorrect");
        answer.insertAdjacentHTML("beforeend", crossIcon);

        //if answer is wrong then auto select correctAns
        for (let i = 0; i < allOptions; i++) {
            if (option_list.children[i].textContent == correctAns) {
                option_list.children[i].setAttribute("class", "option correct");
                option_list.children[i].insertAdjacentHTML("beforeend", tickIcon);
            }
        }
    }

    //Once user selected disable add options
    for (let i = 0; i < allOptions; i++) {
        option_list.children[i].classList.add("disabled");
        cancelAnimationFrame(counter); //clear timer when click next
        cancelAnimationFrame(counterLine);
    }
    next_Que.classList.add("enable");
}



function startTimer(time) {
    let start = performance.now();

    function timer(currentTime) {
        let elapsedTime = Math.floor((currentTime - start) / 1000);
        let remainingTime = time - elapsedTime;

        document.querySelector(".timer .timer_sec").textContent = remainingTime > 9 ? remainingTime : "0" + remainingTime;

        if (remainingTime <= 0) {
            document.querySelector(".timer .timer_sec").textContent = "00";
            timerText.textContent = "Time Off";

            const allOptions = document.querySelectorAll(".option_list .option");
            let correcAns = questions[que_count].answer;
            for (let i = 0; i < allOptions.length; i++) {
                if (allOptions[i].textContent == correcAns) {
                    allOptions[i].setAttribute("class", "option correct");
                    allOptions[i].insertAdjacentHTML("beforeend", tickIcon);
                }
            }
            for (let i = 0; i < allOptions.length; i++) {
                allOptions[i].classList.add("disabled");
            }
            next_Que.classList.add("enable");
            return;
        }

        counter = requestAnimationFrame(timer);
    }

    counter = requestAnimationFrame(timer);
}




function startTimerLine(time) {
    const timeLine = document.querySelector(".header .time_line");
    const containerWidth = timeLine.parentElement.offsetWidth;
    const totalDuration = timeValue * 1000; // total duration in milliseconds
    const increment = containerWidth / (totalDuration / 29); // calculate increment based on the container width and interval

    let startTime = null;

    function timer(currentTime) {
        if (!startTime) startTime = currentTime;
        const elapsedTime = currentTime - startTime;
        const elapsedIncrements = elapsedTime / 29; // update every 29ms

        const width = increment * elapsedIncrements + time;
        timeLine.style.width = (width / containerWidth) * 100 + "%";

        if (width < containerWidth) {
            counterLine = requestAnimationFrame(timer); // Continue animation
        } else {
            timeLine.style.width = "100%"; // Ensure it reaches 100% width
        }
    }

    counterLine = requestAnimationFrame(timer); // Start animation
}




function showResultBox() {
    quizWrapper.classList.remove("active");
    resultBox.classList.add("active");

    const scoreText = document.querySelector(".score_text");
    scoreText.innerHTML = `Your score<p>${userScrore}</p>out of <p>${window.questions.length}.</p>`;

    const circularProgress = document.querySelector(".circular_progress"),
        progressValue = document.querySelector(".progress_value");

    let progressStartValue = 0;
    const progressEndValue = Math.min((userScrore / window.questions.length) * 100, 100); // Ensure it doesn't exceed 100
    const speed = 5;

    const incrementStep = 0.5;

    let progress = setInterval(() => {
        // Increment the progress value by a smaller step
        progressStartValue += incrementStep;

        // Ensure progressStartValue does not exceed progressEndValue
        if (progressStartValue > progressEndValue) {
            progressStartValue = progressEndValue;
        }

        // Format the progress value
        const displayValue = Number.isInteger(progressStartValue) 
            ? `${progressStartValue}` 
            : `${progressStartValue.toFixed(2)}`;

        // Display the progress value
        progressValue.textContent = `${displayValue}%`;

        // Update the circular progress bar
        circularProgress.style.background = `conic-gradient(#c40094 ${progressStartValue * 3.6}deg, rgba(255, 255, 255, 0.1) 5deg)`;

        // Clear interval when the target value is reached
        if (progressStartValue >= progressEndValue) {
            // Ensure the final value is correctly formatted
            const finalValue = Number.isInteger(progressEndValue) 
                ? `${progressEndValue}` 
                : `${progressEndValue.toFixed(2)}`;

            progressValue.textContent = `${finalValue}%`;
            circularProgress.style.background = `conic-gradient(#c40094 ${progressEndValue * 3.6}deg, rgba(255, 255, 255, 0.1) 5deg)`;
            clearInterval(progress);
        }

    }, speed);
}








function reshuffleQuestions() {
    window.questions = shuffleArray(window.questions);

    // Remove existing `numb` and reassign new serial numbers
    window.questions = window.questions.map((question, index) => {
        // Remove `numb` and assign a new one
        return {
            ...question,
            numb: index + 1
        };
    });
}



