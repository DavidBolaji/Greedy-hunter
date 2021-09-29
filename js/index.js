//  Dom elements
let start    = document.getElementById('start');
let grid     = document.getElementById('grid');
let reset    = document.getElementById('reset');
let center   = document.getElementById('center')
let moves    = document.querySelector('.moves');
let timer    = document.querySelector('.timer');
let steps    = document.querySelector('.steps');
let level    = document.querySelector('.level');
let gameOver = document.querySelector('.game-over');
let msg      = document.querySelector('.msg');
let grpModal = document.querySelector('.group-modal');
let close    = document.querySelector('.close');
let title    = document.querySelector('.title');
let modal    = document.querySelector('.modal');
let base     = 0;
let foodNo   = 0;
let noOfMoves= 0;
let gamePlay = true;
let audio    = new Audio("./audio/battle-of-the-dragons.mp3");

audio.play();
let intervalId = [];

//  Audio event listener
audio.addEventListener('ended', (e) => {
    e.target.play();
})

// Setting storage memory for grid
if(localStorage.getItem('select')) {
    grid.value = localStorage.getItem('select');
}

// Close modal
close.addEventListener('click', () => {
    removeModal();
})

// Reset game button
reset.addEventListener('click', () => {
    window.location.replace('https://davidbolaji.github.io/greedy-hunter/')
})

// Remove modal
const removeModal = () => {
    grpModal.classList.remove('active');
    grpModal.classList.remove('active');
}


const restart = () => {
    window.location.replace('https://davidbolaji.github.io/greedy-hunter/')
}


//  Function to initiate next level
const nextLevel = () => {
    init();
    document.querySelector('.next').remove();
    table.remove();
    Number(level.textContent) + 1; 
    removeModal();
    if(Number(localStorage.getItem('select')) > 10) {
        gameOver.classList.add('active');
        let next = document.createElement('button')
        next.textContent = "Reset"
        next.setAttribute('class','next')
        next.addEventListener('click', restart);
        modal.append(next)
        title.textContent = "HURRAY!!!";
        msg.textContent = "You Have cleared all Game levels";
        grpModal.classList.add('active');
        localStorage.setItem('select',5);
        return;
    }
    grid.value = Number(localStorage.getItem('select')) + 1;
    localStorage.setItem('select', grid.value);
    run(grid.value);
}


// Initializarion function
const init = () => {
    let boxVal = 0;
    let noOfMoves = 0;
    moves.textContent = noOfMoves;
    timer.textContent = 0;
    steps.textContent = '-';
    gamePlay = true;
    for(let ids of intervalId) {
        clearInterval(ids)
    }
    
}



// Timer function
const startTime = () => {
    const countDown = setInterval(() => {
        if(gamePlay) {
            timer.textContent--;
            if(timer.textContent <= 0) {
                clearInterval(countDown);
                gamePlay = false;
                gameOver.classList.add('active');
                grpModal.classList.add('active');
                title.textContent = "Game Over";
                msg.textContent = "Sorry, you are out of time!";
            }
        }
    }, 1000);

    intervalId.push(countDown);
    console.log(intervalId);
}


// Start game parameters
const gameStarted = (val) => {
 // Initial Parameters
    let boxVal = val;
    let foodNo = val;
    localStorage.setItem('select',`${grid.value}`);
    let noOfMoves = Math.floor((boxVal * boxVal)/ 2);
    moves.textContent = noOfMoves;
    timer.textContent = 30;
    startTime()
    level.textContent = String(Number(level.textContent) + 1); 
    steps.textContent = 0;
    return noOfMoves;
}


// Movement logic
const movement = (e, player) => {
    let move    = new Audio("./audio/sfx-pop.mp3");
    move.play()
    event.target.appendChild(player);
    player.setAttribute('id', event.target.id)
    moves.textContent--;
    steps.textContent++;
    isPlaying();
}


//  Eting food logic
const eat = (e, player) => {
    let eat    = new Audio("./audio/sfx-eating14.mp3");
    eat.play();
    document.getElementById(e.target.id).appendChild(document.querySelector('.img.hunter'))
    player.setAttribute('id',`${e.target.id}`)
    e.target.remove();
    foodNo--;
    moves.textContent--;
    steps.textContent++;
    isPlaying();
}


