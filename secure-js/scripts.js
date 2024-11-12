let selectedSubjectText = "";
let timeValue = 20;
let queLimit = document.getElementById("queLimit");
let totalQuelimit = 0;
let choosedQuesNumber = 0;
let que_count = 0;
let que_number = 1;
let counterLine, counter;
let userScrore = 0;

const selectBtn = document.querySelector(".selectBtn"),
    selectMenu = document.querySelector(".menu"),
    closeMenu = document.querySelector(".closeMenu"),
    quizTitle = document.querySelector(".quiz_box .title"),
    timeLine = document.querySelector(".time_line"),
    rePlay = document.querySelector(".rePlay-btn"),
    goHome = document.querySelector(".goHome-btn"),
    EditButton = document.querySelector(".pen-tick"),
    subjectlistItem = document.querySelectorAll(".subItem"),
    Homemsg = document.querySelector(".main_msg"),
    selectText = document.querySelector(".selectText"),
    ContinueBtn = document.querySelector(".LoadQues"),
    chapterValue = document.querySelector(".chapterValue"),
    PenTick = document.querySelector(".pen-tick"),
    EditGhostIcon = document.querySelector(".bxs-edit-alt");

EditButton.disabled = true;

// Show Selecting Subject Page
selectBtn.addEventListener("click", () => {
    selectMenu.classList.add("active");
});

// Hide Selecting Subject Page Function
function Closemenu() {
    selectMenu.classList.remove("active");
}

// Hide Selecting Subject Page
closeMenu.addEventListener("click", () => {
    Closemenu();
});

rePlay.addEventListener("click", () => {
    quizWrapper.classList.add("active");
    resultBox.classList.remove("active");
    que_count = 0;
    que_number = 1;
    userScrore = 0;
    next_Que.classList.remove("enable");
    reshuffleQuestions();
    showQuestion(0);
    queCounter(1);
    startTimer(timeValue);
    startTimerLine(0);
});

goHome.addEventListener("click", () => {
    quizWrapper.classList.remove("active");
    resultBox.classList.remove("active");

    que_count = 0;
    que_number = 1;
    userScrore = 0;
    window.questions = [];

    // Reset UI elements
    chapterValue.innerHTML = "";
    if (chapterValue.classList.contains("blur")) {
        chapterValue.classList.remove("blur");
    }
    selectText.innerText = "Select Subject";
    quizTitle.innerText = "Awesome Quiz App";

    // Reset the timer display
    document.querySelector(".timer .timer_sec").textContent = "00";
    timerText.textContent = "Time Left";

    Homemsg.classList.remove("hidden");

    next_Que.classList.remove("enable");
    ContinueBtn.innerHTML = "Continue";
    ContinueBtn.classList.remove("enable");
    selectBtn.style.pointerEvents = "auto";
});

subjectlistItem.forEach((item) => {
    item.addEventListener("click", () => {
        subjectlistItem.forEach((subItem) =>
            subItem.classList.remove("activeSubject")
        );
        item.classList.add("activeSubject");
        Homemsg.classList.add("hidden");
        ContinueBtn.classList.remove("enable");
        const activeId = item.id;

        if (subjectContent[activeId]) {
            chapterValue.innerHTML = subjectContent[activeId];
        }

        selectedSubjectText = item.textContent;
        queLimit.value = "";

        // Set timeValue based on the selected subject
        if (selectedSubjectText === "Hindi") {
            timeValue = 20;
        } else if (selectedSubjectText === "English") {
            timeValue = 30;
        } else if (selectedSubjectText === "Sanskrit") {
            timeValue = 30;
        } else if (selectedSubjectText === "SST") {
            timeValue = 25;
        } else {
            timeValue = 15; // Default value if no subject is selected or it's empty
        }

        selectText.innerText = item.textContent ? `${item.textContent} Selected` : "Select Subject";
        quizTitle.innerText = item.textContent ? `${item.textContent} Test` : "Awesome Quiz App";
        Closemenu();
        chapterChicking();
    });
});

limitBox = document.querySelector(".limitBox");
limitBox.style.pointerEvents = "none";
// Enable Continue & Disable
function chapterChicking() {
    const chapters = document.querySelectorAll(".chapterItem");

    chapters.forEach((checkingItem) => {
        checkingItem.addEventListener("click", () => {
            checkingItem.classList.toggle("active");
            const GetAllactivechapters =
                document.querySelectorAll(".Chapter .active");

            // Sum the 'q' attribute values of all active chapters
            let totalQuestions = 0;
            GetAllactivechapters.forEach((chapter) => {
                const qValue = parseInt(chapter.getAttribute("q")) || 0;
                totalQuestions += qValue;
            });

            // Update totalQuelimit and queLimit value
            totalQuelimit = totalQuestions;
            choosedQuesNumber = totalQuelimit; // Synchronize choosedQuesNumber with totalQuelimit

            if (totalQuelimit > 0) {
                queLimit.value = `Max Question Limit is ${totalQuelimit}`;
            } else {
                queLimit.value = ""; // Clear the value to show the placeholder
            }

            if (GetAllactivechapters.length > 0) {
                ContinueBtn.classList.add("enable");
                EditButton.disabled = false;
                limitBox.style.pointerEvents = "auto";
            } else {
                ContinueBtn.classList.remove("enable");
                EditButton.disabled = true;
                limitBox.style.pointerEvents = "none";
            }
        });
    });
}

