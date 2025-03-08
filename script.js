const gridSize = 9;
const subGridSize = 3;
let board = [];
let globalDifficulty = localStorage.getItem('difficulty') ? localStorage.getItem('difficulty') : 'Easy';
// const selectTag = document.getElementById('difficulty');
if(globalDifficulty){
    // selectTag.value = globalDifficulty;
    document.getElementById('difficultyValue').innerHTML = globalDifficulty;
}

let gameModes = document.querySelectorAll('.game-mode');
console.log(gameModes.length);
gameModes.forEach(gameMode=>{
// for(let i=0; i<gameModes.length; i++){
    gameMode.addEventListener('onclick',selectGameModess(gameMode))
})

function selectGameMode(){
    console.log('njbhg');
}

function selectGameModess(gameMode){
//     try{
        console.log('Inside selectGameMode');
        // {
            console.log('Mode Clicked');
            console.log(gameMode);
        // }
//         // let gameModes = document.querySelectorAll('.game-mode');
//         // console.log(gameModes.length);
//         // gameModes.forEach(gameMode=>{
//         //     console.log(gameMode.innerHTML);
//         // })
//         console.log(event.innerHTML);
//     }catch(error){
//         console.log('Error in selectGameMode');
//         console.log(error.message);
//     }
}

// function startTimer(){
//     let seconds = 0;
//     let timerInterval = null;
//     if (timerInterval === null) {
//         timerInterval = setInterval(() => {
//             seconds++;
//             document.getElementById("timer").innerText = formatTime(seconds);
//         }, 1000);
//     }
// }

// function formatTime(totalSeconds) {
//     let hrs = Math.floor(totalSeconds / 3600);
//     let mins = Math.floor((totalSeconds % 3600) / 60);
//     let secs = totalSeconds % 60;
//     return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
// }

window.onload = function(){
    try{
        generateButtonClick();
    }catch(error){
        console.log('Error in window.onload');
        console.log(error.message);
    }
}

function selectDifficulty(){
    globalDifficulty = document.getElementById('difficulty').value;
    localStorage.setItem('difficulty', globalDifficulty);
    document.getElementById('difficultyValue').innerHTML = globalDifficulty;
}

function generateButtonClick(){
    try{
        if(board.length > 0){
            sudokuTableElement.innerHTML = '';
        }
        generateSudoku(globalDifficulty);
    }catch(error){
        console.log('Error in generateButtonClick');
        console.log(error.message);
    }
}

function generateSudoku(difficulty) {
    generateSolvedBoard();
    let puzzle = createPuzzle(difficulty);
    displayBoard(puzzle);
    // startTimer();
    setMouseHover();
}

function generateSolvedBoard() {
    board = Array.from({ length: gridSize }, () => Array(gridSize).fill(0));
    fillBoard(board);
}

function fillBoard(board) {
    let empty = findEmpty(board);
    if (!empty) return true;
    
    let [row, col] = empty;
    let numbers = shuffle([...Array(gridSize).keys()].map(x => x + 1));
    
    for (let num of numbers) {
        if (isValid(board, row, col, num)) {
            board[row][col] = num;
            if (fillBoard(board)) return true;
            board[row][col] = 0;
        }
    }
    return false;
}

function findEmpty(board) {
    for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
            if (board[r][c] === 0) return [r, c];
        }
    }
    return null;
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function isValid(board, row, col, num) {
    for (let i = 0; i < gridSize; i++) {
        if ((board[row][i] === num && i != col) || (board[i][col] === num && i != row)) {
            return false;
        }
    }
    let startRow = row - row % subGridSize;
    let startCol = col - col % subGridSize;
    for (let r = 0; r < subGridSize; r++) {
        for (let c = 0; c < subGridSize; c++) {
            if (board[startRow + r][startCol + c] === num && !((startRow + r) == row && (startCol + c) == col)) return false;
        }
    }
    return true;
}

