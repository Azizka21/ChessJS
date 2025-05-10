window.onload = function() {
    board = new Board();
    boardDiv = board.renderBoard();
    boardDiv.addEventListener('click', (ev) => {
        const cell = ev.target.closest('.cell')
        if (cell) {
            if (board.isTaking) {
                if (cell.jsCell.piece && cell.jsCell.piece.color === board.turnColor) {
                    board.takePiece(cell)
                }
            } else {
                board.putPiece(cell)
            }
        }
    })
}


document.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        console.log("Нажат Enter!");
    }
})

document.addEventListener("mousemove", function(event) {
    if (Board.picked) {
        console.log("moved")
    }
})


class Piece {
    constructor(color, pieceType) {
        this.color = color;
        this.pieceType = pieceType;
        this.movesCount = 0
    };
    getPossibleTurns() {
        this.possibleTurns = [];
        return this.possibleTurns
    }
}

class SlidePiece extends Piece {
    constructor(color, pieceType, directions) {
        super(color, pieceType);
        this.directions = directions
    }

    getPossibleTurns(cell, board, checkSafety = true) {
        this.possibleTurns = [];
        for (let [dx, dy] of this.directions) {
            let x = cell.col + dx
            let y = cell.row + dy
            while (x >= 0 && x < 8 && y >= 0 && y < 8) {
                let newCell = board.getCellByCoords(x, y);
                if (newCell.piece) {
                    if (newCell.piece.color == this.color) {
                        break
                    }
                    if (!checkSafety || board.isSafeMove(cell, newCell)) {
                        this.possibleTurns.push(coordsToChess(x, y))
                    }
                    break
                }
                if (!checkSafety || board.isSafeMove(cell, newCell)) {
                    this.possibleTurns.push(coordsToChess(x, y))
                }
                x += dx
                y += dy
            }
        }
        return this.possibleTurns
    }
}

class StepPiece extends Piece {
    constructor(color, pieceType, moves) {
        super(color, pieceType);
        this.moves = moves
    }
    getPossibleTurns(cell, board, checkSafety = true) {
        this.possibleTurns = [];
        for (let [dx, dy] of this.moves) {
            let x = cell.col + dx
            let y = cell.row + dy
            if (x >= 0 && x < 8 && y >= 0 && y < 8) {
                let newCell = board.getCellByCoords(x, y);
                if (!newCell.piece) {
                    if (!checkSafety || board.isSafeMove(cell, newCell)) {
                        this.possibleTurns.push(coordsToChess(x, y))
                    }
                    continue;
                }
                if (newCell.piece.color !== this.color) {
                    if (!checkSafety || board.isSafeMove(cell, newCell)) {
                        this.possibleTurns.push(coordsToChess(x, y))
                    }
                }
            }
        }
        return this.possibleTurns
    }
}


class Rook extends SlidePiece {
    constructor(color) {
        super(color, "Rook", [
            [1,0],
            [-1,0],
            [0,1],
            [0,-1],
        ]);
    }
}

class Bishop extends SlidePiece {
    constructor(color,) {
        super(color, "Bishop", [
            [1,1],
            [1,-1],
            [-1,1],
            [-1,-1],
        ]);
    }
}

class Queen extends SlidePiece {
    constructor(color) {
        super(color, "Queen", [
            [1,0],
            [-1,0],
            [0,1],
            [0,-1],
            [1,1],
            [1,-1],
            [-1,1],
            [-1,-1],
        ]);
    }
}


class Knight extends StepPiece {
    constructor(color) {
        super(color, "Knight", [
            [2, 1],
            [2, -1],
            [1, -2],
            [1, 2],
            [-1, -2],
            [-1, 2],
            [-2, -1],
            [-2, 1],
        ]);
    }
}

class King extends StepPiece {
    constructor(color) {
        super(color, "King", [
            [0,1],
            [0,-1],
            [1,1],
            [1,0],
            [1,-1],
            [-1,1],
            [-1,0],
            [-1,-1]
        ]);
    }
    getPossibleTurns(cell, board, checkSafety = true) {
        this.possibleTurns =  super.getPossibleTurns(cell, board, checkSafety);
        if (! this.movesCount && checkSafety && ! board.isCheck()){
             let x = cell.col + 1
             while (x < 8) {
                 let newCell = board.getCellByCoords(x, cell.row)
                 if (! board.isSafeMove(cell, newCell)) {
                    break
                 }
                 if (newCell.piece) {
                     if (newCell.piece.pieceType === "Rook" && newCell.piece.color === this.color && newCell.piece.movesCount === 0) {
                         this.possibleTurns.push(coordsToChess(x, cell.row))
                     }
                     break
                 }
                 x += 1
            }
            x = cell.col - 1
            while (x >= 0) {
                 let newCell = board.getCellByCoords(x, cell.row)
                 if (! board.isSafeMove(cell, newCell)) {
                    break
                 }
                 if (newCell.piece) {
                     if (newCell.piece.pieceType === "Rook" && newCell.piece.color === this.color && newCell.piece.movesCount === 0) {
                         this.possibleTurns.push(coordsToChess(x, cell.row))
                     }
                     break
                 }
                 x -= 1
            }
        }
        return this.possibleTurns
    }
}


