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
        this.direction = this.color === "white" ? -1 : 1
    }
    getPossibleTurns(cell, board, checkSafety = true) {
        this.possibleTurns = [];
        if (! board.cells[cell.row + this.direction][cell.col].piece) {
            if (! checkSafety || board.isSafeMove(cell, board.getCellByCoords(cell.col, cell.row + this.direction))) {
                this.possibleTurns.push(coordsToChess(cell.col, cell.row + this.direction))
            }
        }
        if (! this.movesCount){
            if (! board.cells[cell.row + this.direction][cell.col].piece && ! board.cells[cell.row + this.direction * 2][cell.col].piece) {
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
    constructor(statement) {
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
        const isBlackTop = Math.random() < 0.5;
        this.topColor = isBlackTop ? "black" : "white";
        this.bottomColor = isBlackTop ? "white" : "black";
        this.turnColor = "white"
        this.enPassant = null
        this.enPassantCell = null
        this.oldCell
        this.isTaking = true
        console.dir(this)
    }

    makeMove(oldCell, newCell){
        if (oldCell.position === newCell.position) {
            return true
        }
        if (oldCell.piece.getPossibleTurns(oldCell, this).includes(newCell.position)){
            const piece = oldCell.piece
            oldCell.piece.movesCount += 1
            this.changeTurnColor()
            if (piece.pieceType === "King" && newCell.piece && newCell.piece.color === piece.color) {
                const direction = oldCell.col > newCell.col ? -1 : 1
                let newKingCell = this.getCellByCoords(oldCell.col + direction * 2, oldCell.row)
                let newRookCell = this.getCellByCoords(oldCell.col + direction, oldCell.row)
                this.movePiece(oldCell, newKingCell)
                this.movePiece(newCell, newRookCell)
                return true
            }
            this.movePiece(oldCell, newCell)
            if (piece.pieceType === "Pawn" && (newCell.row === 0 || newCell.row === 7)) {
                newCell.piece = this.createPiece([piece.color, "Queen"])
            }
            if (this.enPassant) {
                if (piece.pieceType === "Pawn" && newCell.position === this.enPassant) {
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
            return true
        }
        return false
    }
    movePiece(oldCell, newCell, isVirtual = false) {
        this.removeCellFromArray(oldCell);
        let piece = oldCell.piece;
        oldCell.piece = null;
        if (newCell.piece) {
            this.removeCellFromArray(newCell);
        }
        newCell.piece = piece
        this.addCellToArray(newCell)
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

    createPiece(pieceConfig) {
        if (pieceConfig) {
            const PieceClass = pieceClasses[pieceConfig[1]];
            const piece = new PieceClass(pieceConfig[0], pieceConfig[1]);
            return piece
        } else {
            return null
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

const pieceClasses = {
    Rook: Rook,
    Knight: Knight,
    Bishop: Bishop,
    Queen: Queen,
    King: King,
    Pawn: Pawn
}

export {Piece, Bishop, Queen, King, Pawn, Rook, Knight, Cell, Board, coordsToChess, chessToCoords}