function validateInput(row,col) {
    let input = document.getElementById(`cell-${row}-${col}`);
    let value = parseInt(input.value) || 0;
    if (value < 1 || value > 9) {
        input.value = '';
        return;
    }
    
    board[row][col] = value;
    if (!isValid(board, row, col, value)) {
        input.style.backgroundColor = 'red';
    } else {
        input.style.backgroundColor = 'white';
        if(this.showWonConfetti()){
            showConfettiFunction();
        }
    }
}

function showWonConfetti(){
    let emptyCells = document.querySelectorAll('.cell-input');
    for(let i =0 ;i < emptyCells.length; i++){
        if(emptyCells[i].value == '') {
            return false;
        };
    }
    return true;
}

function createPuzzle(difficulty) {
    let attempts = difficulty === 'Easy' ? 30 : difficulty === 'Medium' ? 40 : 50;
    let puzzle = board.map(row => [...row]);
    
    while (attempts > 0) {
        let row = Math.floor(Math.random() * gridSize);
        let col = Math.floor(Math.random() * gridSize);
        if (puzzle[row][col] !== 0) {
            puzzle[row][col] = 0;
            attempts--;
        }
    }
    return puzzle;
}

const sudokuTableElement = document.querySelector(".sudoku-table")

function displayBoard(board){
    for(let i=0; i<9; i++){
        createEachRow(board[i],i)
    }
}

function createEachRow(row,rowIndex){
    const rowElement = document.createElement("div")
    rowElement.classList.add('cell-row')
    rowElement.setAttribute('cellRowIndex',rowIndex)
    for(let i=0; i<9; i++){
        rowElement.append(createCell(row[i],rowIndex,i))
    }
    sudokuTableElement.append(rowElement);
}

function setMouseHover(){
    let cells = document.querySelectorAll('.cell');
    cells.forEach(cell=>{
        cell.addEventListener('mouseover',()=>{
            let row = cell.getAttribute('rowindex');
            let column = cell.getAttribute('columnindex');
            cells.forEach(c=>{
                if(c.getAttribute('rowindex') == row || c.getAttribute('columnindex') == column){
                    c.classList.add('highlight-cell');
                }
                let startRow = Number(row - row % Number(subGridSize));
                let startCol = Number(column - column % Number(subGridSize));
                let rowIndex = Number(c.getAttribute('rowindex'));
                let columnIndex = Number(c.getAttribute('columnindex'));
                if(startRow <= rowIndex && rowIndex < startRow + Number(subGridSize) && startCol <= columnIndex && columnIndex < startCol + Number(subGridSize)){
                    c.classList.add('highlight-cell');
                }
            })
        })
        cell.addEventListener('mouseout',()=>{
            cells.forEach(c=>{
                c.classList.remove('highlight-cell');
            })
        })
    })
}

function createCell(rowValue,rowIndex,columnIndex){
    const cellElement = document.createElement("div")
    cellElement.classList.add('cell');
    cellElement.classList.add(`cell-element-${rowIndex}-${columnIndex}`);
    cellElement.setAttribute('rowIndex', rowIndex);
    cellElement.setAttribute('columnIndex', columnIndex);
    cellElement.classList.add('cell-normal-border');
    if((rowIndex == 2 || rowIndex == 5) && (columnIndex == 2 || columnIndex == 5)){
        cellElement.classList.add('cell-corner-bold-border');
    }else if((rowIndex == 2 || rowIndex == 5) && columnIndex != 8){
        cellElement.classList.add('cell-bottom-bold-border');
    }else if((columnIndex == 2 || columnIndex == 5) && rowIndex != 8){
        cellElement.classList.add('cell-right-bold-border');
    }else if((rowIndex == 2 || rowIndex == 5) && columnIndex == 8){
        cellElement.classList.add('cell-bottom-only-bold-border');
    }else if((columnIndex == 2 || columnIndex == 5) && rowIndex == 8){
        cellElement.classList.add('cell-right-only-bold-border');
    }else if(columnIndex == 8){
        cellElement.classList.add('cell-bottom-border');
    }else if(rowIndex == 8){
        cellElement.classList.add('cell-right-border');
    }
    if(rowValue === 0){
        cellElement.textContent = '';
        cellElement.innerHTML = `<input id="cell-${rowIndex}-${columnIndex}" class="cell-input" oninput="validateInput(${rowIndex},${columnIndex})"></input>`;
        cellElement.style.backgroundColor = 'ghostwhite';
    }else{
        cellElement.textContent = rowValue;
    }
    return cellElement;
}