// Handle box click
const onHandleClick = (e) => {
    if(gamePlay) {
        let hunter   = document.querySelector('.img.hunter');
        
        if((Number(hunter.id) - 1) === Number(e.target.id) ||
        (Number(hunter.id) + 1) === Number(e.target.id)    ||
        (Number(hunter.id) + 10) === Number(e.target.id)   ||
        (Number(hunter.id) - 10) === Number(e.target.id))
        { 
            movement(e, hunter);
        } 
    }
}

// Handle food click
const handleFoodClick = (e) => {
    if(gamePlay) {
        let hunter = document.querySelector('.img.hunter');
        
        if((Number(hunter.id) - 1) === Number(e.target.id) ||
        (Number(hunter.id) + 1) === Number(e.target.id)    ||
        (Number(hunter.id) + 10) === Number(e.target.id)   ||
        (Number(hunter.id) - 10) === Number(e.target.id))
        { 
            eat(e, hunter);
        }
        
    }  
}



// Game is playing logic
const isPlaying = () => {
    if(moves.textContent < 1) {
        gamePlay = false;
        startTime();
        gameOver.classList.add('active');
        title.textContent = "Game Over";
        msg.textContent = "Sorry, you ran out of moves!";
        grpModal.classList.add('active');
    } 

    if(foodNo <= 0) {
        gamePlay = false;
        for(let i = intervalId.length; i > 0; i--) {
            clearInterval(intervalId[i]);
        }
        gameOver.classList.add('active');
        let next = document.createElement('button')
        next.textContent = "Next"
        next.setAttribute('class','next')
        next.addEventListener('click',nextLevel);
        modal.append(next)
        title.textContent = "HURRAY!!!";
        msg.textContent = "You WON IN " + (noOfMoves - moves.textContent) + " Moves";
        grpModal.classList.add('active');
    }
}


// Render Game grid
const renderTable = (length,position) => {
    const arrayCont = [];
    let table = document.createElement('table');
    table.setAttribute('border','1');
    table.setAttribute('id','table');

    for(let i = 0; i < length; i++){
        let tr = document.createElement('tr');
        tr.setAttribute('id',`${[i]}`);
        table.appendChild(tr)
        
        for(let j = 0; j < length; j++){
            let td = document.createElement('td');
            td.addEventListener('click', onHandleClick)
            td.setAttribute('class','box');
            td.setAttribute('id',`${[i]}${[j]}`);
            arrayCont.push(`${[i]}${[j]}`)
            tr.appendChild(td)
        }  
    }

    position.appendChild(table);
    return arrayCont;
}


// Render Character and food logic
const reduceArr = (array, { url, classGrp, event }) => {
    const img = document.createElement('img');
    img.setAttribute('src', url);
    img.setAttribute('class', classGrp);
    event ? img.addEventListener('click', event): null;

    let pos = Math.floor(Math.random() * array.length)

    document.getElementById(array[pos]).appendChild(img)
    console.log(array[pos]);

    img.setAttribute('id',`${array[pos]}`)

    let arr1 = array.slice(0,pos);
    let arr2 = array.slice(pos + 1, array.length);

    // console.log(arr1,arr2);

    return newArr = [...arr1,...arr2]
}



// Render Character and food logic
const reduceRed = (reducer, url, classGrp, arr, baseCase, event) => {
    if(base >= baseCase){
        base = 0;
        return
    }
    let newRed = reducer(arr, {url, classGrp, event});

    base++;

    reduceRed(reducer, url, classGrp, newRed, baseCase, event)
}


//  Full game play
const run = (val) => {
    if(gamePlay) {
        start.setAttribute('disabled','disabled')
    }

    foodNo = val;
    
    noOfMoves = gameStarted(val)

    const boxIds = renderTable(val,center);
    // console.log(boxIds);

    const notHunterPos = reduceArr(boxIds, { url:'./images/image.svg', classGrp: 'img hunter' });
    // console.log(notHunterPos);

    const foodPos = reduceRed(reduceArr, './images/food.svg', 'img food', notHunterPos, val, handleFoodClick)
}


// Game run
start.addEventListener('click', () => {
    run(grid.value);
})


//  Calling init function
init();

