const dynamicEl = document.querySelector("#dynamic-word");
const baseText = "Hello, ";
let dynamicWords = ["Human" , "Scholar" , "Cool Person" , "Brochacho"];
let wordIndex = 0;
let charIndex = 0;
let deleting = false;

function typeEffect(){
    const currentWord = dynamicWords[wordIndex];

    if(!deleting){
        dynamicEl.textContent = currentWord.slice(0,charIndex+1);
        charIndex++;
        if(charIndex === currentWord.length){
            setTimeout(() => deleting = true,1000);
        }
    } else {
        dynamicEl.textContent = currentWord.slice(0,charIndex-1);
        charIndex--;
        if(charIndex===0){
        deleting=false;
        wordIndex = (wordIndex + 1) % dynamicWords.length;
        }
    }
    setTimeout(typeEffect , deleting ? 80 : 150);
}

typeEffect();


//time
function updateTime(){
    const timeEl = document.getElementById('time');
    const dateEl = document.getElementById('date');
    const now = new Date();
    timeEl.textContent = now.toLocaleTimeString();

    const options = {month: 'short',day:'numeric'};
    dateEl.textContent = now.toLocaleDateString('en-Us',options);
}

setInterval(updateTime,1000);
updateTime();

const quotes =[
    "Stay hungry, stay foolish.",
    "Do something today that your future self will thank you for.",
    "Dream big and dare to fail.",
    "Code is like humor. When you have to explain it, it's bad.",
];
function todayKey() {
    return new Date().toISOString().split("T")[0];
}

function getCompletedTodosToday() {
    return document.querySelectorAll('.todo-item.done').length;
}

function getPomodorosToday(){
    const today = getToday();
    const data = JSON.parse(localStorage.getItem('pomodoroLog') || '{}');
    return data[today] || 0;
}



let quoteIndex = 0;
const quoteEl = document.getElementById('quote');
const nextQuoteBtn = document.getElementById('next-quote');
function showQuote(){
    quoteEl.textContent = quotes[quoteIndex];
}

nextQuoteBtn.addEventListener('click', () => {
    quoteIndex = (quoteIndex + 1) % quotes.length;
    showQuote();
});
showQuote();
const goalInput = document.getElementById("goalInput");
const goalStatus = document.getElementById("goalStatus");
const saveGoalBtn = document.getElementById("saveGoalBtn");

function loadDailyGoal() {
    let data = JSON.parse(localStorage.getItem("dailyGoal"));
    if(!data || data.date !== todayKey()){
        data = {
            date: todayKey(),
            text: "",
            completed: false
        };
        localStorage.setItem("dailyGoal" , JSON.stringify(data));
    }
    goalInput.value = data.text;
    updateGoalStatus(data.completed ? "completed" : "pending");
}
saveGoalBtn.addEventListener("click", () => {
    const data = JSON.parse(localStorage.getItem("dailyGoal")) || {};
    data.text = goalInput.value.trim();
    data.date = todayKey();
    data.completed = false;
    localStorage.setItem("dailyGoal", JSON.stringify(data));
    tryCompleteDailyGoal();
    updateGoalStatus("pending");
});
function updateGoalStatus(status){
    if(status === "completed"){
        goalStatus.textContent ="✅ Completed";
        goalStatus.style.color = "#4ade80";
    } else {
        goalStatus.textContent ="⏳ Pending";
        goalStatus.style.color = "#fff";
    }
}
function sd(){
    sdadsd;
}
const themeToggleBtn = document.getElementById("themeToggleBtn");
let currentTheme = localStorage.getItem("theme") || "dark";
document.body.classList.toggle("light", currentTheme==="light");
themeToggleBtn.addEventListener("click", () => {
    const isLight = document.body.classList.toggle("light");
    localStorage.setItem("theme",isLight ? "light" : "dark");
});
const completeGoalBtn = document.getElementById("completeGoalBtn");

completeGoalBtn.addEventListener("click", () => {
    const data = JSON.parse(localStorage.getItem("dailyGoal")) || {};
    if(!data || !data.text) return;
    data.completed = true;
    localStorage.setItem("dailyGoal" , JSON.stringify(data));
    updateGoalStatus("completed");
})
function tryCompleteDailyGoal(){
    const data = JSON.parse(localStorage.getItem("dailyGoal"));
    if(!data || data.completed) return;


    const todosDone = getCompletedTodosToday();
    const pomodorosDone = getPomodorosToday();

    if(todosDone >= 1 || pomodorosDone >= 1){
        data.completed = true;
        localStorage.setItem("dailyGoal", JSON.stringify(data));
        updateGoalStatus("completed");
    } else {
        updateGoalStatus("pending");
    }
}
//todo
document.getElementById('scroll-to-todos')
.addEventListener('click', () => {
    document.getElementById('todos')
    .scrollIntoView({behavior: 'smooth'});
});
window.addEventListener('scroll', () => {
    const arrow = document.getElementById('scroll-to-todos');
    arrow.style.opacity = window.scrollY > 100 ? '0' : '0.67';
});
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');

function saveTodos(){
   const todos = [];
   document.querySelectorAll ('.todo-item').forEach(item => {
    todos.push({
        text: item.querySelector('span').textContent,
        done: item.classList.contains('done')
    });
  });

  localStorage.setItem('todos' , JSON.stringify(todos));
}

let timer;
let minutes =15;
let seconds=0;
let isPaused = false;
let enteredTime = null;

function startTimer(){
    clearInterval(timer);
    timer = setInterval(updateTimer,1000);
}