////// Question No Detector
PenTick.addEventListener("click", () => {
    if (EditGhostIcon.classList.contains("bxs-edit-alt")) {
        queLimit.removeAttribute("readonly");

        // Allow editing only the numeric part of the value
        let currentValue = queLimit.value;
        if (currentValue.startsWith("Max Question Limit is ")) {
            queLimit.value = currentValue.replace("Max Question Limit is ", "");
        }

        EditGhostIcon.classList.remove("bxs-edit-alt");
        EditGhostIcon.classList.add("bxs-ghost");

        // Add an event listener to handle clicking outside the input
        document.addEventListener("click", handleClickOutside, true);
    } else {
        finalizeInputValue();
    }
});

function finalizeInputValue() {
    queLimit.setAttribute("readonly", "");

    // Reapply the "Question Limit is" prefix
    let userInput = queLimit.value.trim();
    totalQuelimit = parseInt(userInput) || totalQuelimit;
    queLimit.value = `Max Question Limit is ${totalQuelimit}`;

    // Sync choosedQuesNumber with totalQuelimit
    choosedQuesNumber = totalQuelimit;

    EditGhostIcon.classList.remove("bxs-ghost");
    EditGhostIcon.classList.add("bxs-edit-alt");

    // Remove the outside click event listener
    document.removeEventListener("click", handleClickOutside, true);
}

function handleClickOutside(event) {
    if (!queLimit.contains(event.target) && !PenTick.contains(event.target)) {
        finalizeInputValue();
    }
}

// Update totalQuelimit with new value or revert to original if empty
queLimit.addEventListener("input", function() {
    let userInput = queLimit.value.trim();
    totalQuelimit = parseInt(userInput) || totalQuelimit; // Update or keep original if invalid
});

// Function to load, merge, and shuffle questions from checked chapters
async function loadAndMergeCheckedChapters() {
    const checkedSubDataElements = document.querySelectorAll(
        ".chapterItem.active"
    );
    const urls = Array.from(checkedSubDataElements).map((item) =>
        item.getAttribute("data-url")
    );

    let mergedQuestions = [];

    for (const url of urls) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Failed to fetch ${url}`);

            const data = await response.json();
            let questions = data.questions;

            // Shuffle options within each question, excluding options with "neverchangeposition"
            questions.forEach((question) => {
                question.options = shuffleArrayWithFixedOption(question.options);
            });

            // Merge the questions
            mergedQuestions = mergedQuestions.concat(questions);
        } catch (error) {
            console.error(`Error fetching or processing data from ${url}: `, error);
        }
    }

    // Shuffle the final merged array of questions
    mergedQuestions = shuffleArray(mergedQuestions);

    // Add serial numbers to each question
    mergedQuestions = mergedQuestions.map((question, index) => ({
        ...question,
        numb: index + 1, // Add serial number as "numb" field
    }));

    // If choosedQuesNumber is 0 or not set, return all questions, otherwise return the first choosedQuesNumber questions
    if (choosedQuesNumber > 0) {
        return mergedQuestions.slice(0, choosedQuesNumber);
    } else {
        return mergedQuestions; // Return all questions
    }
}

// Function to shuffle an array, excluding options with "neverchangeposition"
function shuffleArrayWithFixedOption(array) {
    let fixedOptions = [];
    let shuffleOptions = [];

    // Separate fixed options from the ones to be shuffled
    array.forEach((option) => {
        if (option.includes("neverchangeposition")) {
            fixedOptions.push(option.replace("neverchangeposition", "").trim());
        } else {
            shuffleOptions.push(option);
        }
    });

    // Shuffle the options that are not fixed
    shuffleOptions = shuffleArray(shuffleOptions);

    // Combine shuffled and fixed options
    let finalOptions = [];
    let fixedOptionsMap = fixedOptions.reduce((acc, option) => {
        acc[option] = true;
        return acc;
    }, {});

    array.forEach((option) => {
        if (fixedOptionsMap[option.replace("neverchangeposition", "").trim()]) {
            finalOptions.push(option.replace("neverchangeposition", "").trim());
        } else {
            finalOptions.push(shuffleOptions.shift());
        }
    });

    return finalOptions;
}

// Function to shuffle an array
function shuffleArray(array) {
    let currentIndex = array.length,
        randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex !== 0) {
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // Swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex],
            array[currentIndex],
        ];
    }

    return array;
}