class Pawn extends Piece {
    constructor(color, pieceType = "Pawn") {
        super(color, pieceType)
        this.direction = this.color == topColor ? 1 : -1
    }
    getPossibleTurns(cell, board, checkSafety = true) {
        this.possibleTurns = [];
        if (! board.cells[cell.row + this.direction][cell.col].piece) {
            if (! checkSafety || board.isSafeMove(cell, board.getCellByCoords(cell.col, cell.row + this.direction))) {
                this.possibleTurns.push(coordsToChess(cell.col, cell.row + this.direction))
            }
        }
        if (! this.movesCount){
            if (! board.cells[cell.row + this.direction * 2][cell.col].piece) {
                if (! checkSafety || board.isSafeMove(cell, board.getCellByCoords(cell.col, cell.row + this.direction * 2))) {
                    this.possibleTurns.push(coordsToChess(cell.col, cell.row + this.direction * 2))
            }
        }
        }
        if (board.cells[cell.row + this.direction][cell.col - 1] && board.cells[cell.row + this.direction][cell.col - 1].piece && board.cells[cell.row + this.direction][cell.col - 1].piece.color !== this.color) {
            if (! checkSafety || board.isSafeMove(cell, board.getCellByCoords( cell.col - 1, cell.row + this.direction))) {
                this.possibleTurns.push(coordsToChess( cell.col - 1, cell.row + this.direction))
            }
        }
        if (board.cells[cell.row + this.direction][cell.col + 1] && board.cells[cell.row + this.direction][cell.col + 1].piece && board.cells[cell.row + this.direction][cell.col + 1].piece.color !== this.color) {
            if (! checkSafety ||  board.isSafeMove(cell, board.getCellByCoords(cell.col + 1, cell.row + this.direction))){
                this.possibleTurns.push(coordsToChess( cell.col + 1, cell.row + this.direction))
            }
        }
        if (board.enPassant) {
            if (board.cells[cell.row + this.direction][cell.col - 1] && board.cells[cell.row + this.direction][cell.col - 1].position === board.enPassant) {
                if (! checkSafety || board.isSafeMove(cell, board.getCellByCoords(cell.col - 1, cell.row + this.direction))) {
                    this.possibleTurns.push(coordsToChess( cell.col - 1, cell.row + this.direction))
                }
            }
            if (board.cells[cell.row + this.direction][cell.col + 1] && board.cells[cell.row + this.direction][cell.col + 1].position === board.enPassant) {
                if (! checkSafety || board.isSafeMove(cell, board.getCellByCoords(cell.col + 1, cell.row + this.direction))) {
                    this.possibleTurns.push(coordsToChess( cell.col + 1, cell.row + this.direction))
                }
            }
        }
        return this.possibleTurns
    }
}


class Cell {
    constructor(row, column, piece) {
        this.row = row
        this.col = column
        this.position = coordsToChess(column, row);
        this.color = (row + column) % 2 == 0 ? "white-cell" : "black-cell"
        this.piece = piece
    }
}

class Board {
    constructor(statement = testPosition) {
        this.cells = []
        this.blackPieceCells = []
        this.whitePieceCells = []
        for (let rowIndex = 0; rowIndex < 8; rowIndex++) {
            let row = []
            for (let col = 0; col < 8; col++) {
                let piece = this.createPiece(statement[rowIndex][col])
                let cell = new Cell(rowIndex, col, piece)
                row.push(cell)
                if (piece) {
                    this.addCellToArray(cell)
                }
            }
            this.cells.push(row)
        }
        this.turnColor = "white"
        this.enPassant = null
        this.enPassantCell = null
        this.oldCell
        this.isTaking = true
        console.dir(this)
    }

