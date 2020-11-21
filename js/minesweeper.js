// 💣, 🚩

const MINE = '💣';
const FLAG = '🚩';
const EMPTY = ' ';

var gLevel;
var gBoard;
var gIntervalId;
var gIsVictory;

var numCellLevel;
var mineAmount;
var mineCounter;//הצגת כמות המוקשים בלוח
var mineVar;// משתנה לעדכון mineCounter
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

var cell = {
    isShown: false,
    isMine: false,
    isMarked: false, // How many cells are marked (with a flag)
    minesAroundCount: 0,
};

var numCellLevel = 4;
var mineAmount = 2;
var firstCellClick;
var countNoMine;
var renderCellsArray = [];

function reload() {
    closeModal();
    var elSmiley = document.querySelector('.smiley');
    elSmiley.innerText = '😀';
    init();
}

function init() {
    gGame.isOn = true;
    firstCellClick = true;
    gIsVictory = false;
    mineVar = 0;
    countNoMine = 0;
    gBoard = createBoard(numCellLevel, mineAmount)
    console.table('gBoard', gBoard);
    renderBoard(gBoard);
    clearInterval(gIntervalId);
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
            mat[i][j] = ' ';
        }
    }
    return mat
}

//Render the board as a <table> to the page
function renderBoard(board) {
    var strHtml = '';
    for (var i = 0; i < board.length; i++) {
        strHtml += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            var tdId = 'cell-' + i + '-' + j;
            strHtml += `<td id="${tdId}"  class="${'covered'}">${board[i][j]}</td>`//onclick="cellClicked(this)"
        }
    }
    strHtml += '</tr>'

    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHtml;
}

// Move the player by keyboard arrows
function handleKey(event) {
    if (firstCellClick) {
        timer();
        placeMines()
        firstCellClick = false;
    }
    var elCell = event.srcElement;
    if (event.which === 1) {
        cellClicked(elCell);
    } else if (event.which === 3) {
        cellMarked(elCell)
    }
}

//Called when a cell (td) is clicked
function cellClicked(elCell) {
    // if (!cell.isMarked) {
        var coords = getCellCoord(elCell.id);
        cell.isShown = true;
        if (gBoard[coords.i][coords.j] === MINE) {
            cell.isMine = true;
            renderCell(coords, MINE)
            GameOver(elCell);
        } else {
            elCell.classList.add('un');
            var neighbors = setMinesNegsCount(coords.i, coords.j)
            renderCell(coords, neighbors)
            //isVictory();//???
        }
    // }
}


function expandShown(board, elCell, i, j) {

    
}
// When user clicks a cell with no mines around, we need to open
// not only that cell, but also its neighbors.
// NOTE: start with a basic implementation that only opens
// the non-mine 1st degree neighbors.
// BONUS: if you have the time later, try to work more like the
// real algorithm (see description at the Bonuses section below)



// Called on right click to mark a cell (suspected to be a mine)
// Search the web (and implement) how to hide the context menu on right click

function cellMarked(elCell) {
    if (elCell.innerText === '🚩') {
        mineVar = 1
        howManyMines(mineVar);
        elCell.innerText = ' ';
        cell.isMarked = false;
    } else {
        if (mineCounter > 0) {
            mineVar = -1;
            howManyMines(mineVar);
            cell.isMarked = true;
            elCell.innerText = '🚩';
        }
    }
}


// Count mines around each cell and set the cell's minesAroundCount.
function setMinesNegsCount(cellI, cellJ) {
    if (gBoard[cellI][cellJ] !== MINE) {
        var neighborsSum = 0;
        for (var i = cellI - 1; i <= cellI + 1; i++) {
            if (i < 0 || i >= gBoard.length) continue;
            for (var j = cellJ - 1; j <= cellJ + 1; j++) {
                if (i === cellI && j === cellJ) continue;
                if (j < 0 || j >= gBoard[i].length) continue;
                if (gBoard[i][j] === MINE) neighborsSum++;
            }
        }
    }
    if (neighborsSum > 0) {
        gBoard[cellI][cellJ] = neighborsSum;
        return neighborsSum;
    } else gBoard[cellI][cellJ] = ' ';
    neighborsSum = ' ';
    return neighborsSum;
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

var minesIdx;
//Dina- start working at first onclick on the board
function placeMines() {
    minesIdx = getRAndomMine(mineAmount);//מערך של אובייקטים 
    for (var i = 0; i < minesIdx.length; i++) {
        var singleMineIdx = minesIdx[i];//איתור אובייקט במערך הגדול לפי ה-i
        gBoard[singleMineIdx.i][singleMineIdx.j] = MINE;//עדכון התא בלוח

    }
}

function getRAndomMine(mineCount) {
    var randomI = 0;
    var randomJ = 0;
    var randomCellArray = [];
    for (var i = 0; i < mineCount; i++) {
        randomI = getRandomInt(0, numCellLevel);
        randomJ = getRandomInt(0, numCellLevel);
        var cell = { i: randomI, j: randomJ };
        randomCellArray.push(cell)
    }
    return randomCellArray;
}

function howManyMines() {
    mineCounter += mineVar;
    document.querySelector('.bomb').innerHTML = '💣' + mineCounter;
}

//Game ends when all mines are marked, and all the other cells are shown and the timer is stoped
function GameOver(elCell) {
    gGame.isOn = false;
    //gIsVictory= false;
    elCell.style.backgroundColor = "red";
    for (var i = 0; i < minesIdx.length; i++) {
        var singleMineIdx = minesIdx[i];//איתור אובייקט במערך הגדול לפי ה-i
        var elBomb = document.querySelector(`[id="cell-${singleMineIdx.i}-${singleMineIdx.j}"]`)
        elBomb.classList.add('un');
        renderCell(singleMineIdx, MINE);//עדכון ב-DOM
    }
    clearInterval(gIntervalId);
    openModal();
    var elSmiley = document.querySelector('.smiley');
    elSmiley.innerText = '🤯';
}

//all mines is flaged + all noMines cell open

//function isVictory() {
    countNoMine = 0;
    for (var k = 0; k < minesIdx.length; k++) {
        for (var i = 0; i < gBoard.length; i++) {
            for (var j = 0; j < gBoard[0].length; j++) {
                var currCell = { i: i, j: j };
                var currMineIdx = minesIdx[k];
                console.log('currMineIdx', currMineIdx);
                console.log('currCell', currCell);
                if ((currCell.i === currMineIdx.i) && (currCell.j === currMineIdx.j)) break //console.log(true);
                else {
                    countNoMine++;
                    console.log(false);
                }
            }
        }
    }
    var elSmiley = document.querySelector('.smiley');
    elSmiley.innerText = '😎';
// }
