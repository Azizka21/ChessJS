window.onload = function() {
    new Board()
}

class Piece {
    constructor(color) {
        this.color = color
    }
}

class Cell {
    constructor(row, column, piece = null) {
        this.position = this.getPosition(row,column)
        this.piece = piece;
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
    constructor(rowIndex) {
        this.cells = []
        this.index = rowIndex
        for (let i=1; i<=8; i++) {
            this.cells.push(new Cell(this.index, i));
        }
    }
}

class Board {
    constructor() {
        this.rows = []
        for (let i=1; i<=8; i++) {
            this.rows.push(new Row(i));
        }
        console.dir(this)
    }
}