window.onload = function() {
    board = new Board();
    boardDiv = board.renderBoard();
    boardDiv.addEventListener('click', (ev) => {
        const cell = ev.target.closest('.cell')
        if (cell) {
            if (board.picked) {
                board.putPiece(cell)
            } else {
                if (cell.jsCell.piece && cell.jsCell.piece.color === board.turnColor) {
                    board.takePiece(cell)
                }
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
        this.moves = 0
    };
    getPossibleTurns() {
        this.possibleTurns = [];
        return this.possibleTurns
    }
}

class Pawn extends Piece {
    constructor(color, pieceType = "Pawn", moves) {
        super(color, pieceType, moves)
        this.direction = this.color == topColor ? 1 : -1
    }
    getPossibleTurns(cell, board, checkSafety = true) {
        this.possibleTurns = [];
        if (! board.cells[cell.row + this.direction][cell.col].piece) {
            if (! checkSafety || board.isSafeMove(cell, board.getCellByCoords(cell.col, cell.row + this.direction))) {
                this.possibleTurns.push(coordsToChess(cell.col, cell.row + this.direction))
            }
        }
        if (! this.moves){
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

class Rook extends Piece {
    constructor(color, pieceType = "Rook") {
        super(color, pieceType);
    }
    getPossibleTurns(cell, board, checkSafety = true) {
        this.possibleTurns = [];
        const directions = [
            [1,0],
            [-1,0],
            [0,1],
            [0,-1],
        ]
        for (let [dx,dy] of directions) {
            let x = cell.col + dx
            let y = cell.row + dy
            while (x >= 0 && x < 8 && y >= 0 && y < 8) {
                let newCell = board.getCellByCoords(x, y);
                if (newCell.piece) {
                    if (newCell.piece.color == this.color) {
                        break
                    }
                    if (! checkSafety || board.isSafeMove(cell, newCell)){
                        this.possibleTurns.push(coordsToChess(x, y))
                    }
                    break
                }
                if (! checkSafety || board.isSafeMove(cell, newCell)) {
                    this.possibleTurns.push(coordsToChess(x, y))
                }
                x += dx
                y += dy
            }
        }
        return this.possibleTurns
    }
}

class Knight extends Piece {
    constructor(color, pieceType = "Knight") {
        super(color, pieceType);
    }
    getPossibleTurns(cell, board, checkSafety = true) {
        this.possibleTurns = [];
        const moves = [
            [2,1],
            [2,-1],
            [1,-2],
            [1,2],
            [-1,-2],
            [-1,2],
            [-2,-1],
            [-2,1],
        ]
        for (let [dx,dy] of moves) {
            let x = cell.col + dx
            let y = cell.row + dy
            if (x >= 0 && x < 8 && y >= 0 && y < 8) {
                let newCell = board.getCellByCoords(x, y);
                if (! newCell.piece) {
                    if (! checkSafety || board.isSafeMove(cell, newCell)){
                        this.possibleTurns.push(coordsToChess(x, y))
                    }
                    continue;
                }
                if (newCell.piece.color !== this.color) {
                    if (! checkSafety || board.isSafeMove(cell, newCell)){
                        this.possibleTurns.push(coordsToChess(x, y))
                    }
                }
            }
        }
        return this.possibleTurns
    }
}

class Bishop extends Piece {
    constructor(color, pieceType = "Bishop") {
        super(color, pieceType);
    }
    getPossibleTurns(cell, board, checkSafety = true) {
        this.possibleTurns = [];
        const directions = [
            [1,1],
            [1,-1],
            [-1,1],
            [-1,-1],
        ]
        for (let [dx,dy] of directions) {
            let x = cell.col + dx
            let y = cell.row + dy
            while (x >= 0 && x < 8 && y >= 0 && y < 8) {
                let newCell = board.getCellByCoords(x, y);
                if (newCell.piece) {
                    if (newCell.piece.color == this.color) {
                        break
                    }
                    if (! checkSafety || board.isSafeMove(cell, newCell)){
                        this.possibleTurns.push(coordsToChess(x, y))
                    }
                    break
                }
                if (! checkSafety || board.isSafeMove(cell, newCell)){
                        this.possibleTurns.push(coordsToChess(x, y))
                    }
                x += dx
                y += dy
            }
        }
        return this.possibleTurns;
    }
}

class King extends Piece {
    constructor(color, pieceType = "King") {
        super(color, pieceType);
    }
    getPossibleTurns(cell, board, checkSafety = true) {
        this.possibleTurns = [];
        const moves = [
            [0,1],
            [0,-1],
            [1,1],
            [1,0],
            [1,-1],
            [-1,1],
            [-1,0],
            [-1,-1]
        ]
        for (let [dx,dy] of moves) {
            let x = cell.col + dx
            let y = cell.row + dy
            if (x >= 0 && x < 8 && y >= 0 && y < 8) {
                let newCell = board.getCellByCoords(x, y);
                if (! newCell.piece) {
                    if (! checkSafety || board.isSafeMove(cell, newCell)){
                        this.possibleTurns.push(coordsToChess(x, y))
                    }
                    continue;
                }
                if (newCell.piece.color !== this.color) {
                    if (! checkSafety || board.isSafeMove(cell, newCell)){
                        this.possibleTurns.push(coordsToChess(x, y))
                    }
                }
            }
        }
       return this.possibleTurns
    }
}

class Queen extends Piece {
    constructor(color, pieceType = "Queen") {
        super(color, pieceType);
    }
    getPossibleTurns(cell, board, checkSafety = true) {
        this.possibleTurns = [];
        const directions = [
            [1,0],
            [-1,0],
            [0,1],
            [0,-1],
            [1,1],
            [1,-1],
            [-1,1],
            [-1,-1],
        ]
        for (let [dx,dy] of directions) {
            let x = cell.col + dx
            let y = cell.row + dy
            while (x >= 0 && x < 8 && y >= 0 && y < 8) {
                let newCell = board.getCellByCoords(x, y);
                if (newCell.piece) {
                    if (newCell.piece.color == this.color) {
                        break
                    }
                    if (! checkSafety || board.isSafeMove(cell, newCell)){
                        this.possibleTurns.push(coordsToChess(x, y))
                    }
                    break
                }
                if (! checkSafety || board.isSafeMove(cell, newCell)){
                    this.possibleTurns.push(coordsToChess(x, y))
                }
                x += dx
                y += dy
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
    constructor(statement = startposition) {
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
        this.picked = null
        this.oldRow = null
        this.oldCol = null
        console.dir(this)
    }

    movePiece(oldPos, newPos) {
        oldPos = chessToCoords(oldPos);
        newPos = chessToCoords(newPos);
        let oldCell = this.getCellByCoords(oldPos);
        let newCell = this.getCellByCoords(newPos);
        let piece = oldCell.piece;
        oldCell.piece = null;
        newCell.piece = piece;
    }

    takePiece(cell) {
        this.picked = cell.jsCell.piece;
        this.oldRow = cell.jsCell.row;
        this.oldCol = cell.jsCell.col;
        debugger;
        this.possibleTurns = this.picked.getPossibleTurns(cell.jsCell, this);
        this.possibleTurns.push(cell.jsCell.position);
        this.removeCellFromArray(cell.jsCell)
        cell.jsCell.piece = null;
        cell.innerHTML = "";
        this.renderPossibleTurns();
    }

    putPiece(cell) {
        let jsCell = cell.jsCell
        if (this.possibleTurns.includes(coordsToChess(jsCell.col, jsCell.row))) {
            if (this.picked.pieceType == "Pawn" && (jsCell.row == 0 || jsCell.row == 7)) {
                this.removeFromArray(this.picked)
                this.picked = this.createPiece([this.picked.color, "Queen"])
            }
            if (this.enPassant) {
                if (this.picked.pieceType == "Pawn" && jsCell.position === this.enPassant) {
                    this.enPassantCell.innerHTML = ""
                    this.enPassantCell.jsCell.piece = null
                }
                this.enPassant = null
                this.enPassantCell = null
            }
            if (this.picked.pieceType == "Pawn" && Math.abs(jsCell.row - this.oldRow) === 2) {
                this.enPassant = coordsToChess(this.oldCol, this.oldRow + this.picked.direction)
                this.enPassantCell = cell
            }
            this.picked.moves += 1
            // Важно что сначала удаляются точки с ходами, а уже потом добавляется фигура, потому что иначе она была бы lastChild
            this.clearPossibleTurns()
            // Важно, что сперва удаляем со старого списка клеток, а потом вставляем фигуру
            if (jsCell.piece) {
                this.removeCellFromArray(jsCell)
            }
            jsCell.piece = this.picked;
            this.addCellToArray(jsCell)
            this.renderPiece(cell);
            this.picked = null;
            this.changeTurnColor()
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
        this.removeCellFromArray(oldCell)
        if (newCell.piece) {
            this.removeCellFromArray(newCell)
        }
        let endPiece = newCell.piece
        newCell.piece = oldCell.piece
        oldCell.piece = null
        this.addCellToArray(newCell)
        let isSafe = false
        if (! this.isCheck()) {
            isSafe = true
        }
        this.removeCellFromArray(newCell)
        oldCell.piece = newCell.piece
        newCell.piece = endPiece
        this.addCellToArray(oldCell)
        if (newCell.piece) {
            this.removeCellFromArray(newCell)
        }
        return isSafe
    }

    isCheck() {
        let kingCell = (this.picked.color === "white" ? this.whitePieceCells : this.blackPieceCells).filter((cell) => cell.piece.pieceType === "King")[0]
        let arr = this.picked.color === "white" ? this.blackPieceCells : this.whitePieceCells;
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