function updateTimer(){
    const timerElement = document.getElementById('timer');
    timerElement.textContent =
    formatTime(minutes,seconds);

    if(minutes===0 && seconds===0){
        clearInterval(timer);
        alert('Time is up! Take a break.');

        const today = getToday();
        const data = JSON.parse(localStorage.getItem('pomodoroLog') || '{}')
        data[today] = (data[today] || 0) + 1;
        localStorage.setItem('pomodorolog', JSON.stringify(data));

        tryCompleteDailyGoal();
    } else if (!isPaused){
        if(seconds>0){
            seconds--;
        }else {
            seconds=59;
            minutes--;
        }
    }
}

function formatTime(minutes,seconds){
    return `${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}`;
}
function togglePauseResume () {
    const pauseResumeButton =
    document.querySelector('.control-buttons button');
    isPaused = !isPaused;
    if(isPaused) {
        clearInterval(timer);
        pauseResumeButton.textContent = 'Resume';
    }else {
        startTimer();
        pauseResumeButton.textContent = 'Pause';
    }
}
function restartTimer(){
    clearInterval(timer);
    minutes = enteredTime || 15;
    seconds = 0;
    isPaused = false;
    const timerElement =
    document.getElementById('timer');
    const pauseResumeButton =
    document.querySelector('.control-buttons button');
    pauseResumeButton.textContent = 'Pause';
    startTimer();
}

function chooseTime(){
    const newTime = prompt('Enter new time in minutes:');
    if(!isNaN(newTime) && newTime > 0){
        enteredTime = parseInt(newTime);
        minutes = enteredTime;
        seconds = 0;
        isPaused = false;
        const timerElement =
        document.getElementById('timer');
        timerElement.textContent =
        formatTime(minutes,seconds);
        clearInterval(timer);
        const pauseResumeButton =
        document.querySelector('.control-buttons button');
        pauseResumeButton.textContent = 'Pause';
        startTimer();
    }else {
        alert('Invalid input. Please enter'+
            ' a valid number greater than 0.'
        )
    }
}
document.getElementById('pause-btn').addEventListener('click', togglePauseResume);
document.getElementById('restart-btn').addEventListener('click', restartTimer);
document.getElementById('choose-btn').addEventListener('click', chooseTime);

startTimer();

function loadTodos() {
    const saved = JSON.parse(localStorage.getItem('todos') || '[]');
    saved.forEach(todo => addTodo(todo.text,todo.done));
}

function getToday(){
    const d = new Date();
    return d.toISOString().split('T')[0]; //yyyy-mm-dd
}
let streak = parseInt(localStorage.getItem('streak') || 0);
let lastStreakDate = localStorage.getItem('lastStreakDate');

function tryIncreaseStreak(){
    const today = getToday();
    if(lastStreakDate === today){
        return;
    }
    streak++;
    lastStreakDate = today;
    localStorage.setItem('streak',streak);
    localStorage.setItem('lastStreakDate', lastStreakDate);

    updateStreakUI();
}

function checkStreakValidity(){
    if(!lastStreakDate) return;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate()-1);
    const y = yesterday.toISOString().split('T')[0];

    if(lastStreakDate !== getToday() && lastStreakDate !== y){
        streak = 0;
        localStorage.setItem('streak',0);
    }
}
checkStreakValidity();
function updateStreakUI(){
    const el = document.getElementById('streak-number');
    el.textContent = streak;
    el.classList.add('pulse');
    setTimeout(() => el.classList.remove('pulse'), 300);
}

function addTodo(text, done = false) {
    const li = document.createElement('li');
    li.className = "todo-item";
    if(done) li.classList.add("done");

    const span = document.createElement('span');
    span.textContent = text;

    li.addEventListener('click', () => {
        li.classList.toggle('done');
        saveTodos();
    });
   
    const actions = document.createElement('div');
    actions.className = 'todo-actions';
    const doneBtn = document.createElement('button');
    doneBtn.classList.add('done-btn');
    doneBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
viewBox="0 0 16 16">
  <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z"/>
</svg>
    `;
    doneBtn.onclick = (e) => {
        e.stopPropagation();
           const wasDone = li.classList.contains('done');
        li.classList.toggle('done');

        if(!wasDone && li.classList.contains('done')){
            tryIncreaseStreak();
        }
        saveTodosDebounced();
    }

    const editBtn = document.createElement('button');
    editBtn.textContent='✏️';
    editBtn.onclick = (e) => {
        e.stopPropagation();
        const newText = prompt('Edit task:',span.textContent);
        if(newText) {
            span.textContent = newText;
            saveTodosDebounced();
        }
    }

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent='🗑';
    deleteBtn.onclick = (e) => {
        e.stopPropagation();
        li.remove();
        saveTodosDebounced();
    }

    actions.append( doneBtn, editBtn, deleteBtn);
    li.append(span, actions);
    todoList.appendChild(li);
    saveTodos();
}

todoInput.addEventListener('keypress', e => {
    if(e.key === 'Enter' && todoInput.value.trim() !== ''){
        addTodo(todoInput.value.trim());
        todoInput.value = '';
    }
});
loadTodos();

function updateStats() {
    const todos = document.querySelectorAll('.todo-item');
    const doneCount = document.querySelectorAll('.todo-item.done').length;
    const remainingCount = todos.length - doneCount;

    document.getElementById('done-count').textContent = doneCount;
    document.getElementById('remaining-count').textContent = remainingCount;
    document.getElementById('streak-count').textContent = localStorage.getItem('streak') || '0';
}


function saveTodosDebounced(){
    saveTodos();
    updateStats();
}

updateStats();



