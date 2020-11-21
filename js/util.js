function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}


function renderCell(location, value) {
    var renderCell = {i:location.i, j:location.j};
    renderCellsArray.push(renderCell);
    var elCell = document.querySelector(`[id="cell-${location.i}-${location.j}"]`);// 'cell-' + i + '-' + j // id="cell-i-j"
    elCell.innerText = value;
}


// Gets a string such as:  'cell-2-7' and returns {i:2, j:7}
function getCellCoord(strCellId) {
    var parts = strCellId.split('-')
    var coord = { i: +parts[1], j: +parts[2] };
    return coord;
}

function openModal(gIsVictory) {
    if (!gIsVictory) {
        document.querySelector('.modal h3').innerText = 'Game over!';
        document.querySelector('.modal').style.display = 'block';
    } else {
        document.querySelector('.modal h3').innerText = 'Congratulations! You won!!🏆';
        document.querySelector('.modal').style.display = 'block';
    }
}

function closeModal() {
    document.querySelector('.modal').style.display = 'none';
}