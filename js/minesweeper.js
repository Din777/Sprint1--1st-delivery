// 💣, 🚩

const MINE = '💣';
const FLAG = '🚩';
const EMPTY = ' ';

var gLevel;
var gBoard;
var gIntervalId;

var numCellLevel;
var mineAmount;
var mineCounter;
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

var cell = {
    isShown: false,
    isMine: false,
    isMarked: true, // How many cells are marked (with a flag)
    minesAroundCount: 0,
};

var mineCoord1 = { i: 1, j: 3 };
var mineCoord2 = { i: 2, j: 2 };

var numCellLevel = 4;
var mineAmount = 2;
var firstCellClick = true;

function init() {
    gGame.isOn = true;
    gBoard = createBoard(numCellLevel, mineAmount)
    console.table('gBoard', gBoard);
    renderBoard(gBoard);
    clearInterval(gIntervalId);
    firstCellClick = true;
    mineCounter = mineAmount;
    howManyMines(mineCounter);
}

function setLevel(elLevel) {
    switch (elLevel.innerText) {
        case 'Begginer':
            mineAmount = 2;
            numCellLevel = 4;
            gLevel = numCellLevel * 2;
            break
        case 'Medium':
            mineAmount = 12
            numCellLevel = 8;
            gLevel = numCellLevel * 2;
            break
        case 'Expert':
            mineAmount = 30;
            numCellLevel = 12;
            gLevel = numCellLevel * 2;
            break
    }
    init()
}


//Builds the board
// Set mines at random locations- Step4
// Call setMinesNegsCount()
// Return the created board

function createBoard(size) {
    var mat = [];
    for (var i = 0; i < size; i++) {
        mat[i] = []
        for (var j = 0; j < size; j++) {
            if ((i === 1 && j === 3) ||
                (i === 2 && j === 2)) {
                mat[i][j] = MINE; 
            } else {
                mat[i][j] = EMPTY;
            }
        }
    }
    for (var i = 0; i < mat.length; i++) {
        var iIdx = i;
        for (var j = 0; j < mat[0].length; j++) {
            var jIdx = j;
            setMinesNegsCount(iIdx, jIdx, mat);
        }
    }
    return mat
}

//Dina- start working at first onclick on the board
function placeMines() {
    var minesIdx = getRAndomMine(mineAmount);//מערך של אובייקטים לפי תאים ריקים בלוח
    for (var i = 0; i < minesIdx.length; i++) {
        var singleMineIdx = minesIdx[i];//איתור אובייקט במערך הגדול לפי ה-i
        gBoard[singleMineIdx.i][singleMineIdx.j] = MINE;//עדכון התא בלוח
        renderCell(singleMineIdx, MINE);//עדכון ב-DOM
    }
}

function getRAndomMine(mineCount) {
    var randomI = 0;
    var randomJ = 0;
    var randomCellArray = [];
    for (var i = 0; i <= mineCount; i++) {
        randomI = getRandomInt(0, numCellLevel);
        randomJ = getRandomInt(0, numCellLevel);
        var cell = { i: randomI, j: randomJ };
        randomCellArray.push(cell)
    }
    return randomCellArray;
}


// Count mines around each cell and set the cell's minesAroundCount.
function setMinesNegsCount(cellI, cellJ, mat) {
    if (mat[cellI][cellJ] !== MINE) {
        var neighborsSum = 0;
        for (var i = cellI - 1; i <= cellI + 1; i++) {
            if (i < 0 || i >= mat.length) continue;
            for (var j = cellJ - 1; j <= cellJ + 1; j++) {
                if (i === cellI && j === cellJ) continue;
                if (j < 0 || j >= mat[i].length) continue;
                if (mat[i][j] === MINE) neighborsSum++;
            }
        }
    }
    if (neighborsSum > 0) mat[cellI][cellJ] = neighborsSum;

}

//Render the board as a <table> to the page
function renderBoard(board) {
    var strHtml = '';
    for (var i = 0; i < board.length; i++) {
        strHtml += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            var tdId = 'cell-' + i + '-' + j;
            strHtml += `<td id="${tdId}" onclick="cellClicked(this)" class="${'covered'}">${board[i][j]}</td>`
        }
    }
    strHtml += '</tr>'

    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHtml;
}

//Called when a cell (td) is clicked
function cellClicked(elCell, i, j) {
    if (firstCellClick) {
        timer();
        firstCellClick = false;
    }
    if (elCell.innerText === MINE) {
        checkGameOver(elCell);
    }
    elCell.classList.add('un')
}

function timer() {
    var startTime = Date.now();
    gIntervalId = setInterval(function () {
        var elapsedTime = Date.now() - startTime;
        document.querySelector('.timer').innerHTML = '⏰' + (elapsedTime / 1000).toFixed(
            0
        );
    }, 100);
}

function howManyMines(mineCounter) {
    document.querySelector('.bomb').innerHTML = '💣' + mineCounter;
    mineCounter--;
}


//cellMarked(elCell)
// Called on right click to mark a cell (suspected to be a mine)
// Search the web (and implement) how to hide the context menu on right click

//Game ends when all mines are marked, and all the other cells are shown and the timer is stoped
function checkGameOver(elCell) {
gGame.isOn = false;
elCell.style.backgroundColor = "red";
clearInterval(gIntervalId);
firstCellClick = true;
}


//expandShown(board, elCell, i, j)
// When user clicks a cell with no mines around, we need to open
// not only that cell, but also its neighbors.
// NOTE: start with a basic implementation that only opens
// the non-mine 1st degree neighbors.
// BONUS: if you have the time later, try to work more like the
// real algorithm (see description at the Bonuses section below)
