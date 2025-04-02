window.onload = function() {
    Board = new Board()
    Board.renderBoard()
}


document.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        console.log("Нажат Enter!");
        Board.movePiece("a1","c2")
    }
})


class Piece {
    constructor(pieceType, color) {
        this.pieceType = pieceType;
        this.color = color;
    }
}

class Cell {
    constructor(row, column, piece) {
        this.col = column
        this.position = coordsToChess(row,column);
        this.color = (row + column) % 2 == 0 ? "white-cell" : "black-cell"
        if (piece) {
            this.piece = new Piece(piece[0], piece[1]);
        }
        else {
            this.piece = null
        }
    }
}

class Row {
    constructor(rowIndex, rowStatement) {
        this.cells = []
        this.index = rowIndex
        for (let i = 0; i < 8; i++) {
            this.cells.push(new Cell(this.index, i , rowStatement[i]));
        }
    }
}

class Board {
    constructor(statement = startposition) {
        this.rows = []
        for (let i = 0; i < 8; i++) {
            this.rows.push(new Row(i, statement[i]));
        }
        console.dir(this)
    }
    movePiece(oldPos, newPos) {
        oldPos = chessToCoords(oldPos);
        newPos = chessToCoords(newPos);
        let oldCell = this.rows[oldPos[0]].cells[oldPos[1]];
        let newCell = this.rows[newPos[0]].cells[newPos[1]];
        let piece = oldCell.piece;
        console.log(piece);
        console.log(oldCell);
        console.log(newCell)
        oldCell.piece = null;
        newCell.piece = piece;
    }

    renderBoard() {
        let boardDiv = document.createElement('div')
        boardDiv.className = "board"
        for (let row of this.rows) {
            for (let cell of row.cells) {
                let cellDiv = document.createElement('div')
                cellDiv.className = cell.color

                // Add piece visually
                if (cell.piece) {
                    if (cell.piece.color == "white") {
                        const piecesPNG = {
                            Pawn: '<img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Chess_plt60.png">',
                            Rook: '<img src="https://upload.wikimedia.org/wikipedia/commons/5/5c/Chess_rlt60.png">',
                            Knight: '<img src="https://upload.wikimedia.org/wikipedia/commons/2/28/Chess_nlt60.png">',
                            Bishop: '<img src="https://upload.wikimedia.org/wikipedia/commons/9/9b/Chess_blt60.png">',
                            King: '<img src="https://upload.wikimedia.org/wikipedia/commons/3/3b/Chess_klt60.png">',
                            Queen: '<img src="https://upload.wikimedia.org/wikipedia/commons/4/49/Chess_qlt60.png">',


                        };
                        cellDiv.innerHTML = piecesPNG[cell.piece.pieceType]

                    } else {
                        const piecesPNG = {
                            Pawn: '<img src="https://upload.wikimedia.org/wikipedia/commons/c/cd/Chess_pdt60.png">',
                            Rook: '<img src="https://upload.wikimedia.org/wikipedia/commons/a/a0/Chess_rdt60.png">',
                            Knight: '<img src="https://upload.wikimedia.org/wikipedia/commons/f/f1/Chess_ndt60.png">',
                            Bishop: '<img src="https://upload.wikimedia.org/wikipedia/commons/8/81/Chess_bdt60.png">',
                            King: '<img src="https://upload.wikimedia.org/wikipedia/commons/e/e3/Chess_kdt60.png">',
                            Queen: '<img src="https://upload.wikimedia.org/wikipedia/commons/a/af/Chess_qdt60.png">',
                        };
                        cellDiv.innerHTML = piecesPNG[cell.piece.pieceType]
                    }
                }

                boardDiv.appendChild(cellDiv)
            }
        }
        document.body.appendChild(boardDiv)
    }
}

function coordsToChess(row, column) {
    const numToLetter = "abcdefgh"
    return numToLetter[column] + (row+1).toString()
}

function chessToCoords(chessNotation) {
    const letterToNum = "abcdefgh";
    return [parseInt(chessNotation[1]) - 1, letterToNum.indexOf(chessNotation[0])]
}

const startposition = [
    [
    ["Rook", "white"], ["Knight", "white"], ["Bishop", "white"], ["Queen", "white"],
    ["King", "white"], ["Bishop", "white"], ["Knight", "white"], ["Rook", "white"]
    ],
    [
    ["Pawn", "white"], ["Pawn", "white"], ["Pawn", "white"], ["Pawn", "white"],
    ["Pawn", "white"], ["Pawn", "white"], ["Pawn", "white"], ["Pawn", "white"]
    ],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [
    ["Pawn", "black"], ["Pawn", "black"], ["Pawn", "black"], ["Pawn", "black"],
    ["Pawn", "black"], ["Pawn", "black"], ["Pawn", "black"], ["Pawn", "black"]
    ],
    [
    ["Rook", "black"], ["Knight", "black"], ["Bishop", "black"], ["Queen", "black"],
    ["King", "black"], ["Bishop", "black"], ["Knight", "black"], ["Rook", "black"]
    ]
];
