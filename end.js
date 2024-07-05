const username = document.getElementById("username");
const saveScoreBtn = document.getElementById("saveScoreBtn");
const mostRecentScore = localStorage.getItem("mostRecentScore");
const finalScore = document.getElementById("finalScore");

finalScore.innerText = mostRecentScore;
const highScores = JSON.parse(localStorage.getItem("highScores")) || [];

username.addEventListener('keyup',() => {
    saveScoreBtn.disabled = !username.value;
});

saveHighScore = (e) => {
    console.log("Clicked the save button!");
    e.preventDefault(); 
    
    const score = {
        //score : Math.floor(Math.random() * 100),
        score : mostRecentScore,
        name : username.value,
    };
    highScores.push(score);
    highScores.sort( (a,b) => b.score - a.score)
    highScores.splice(5);

    localStorage.setItem("highScores", JSON.stringify(highScores));
    window.location.assign("/");
};