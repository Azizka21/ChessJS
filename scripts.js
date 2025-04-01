window.onload = function() {
    new Board()
}

class Piece {
    constructor(pieceType, color) {
        this.pieceType = pieceType;
        this.color = color;
    }
}

class Cell {
    constructor(row, column, piece) {
        this.position = this.getPosition(row,column);
        this.piece = new Piece(piece[0], piece[1]);
    }
    getPosition(row, column) {
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
    [
    [null, null], [null, null], [null, null], [null, null],
    [null, null], [null, null], [null, null], [null, null],
    ],
    [
    [null, null], [null, null], [null, null], [null, null],
    [null, null], [null, null], [null, null], [null, null],
    ],
    [
    [null, null], [null, null], [null, null], [null, null],
    [null, null], [null, null], [null, null], [null, null],
    ],
    [
    [null, null], [null, null], [null, null], [null, null],
    [null, null], [null, null], [null, null], [null, null],
    ],
    [
    ["Pawn", "black"], ["Pawn", "black"], ["Pawn", "black"], ["Pawn", "black"],
    ["Pawn", "black"], ["Pawn", "black"], ["Pawn", "black"], ["Pawn", "black"]
    ],
    [
    ["Rook", "black"], ["Knight", "black"], ["Bishop", "black"], ["Queen", "black"],
    ["King", "black"], ["Bishop", "black"], ["Knight", "black"], ["Rook", "black"]
    ]
];