    movePiece(oldCell, newCell, isVirtual = false) {
        this.removeCellFromArray(oldCell);
        let piece = oldCell.piece;
        oldCell.piece = null;

        if (piece.pieceType === "Pawn" && (newCell.row == 0 || newCell.row === 7)) {
            piece = this.createPiece([piece.color, "Queen"])
        }
        if (! isVirtual) {
            if (this.enPassant) {
                if (piece.pieceType === "Pawn" && newCell.position === this.enPassant) {
                    this.enPassantCell.element.innerHTML = ""
                    this.removeCellFromArray(this.enPassantCell)
                    this.enPassantCell.piece = null
                }
                this.enPassant = null
                this.enPassantCell = null
            }
            if (piece.pieceType === "Pawn" && Math.abs(newCell.row - oldCell.row) === 2) {
                this.enPassant = coordsToChess(this.oldCell.col, this.oldCell.row + piece.direction)
                this.enPassantCell = newCell
            }
        }
        if (newCell.piece) {
            this.removeCellFromArray(newCell);
        }
        newCell.piece = piece
        this.addCellToArray(newCell)
    }

    takePiece(cell) {
        this.oldCell = cell.jsCell;
        this.possibleTurns = cell.jsCell.piece.getPossibleTurns(cell.jsCell, this);
        this.possibleTurns.push(cell.jsCell.position);
        cell.innerHTML = "";
        this.renderPossibleTurns();
        this.isTaking = false
    }

    putPiece(cell) {
        if (this.possibleTurns.includes(coordsToChess(cell.jsCell.col, cell.jsCell.row))) {
            this.movePiece(this.oldCell, cell.jsCell);
            this.clearPossibleTurns();
            this.renderPiece(cell);
            if (! (this.oldCell.position === cell.jsCell.position)) {
                cell.jsCell.piece.movesCount += 1
                this.changeTurnColor()
            }
            this.isTaking = true;
        }
    }

    getCellByCoords(x, y) {
        return this.cells[y][x]
    }

    changeTurnColor() {
        if (this.turnColor === "white") {
            this.turnColor = "black"
        } else {
            this.turnColor = "white"
        }
    }

    addCellToArray(cell) {
        let arr = cell.piece.color === "white" ? this.whitePieceCells : this.blackPieceCells;
        arr.push(cell);
    }

    removeCellFromArray(cell) {
        let arr = cell.piece.color === "white" ? this.whitePieceCells : this.blackPieceCells;
        const index = arr.indexOf(cell);
        if (index !== -1) {
            arr.splice(index, 1);
        }
    }

    renderBoard() {
        let boardDiv = document.createElement('div');
        boardDiv.className = "board";
        for (let row of this.cells) {
            for (let cell of row){
            let cellDiv = document.createElement('div');
            cell.element = cellDiv;
            cellDiv.jsCell = cell;
            cellDiv.classList.add('cell');
            cellDiv.classList.add(cell.color);
            if (cell.piece) {
                this.renderPiece(cellDiv);
            }
            boardDiv.appendChild(cellDiv);
            }
        }
        console.log(boardDiv)
        document.body.appendChild(boardDiv)
        return boardDiv
    }

    createPiece(pieceConfig) {
        if (pieceConfig) {
            const PieceClass = pieceClasses[pieceConfig[1]];
            const piece = new PieceClass(pieceConfig[0], pieceConfig[1]);
            return piece
        } else {
            return null
        }
    }

    renderPiece(cell) {
        const img = document.createElement("img");
        if (cell.jsCell.piece.color == "white") {
            const piecesPNG = {
                Pawn: "https://upload.wikimedia.org/wikipedia/commons/0/04/Chess_plt60.png",
                Rook: "https://upload.wikimedia.org/wikipedia/commons/5/5c/Chess_rlt60.png",
                Knight: "https://upload.wikimedia.org/wikipedia/commons/2/28/Chess_nlt60.png",
                Bishop: "https://upload.wikimedia.org/wikipedia/commons/9/9b/Chess_blt60.png",
                King: "https://upload.wikimedia.org/wikipedia/commons/3/3b/Chess_klt60.png",
                Queen: "https://upload.wikimedia.org/wikipedia/commons/4/49/Chess_qlt60.png",
            };
            img.src = piecesPNG[cell.jsCell.piece.pieceType]
        } else {
            const piecesPNG = {
                Pawn: "https://upload.wikimedia.org/wikipedia/commons/c/cd/Chess_pdt60.png",
                Rook: "https://upload.wikimedia.org/wikipedia/commons/a/a0/Chess_rdt60.png",
                Knight: "https://upload.wikimedia.org/wikipedia/commons/f/f1/Chess_ndt60.png",
                Bishop: "https://upload.wikimedia.org/wikipedia/commons/8/81/Chess_bdt60.png",
                King: "https://upload.wikimedia.org/wikipedia/commons/e/e3/Chess_kdt60.png",
                Queen: "https://upload.wikimedia.org/wikipedia/commons/a/af/Chess_qdt60.png",
            };
            img.src = piecesPNG[cell.jsCell.piece.pieceType]
        }
        cell.replaceChildren(img);
    }
    renderPossibleTurns() {
        /* Костыльная проверка вставляем мы или удаляем
        if (picked) {

        }

        */
        for (let position of this.possibleTurns) {
            let coords = chessToCoords(position)
            let cell = this.getCellByCoords(coords[1], coords[0])
            cell.element.insertAdjacentHTML('beforeend', '<p>•</p>');
        }
    }
    clearPossibleTurns() {
        for (let position of this.possibleTurns) {
            let coords = chessToCoords(position)
            let cell = this.getCellByCoords(coords[1], coords[0])
            if (cell.element.lastElementChild) {
                cell.element.lastElementChild.remove()
            }
        }
    }
    isSafeMove(oldCell, newCell) {
        let movingPiece = oldCell.piece
        let capturedPiece = newCell.piece
        this.movePiece(oldCell, newCell, true)
        let isSafe = ! this.isCheck()
        this.removeCellFromArray(newCell)
        newCell.piece = capturedPiece
        if (newCell.piece) {
            this.addCellToArray(newCell)
        }
        oldCell.piece = movingPiece
        this.addCellToArray(oldCell)
        return isSafe
    }

