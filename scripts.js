window.onload = function() {
    MakeBoard();
}
function MakeBoard() {
    let boardDiv = document.createElement('div');
    boardDiv.className = "board"
    for (let i = 0; i < 64; i++) {
        let cellDiv = document.createElement('div')
        if (Math.floor(i / 8) % 2 == 1) {
            if (i % 2 == 1) {
                cellDiv.className = "white-cell"
            } else {
                cellDiv.className = "black-cell"
            }
        } else {
            if (i % 2 == 1) {
                cellDiv.className = "black-cell"
            } else {
                cellDiv.className = "white-cell"
            }
        }
            boardDiv.appendChild(cellDiv)
    }
    document.body.appendChild(boardDiv)
}