class ConfettiManager {
    constructor() {
        this.canvas = document.createElement("canvas");
        this.canvas.style = "position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 1000; pointer-events: none;";
        document.body.appendChild(this.canvas);
        this.context = this.canvas.getContext("2d");
        this.confetti = [];
        this.lastUpdated = Date.now();
        window.addEventListener("resize", Utils.debounce(() => this.resizeCanvas(), 200));
        this.resizeCanvas();
        requestAnimationFrame(() => this.loop());
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth * window.devicePixelRatio;
        this.canvas.height = window.innerHeight * window.devicePixelRatio;
    }

    addConfetti(config = {}) {
        const { confettiesNumber, confettiRadius, confettiColors, emojies, svgIcon } = {
            ...defaultConfettiConfig,
            ...config,
        };

        const baseY = (5 * window.innerHeight) / 7;
        for (let i = 0; i < confettiesNumber / 2; i++) {
            this.confetti.push(new Confetti({
            initialPosition: { x: 0, y: baseY },
            direction: "right",
            radius: confettiRadius,
            colors: confettiColors,
            emojis: emojies,
            svgIcon,
            }));
            this.confetti.push(new Confetti({
            initialPosition: { x: window.innerWidth, y: baseY },
            direction: "left",
            radius: confettiRadius,
            colors: confettiColors,
            emojis: emojies,
            svgIcon,
            }));
        }
    }

    resetAndStart(config = {}) {
        this.confetti = [];
        this.addConfetti(config);
    }

    loop() {
        const currentTime = Date.now();
        const deltaTime = currentTime - this.lastUpdated;
        this.lastUpdated = currentTime;

        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.confetti = this.confetti.filter((item) => {
            item.updatePosition(deltaTime, currentTime);
            item.draw(this.context);
            return item.isVisible(this.canvas.height);
        });

        requestAnimationFrame(() => this.loop());
    }
}

const Utils = {
    parsePx: (value) => parseFloat(value.replace(/px/, "")),

    getRandomInRange: (min, max, precision = 0) => {
        const multiplier = Math.pow(10, precision);
        const randomValue = Math.random() * (max - min) + min;
        return Math.floor(randomValue * multiplier) / multiplier;
    },

    getRandomItem: (array) => array[Math.floor(Math.random() * array.length)],

    getScaleFactor: () => Math.log(window.innerWidth) / Math.log(1920),

    debounce: (func, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), delay);
        };
    },
};

const DEG_TO_RAD = Math.PI / 180;

const defaultConfettiConfig = {
    confettiesNumber: 250,
    confettiRadius: 6,
    confettiColors: [
    "#fcf403", "#62fc03", "#f4fc03", "#03e7fc", "#03fca5", "#a503fc", "#fc03ad", "#fc03c2"
    ],
    emojies: [],
    svgIcon: null,
};

