const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const progressText = document.getElementById("progressText");
const scoreText = document.getElementById("score");
const progressBarFull = document.getElementById("progressBarFull");
const loader = document.getElementById("loader");
const game = document.getElementById("game");
let currentQuestion = {};
let acceptingAnswer = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

let questions = [];
import { secret_import } from "./secret.mjs";
let api_fetch = secret_import();

fetch(api_fetch)
.then((res) => {
    return res.json();
})
.then((loadedQuestions) => {
    questions = loadedQuestions.results.map((loadedQuestions) => {
        const formattedQuestions = {
            question: loadedQuestions.question
        };
    const answerChoices = [...loadedQuestions.incorrect_answers];
    formattedQuestions.answer = Math.floor(Math.random() * 6)+1;
    answerChoices.splice(formattedQuestions.answer -1,0,loadedQuestions.correct_answer);
    answerChoices.forEach((choice , index) => {
        formattedQuestions["choice" + (index+1)] = choice;
    });
    return formattedQuestions;
    });
    game.classList.remove("hidden");
    loader.classList.add("hidden");
    startGame();
})
.catch(err => {
    console.error(err);
});

//constants
 const CORRECT_BONUS = 10;
 const MAX_QUESTIONS = 5;

 startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuestions = [...questions];
    console.log(availableQuestions);
    getNewQuestion();
 };

 getNewQuestion = () => {
    if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS){
        localStorage.setItem("mostRecentScore",score);
        //go to end page
        return window.location.assign("/end.html")
    }
    questionCounter++;
    progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;
    //update progress bar
    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;
    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];
    question.innerText = currentQuestion.question;

    choices.forEach(choice =>{
        const number = choice.dataset['number'];
        choice.innerText = currentQuestion['choice' + number];
    });
    availableQuestions.slice(questionIndex,1); //this is not to use the same question again and again
    acceptingAnswer = true;
 };

 choices.forEach(choice =>{
    choice.addEventListener("click", e =>{
        if(!acceptingAnswer) return;
        acceptingAnswer = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset["number"];

        const classToApply = selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";
        if(classToApply === "correct"){
            incrementScore(CORRECT_BONUS);
        }
        
        selectedChoice.parentElement.classList.add(classToApply);
        setTimeout( () =>{
            selectedChoice.parentElement.classList.remove(classToApply);
            getNewQuestion();        
        },1000);
    });
 });

 incrementScore = num => {
    score += num;
    scoreText.innerText = score;
 };
 