    isCheck() {
        let kingCell = (this.turnColor === "white" ? this.whitePieceCells : this.blackPieceCells).filter((cell) => cell.piece.pieceType === "King")[0]
        let arr = this.turnColor === "white" ? this.blackPieceCells : this.whitePieceCells;
        for (let cell of arr) {
            if (cell.piece.getPossibleTurns(cell, this, false).includes(kingCell.position)){
                return true
            }
        }
        return false
    }
}

function coordsToChess(column, row) {
    const numToLetter = "abcdefgh"
    return numToLetter[column] + (row+1).toString()
}

function chessToCoords(chessNotation) {
    const letterToNum = "abcdefgh";
    return [parseInt(chessNotation[1]) - 1, letterToNum.indexOf(chessNotation[0])]
}

const isBlackTop = Math.random() < 0.5;
const topColor = isBlackTop ? "black" : "white";
const bottomColor = isBlackTop ? "white" : "black";

const pieceClasses = {
    Rook: Rook,
    Knight: Knight,
    Bishop: Bishop,
    Queen: Queen,
    King: King,
    Pawn: Pawn
}

startposition = [
  [
    [topColor, "Rook"],
    [topColor, "Knight"],
    [topColor, "Bishop"],
    [topColor, "Queen"],
    [topColor, "King"],
    [topColor, "Bishop"],
    [topColor, "Knight"],
    [topColor, "Rook"]
  ],
  [
    [topColor, "Pawn"],
    [topColor, "Pawn"],
    [topColor, "Pawn"],
    [topColor, "Pawn"],
    [topColor, "Pawn"],
    [topColor, "Pawn"],
    [topColor, "Pawn"],
    [topColor, "Pawn"]
  ],
  [ null, null, null, null, null, null, null, null ],
  [ null, null, null, null, null, null, null, null ],
  [ null, null, null, null, null, null, null, null ],
  [ null, null, null, null, null, null, null, null ],
  [
    [bottomColor, "Pawn"],
    [bottomColor, "Pawn"],
    [bottomColor, "Pawn"],
    [bottomColor, "Pawn"],
    [bottomColor, "Pawn"],
    [bottomColor, "Pawn"],
    [bottomColor, "Pawn"],
    [bottomColor, "Pawn"]
  ],
  [
    [bottomColor, "Rook"],
    [bottomColor, "Knight"],
    [bottomColor, "Bishop"],
    [bottomColor, "Queen"],
    [bottomColor, "King"],
    [bottomColor, "Bishop"],
    [bottomColor, "Knight"],
    [bottomColor, "Rook"]
  ]
]

const testPosition = [
  // rank 8 (чёрные вверху)
  [ null, null, null,
    [topColor,    "Rook"],   // d8 — атакующая ладья
    [topColor,    "King"],   // e8
    [topColor,    "Rook"],   // f8 — атакующая ладья
    null,     null
  ],
  // ranks 7–2 — всё пусто, чтобы не мешало
  [ null, null, null, null, null, null, null, null ],  // 7
  [ null, null, null, null, null, null, null, null ],  // 6
  [ null, null, null, null, null, null, null, null ],  // 5
  [ null, null, null, null, null, null, null, null ],  // 4
  [ null, null, null, null, null, null, null, null ],  // 3
  [ null, null, null, null, null, null, null, null ],  // 2
  // rank 1 (белые внизу)
  [ [bottomColor, "Rook"],   // a1
    null,     null,  null,
    [bottomColor, "King"],   // e1
    null,     null,
    [bottomColor, "Rook"]    // h1
  ]
];