class Confetti {
    constructor({ initialPosition, direction, radius, colors, emojis, svgIcon }) {
        const speedFactor = Utils.getRandomInRange(0.9, 1.7, 3) * Utils.getScaleFactor();
        this.speed = { x: speedFactor, y: speedFactor };
        this.finalSpeedX = Utils.getRandomInRange(0.2, 0.6, 3);
        this.rotationSpeed = emojis.length || svgIcon ? 0.01 : Utils.getRandomInRange(0.03, 0.07, 3) * Utils.getScaleFactor();
        this.dragCoefficient = Utils.getRandomInRange(0.0005, 0.0009, 6);
        this.radius = { x: radius, y: radius };
        this.initialRadius = radius;
        this.rotationAngle = direction === "left" ? Utils.getRandomInRange(0, 0.2, 3) : Utils.getRandomInRange(-0.2, 0, 3);
        this.emojiRotationAngle = Utils.getRandomInRange(0, 2 * Math.PI);
        this.radiusYDirection = "down";

        const angle = direction === "left" ? Utils.getRandomInRange(82, 15) * DEG_TO_RAD : Utils.getRandomInRange(-15, -82) * DEG_TO_RAD;
        this.absCos = Math.abs(Math.cos(angle));
        this.absSin = Math.abs(Math.sin(angle));

        const offset = Utils.getRandomInRange(-150, 0);
        const position = {
            x: initialPosition.x + (direction === "left" ? -offset : offset) * this.absCos,
            y: initialPosition.y - offset * this.absSin
        };

        this.position = { ...position };
        this.initialPosition = { ...position };
        this.color = emojis.length || svgIcon ? null : Utils.getRandomItem(colors);
        this.emoji = emojis.length ? Utils.getRandomItem(emojis) : null;
        this.svgIcon = null;

        if (svgIcon) {
            this.svgImage = new Image();
            this.svgImage.src = svgIcon;
            this.svgImage.onload = () => {
            this.svgIcon = this.svgImage;
            };
        }

        this.createdAt = Date.now();
        this.direction = direction;
    }

    draw(context) {
        const { x, y } = this.position;
        const { x: radiusX, y: radiusY } = this.radius;
        const scale = window.devicePixelRatio;

        if (this.svgIcon) {
            context.save();
            context.translate(scale * x, scale * y);
            context.rotate(this.emojiRotationAngle);
            context.drawImage(this.svgIcon, -radiusX, -radiusY, radiusX * 2, radiusY * 2);
            context.restore();
        } else if (this.color) {
            context.fillStyle = this.color;
            context.beginPath();
            context.ellipse(x * scale, y * scale, radiusX * scale, radiusY * scale, this.rotationAngle, 0, 2 * Math.PI);
            context.fill();
        } else if (this.emoji) {
            context.font = `${radiusX * scale}px serif`;
            context.save();
            context.translate(scale * x, scale * y);
            context.rotate(this.emojiRotationAngle);
            context.textAlign = "center";
            context.fillText(this.emoji, 0, radiusY / 2);
            context.restore();
        }
    }

    updatePosition(deltaTime, currentTime) {
        const elapsed = currentTime - this.createdAt;

        if (this.speed.x > this.finalSpeedX) {
            this.speed.x -= this.dragCoefficient * deltaTime;
        }

        this.position.x += this.speed.x * (this.direction === "left" ? -this.absCos : this.absCos) * deltaTime;
        this.position.y = this.initialPosition.y - this.speed.y * this.absSin * elapsed + 0.00125 * Math.pow(elapsed, 2) / 2;

        if (!this.emoji && !this.svgIcon) {
            this.rotationSpeed -= 1e-5 * deltaTime;
            this.rotationSpeed = Math.max(this.rotationSpeed, 0);

            if (this.radiusYDirection === "down") {
            this.radius.y -= deltaTime * this.rotationSpeed;
            if (this.radius.y <= 0) {
                this.radius.y = 0;
                this.radiusYDirection = "up";
            }
            } else {
            this.radius.y += deltaTime * this.rotationSpeed;
            if (this.radius.y >= this.initialRadius) {
                this.radius.y = this.initialRadius;
                this.radiusYDirection = "down";
            }
            }
        }
    }

    isVisible(canvasHeight) {
        return this.position.y < canvasHeight + 100;
    }
}

function showConfettiFunction(){
    const manager = new ConfettiManager();
    manager.addConfetti();
}