let playBtn = document.getElementById("btnPlayQuizz");
let innerContainer = document.getElementById("innerContainer");
let points = document.getElementById("points");
let timerValue = document.getElementById("timer");
let questions = document.getElementById("question");
let options = document.getElementById("options");
let numberOfQuestion = document.getElementById("totalQuestion");
let presentIndex = document.getElementById("currentIndex");
let nextBtm = document.getElementById("nextBtm");
let endBtn = document.getElementById("endBtn");

let userPoints = 0;
let currentIndex = 1;
let listOfQuestion;
let correctAns = 0;
let correctAnsList = [];
let error = false;
let totalNumberofQuestion = 0;

let currentTimer = null; // keeping the track of current timer
// timer function
function startQuestionTimer(duration, onTimeOff) {
  if (currentTimer) {
    clearInterval(currentTimer); // if there is previous timer then it will clear it
  }
  let timeLeft = duration;
  currentTimer = setInterval(() => {
    timeLeft--;
    timerValue.innerHTML = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(currentTimer);
      onTimeOff(); //calling the timer function
    }
  }, 1000);
  return timer; // Return timer ID for future reference (e.g., to clear it)
}

// function to fetch the data from the server
async function fetchData() {
  try {
    const resData = await fetch("https://eaxeli.com/api/v1/questions/quiz");

    if (resData.status !== 200) {
      error = true;
    }
    // console.log(resData);
    if (!resData.ok) {
      error = true;
      return;
    }
    listOfQuestion = await resData.json();
  } catch (err) {
    console.log("error message:", err.message);
  }
}

document.addEventListener("DOMContentLoaded", fetchData);

//function to load the first question
function loadFirstQuestion() {
  // checking there is error or not
  if (error) {
    alert("Server is too busy");
    return;
  }

  // updating the value of total number of question
  totalNumberofQuestion++;

  startQuestionTimer(10, () => {
    options.innerHTML = "";
  });

  let answer = listOfQuestion.questions[currentIndex].answer;
  console.log(answer);
  playBtn.style.display = "hidden";
  playBtn.style.zIndex = -10;
  document.getElementById("innerContainer").style.visibility = "visible";
  document.getElementById("innerContainer").style.zIndex = 10;
  console.log(listOfQuestion.questions[currentIndex].options);

  let choiceAns = ""; // initilizing the choiceAns as empty string

  //   for print the list of the option
  listOfQuestion.questions[currentIndex].options.forEach((value) => {
    let btn = document.createElement("button");
    btn.innerHTML = `${value}`;
    btn.classList.add("item");

    // adding the click event to check the particular answer is correct or not
    btn.addEventListener("click", () => {
      // if there is no answer choice then user are allow to choice the  any answer
      choiceAns = value;
      if (answer === value) {
        btn.classList.add("correctAnswer");
        if (correctAnsList.indexOf(answer) === -1) {
          userPoints += 10;
          correctAns += 1;
          points.innerHTML = `${userPoints}`;
          correctAnsList.push(answer);
        }
      } else {
        btn.style.background = "red";
      }

      // Disable all other buttons except the clicked one
      let allButtons = document.querySelectorAll(".item"); // Select all buttons
      allButtons.forEach((button) => {
        if (button.innerHTML !== choiceAns) {
          button.disabled = true; // Disable other buttons
          button.style.opacity = 0.5;
        }
      });
    });
    options.appendChild(btn);
  });

  questions.innerHTML = `${listOfQuestion.questions[currentIndex].question}`;
  presentIndex.innerHTML = `${currentIndex}`;
  numberOfQuestion.innerHTML = `${listOfQuestion.questions.length}`;
}

playBtn.addEventListener("click", loadFirstQuestion);

function endQuiz() {
  // clearing the all the element of the of inner container
  innerContainer.innerHTML = "";
  let div_01 = document.createElement("div");
  let div_02 = document.createElement("div");
  let playAgain = document.createElement("button");
  playAgain.innerHTML = "Play Again";
  playAgain.classList.add("playAgain");
  div_01.innerHTML = `Question: ${totalNumberofQuestion}`;
  div_02.innerHTML = `Correct answer: ${correctAns}`;

  innerContainer.style.display = "flex";
  innerContainer.style.justifyContent = "center";
  innerContainer.style.alignItems = "center";
  innerContainer.style.flexDirection = "column";
  innerContainer.style.gap = "20px";
  innerContainer.appendChild(div_01);
  innerContainer.appendChild(div_02);
  innerContainer.appendChild(playAgain);

  playAgain.addEventListener("click", () => {
    location.reload(); // reload the page
  });
}

function updateQuestion() {
  // checking that current index reach the limitor not
  if (currentIndex == listOfQuestion.questions.length) {
    endQuiz();
  }

  // updating the value of total number of question
  totalNumberofQuestion++;

  startQuestionTimer(10, () => {
    options.innerHTML = "";
  });

  let choiceAns = ""; // initilizing the choiceAns as empty string
  currentIndex += 1; //increasing the current index to next so it use to update the question
  questions.innerHTML = `${listOfQuestion.questions[currentIndex].question}`;
  let answer = listOfQuestion.questions[currentIndex].answer;

  options.innerHTML = "";
  // for print the list of the option
  listOfQuestion.questions[currentIndex].options.forEach((value) => {
    let div = document.createElement("div");
    div.innerHTML = `${value}`;
    div.classList.add("item");

    div.addEventListener("click", () => {
      choiceAns = value; // updating the value of choiceAns to the clicked value
      if (answer === value) {
        div.classList.add("correctAnswer");
        if (correctAnsList.indexOf(answer) === -1) {
          userPoints += 10;
          correctAns += 1;
          points.innerHTML = `${userPoints}`;
          correctAnsList.push(answer);
        }
      } else {
        div.style.background = "red";
      }
      // Disable all other buttons except the clicked one
      let allButtons = document.querySelectorAll(".item"); // Select all buttons
      allButtons.forEach((button) => {
        if (button.innerHTML !== choiceAns) {
          button.disabled = true; // Disable other buttons
          button.style.opacity = 0.5;
        }
      });
    });
    options.appendChild(div);
  });
  points.innerHTML = `${userPoints}`;
  presentIndex.innerHTML = `${currentIndex + 1}`;
  numberOfQuestion.innerHTML = `${listOfQuestion.questions.length}`;
}

// event which update the question
nextBtm.addEventListener("click", updateQuestion);

endBtn.addEventListener("click", endQuiz);
