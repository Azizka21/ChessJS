window.onload = function() {
    Board = new Board()
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
        this.position = coordsToChess(row,column);
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
        for (let i=1; i<=8; i++) {
            this.cells.push(new Cell(this.index, i, rowStatement[i-1]));
        }
    }
}

class Board {
    constructor(statement = startposition) {
        this.rows = []
        for (let i = 1; i <= 8; i++) {
            this.rows.push(new Row(i, statement[i - 1]));
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
}

function coordsToChess(row, column) {
    const numToLetter = {
        1: "a",
        2: "b",
        3: "c",
        4: "d",
        5: "e",
        6: "f",
        7: "g",
        8: "h"
    };
    return numToLetter[column] + row.toString()
}

function chessToCoords(chessNotation) {
    const letterToNum = {
        "a": 0,
        "b": 1,
        "c": 2,
        "d": 3,
        "e": 4,
        "f": 5,
        "g": 6,
        "h": 7
    }
    return [parseInt(chessNotation[1] - 1), letterToNum[chessNotation[0]]]
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
