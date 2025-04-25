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
        let possibleTurns = [];
        return possibleTurns
    }
}

class Pawn extends Piece {
    constructor(color, pieceType = "Pawn", moves) {
        super(color, pieceType, moves)
        this.direction = this.color == topColor ? 1 : -1
    }
    getPossibleTurns(cell, board) {
        let possibleTurns = [];
        if (this.color == topColor) {}
        if (! board.rows[cell.row + this.direction].cells[cell.col].piece) {
            possibleTurns.push(coordsToChess(cell.col, cell.row + this.direction))
        }
        if (! this.moves){
            if (! board.rows[cell.row + this.direction * 2].cells[cell.col].piece) {
            possibleTurns.push(coordsToChess(cell.col, cell.row + this.direction * 2))
        }
        }
        if (board.rows[cell.row + this.direction].cells[cell.col - 1] && board.rows[cell.row + this.direction].cells[cell.col - 1].piece && board.rows[cell.row + this.direction].cells[cell.col - 1].piece.color !== this.color) {
            possibleTurns.push(coordsToChess(cell.col - 1, cell.row + this.direction))
        }
        if (board.rows[cell.row + this.direction].cells[cell.col + 1] && board.rows[cell.row + this.direction].cells[cell.col + 1].piece && board.rows[cell.row + this.direction].cells[cell.col + 1].piece.color !== this.color) {
            possibleTurns.push(coordsToChess(cell.col + 1, cell.row + this.direction))
        }
        if (board.enPassant) {
            if (board.rows[cell.row + this.direction].cells[cell.col - 1] && board.rows[cell.row + this.direction].cells[cell.col - 1].position === board.enPassant) {
                console.log("pacan")
                possibleTurns.push(coordsToChess(cell.col - 1, cell.row + this.direction))
            }
            if (board.rows[cell.row + this.direction].cells[cell.col + 1] && board.rows[cell.row + this.direction].cells[cell.col + 1].position === board.enPassant) {
                possibleTurns.push(coordsToChess(cell.col + 1, cell.row + this.direction))
            }
            console.log(possibleTurns)
        }
        return possibleTurns;
    }
}

class Rook extends Piece {
    constructor(color, pieceType = "Rook") {
        super(color, pieceType);
    }
    getPossibleTurns(cell, board) {
        let possibleTurns = [];
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
                if (board.getCellByCoords(x,y).piece) {
                    if (board.getCellByCoords(x,y).piece.color == this.color) {
                        break
                    }
                    possibleTurns.push(coordsToChess(x,y))
                    break
                }
                possibleTurns.push(coordsToChess(x,y))
                x += dx
                y += dy
            }
        }
        return possibleTurns;
    }
}

class Knight extends Piece {
    constructor(color, pieceType = "Knight") {
        super(color, pieceType);
    }
    getPossibleTurns(cell, board) {
        let possibleTurns = [];
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
                if (! board.getCellByCoords(x,y).piece) {
                    possibleTurns.push(coordsToChess(x,y));
                    continue;
                }
                if (board.getCellByCoords(x,y).piece.color !== this.color) {
                    possibleTurns.push(coordsToChess(x,y));
                }
            }
        }
        return possibleTurns;
    }
}

class Bishop extends Piece {
    constructor(color, pieceType = "Bishop") {
        super(color, pieceType);
    }
    getPossibleTurns(cell, board) {
        let possibleTurns = [];
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
                if (board.getCellByCoords(x,y).piece) {
                    if (board.getCellByCoords(x,y).piece.color == this.color) {
                        break
                    }
                    possibleTurns.push(coordsToChess(x,y))
                    break
                }
                possibleTurns.push(coordsToChess(x,y))
                x += dx
                y += dy
            }
        }
        return possibleTurns;
    }
}

class King extends Piece {
    constructor(color, pieceType = "King") {
        super(color, pieceType);
    }
    getPossibleTurns(cell, board) {
        let possibleTurns = [];
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
                if (! board.getCellByCoords(x,y).piece) {
                    possibleTurns.push(coordsToChess(x,y));
                    continue;
                }
                if (board.getCellByCoords(x,y).piece.color !== this.color) {
                    possibleTurns.push(coordsToChess(x,y));
                }
            }
        }
       return possibleTurns
    }
}

class Queen extends Piece {
    constructor(color, pieceType = "Queen") {
        super(color, pieceType);
    }
    getPossibleTurns(cell, board) {
        let possibleTurns = [];
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
                if (board.getCellByCoords(x,y).piece) {
                    if (board.getCellByCoords(x,y).piece.color == this.color) {
                        break
                    }
                    possibleTurns.push(coordsToChess(x,y))
                    break
                }
                possibleTurns.push(coordsToChess(x,y))
                x += dx
                y += dy
            }
        }
        return possibleTurns;
    }
}

class Cell {
    constructor(row, column, piece) {
        this.row = row
        this.col = column
        this.position = coordsToChess(column, row);
        this.color = (row + column) % 2 == 0 ? "white-cell" : "black-cell"
        if (piece) {
            this.piece = piece
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
        this.possibleTurns = this.picked.getPossibleTurns(cell.jsCell, this);
        this.possibleTurns.push(cell.jsCell.position);
        cell.jsCell.piece = null;
        cell.innerHTML = "";
        this.renderPossibleTurns();
    }

    putPiece(cell) {
        let jsCell = cell.jsCell
        if (this.possibleTurns.includes(coordsToChess(jsCell.col, jsCell.row))) {
            if (this.picked.pieceType == "Pawn" && (jsCell.row == 0 || jsCell.row == 7)) {
                this.picked = new Queen(this.picked.color)
            }
            if (this.picked.pieceType == "Pawn" && Math.abs(jsCell.row - this.oldRow) === 2) {
                this.enPassant = coordsToChess(this.oldCol, this.oldRow + this.picked.direction)
                this.enPassantCell = cell
            }
            if (this.enPassant) {
                if (this.picked.pieceType == "Pawn" && jsCell.position === this.enPassant) {
                    console.log("en")
                    this.enPassantCell.innerHTML = ""
                    this.enPassantCell.jsCell.piece = null
                }
            }
            this.picked.moves += 1
            // Важно что сначала удаляются точки с ходами, а уже потом добавляется фигура, потому что иначе она была бы lastChild
            this.clearPossibleTurns()
            jsCell.piece = this.picked;
            this.renderPiece(cell);
            this.picked = null;
            this.changeTurnColor()
        }
    }

    getCellByCoords(x, y) {
        return this.rows[y].cells[x]
    }

    changeTurnColor() {
        if (this.turnColor === "white") {
            this.turnColor = "black"
        } else {
            this.turnColor = "white"
        }
    }
    renderBoard() {
        let boardDiv = document.createElement('div');
        boardDiv.className = "board";
        for (let row of this.rows) {
            for (let cell of row.cells) {
                let cellDiv = document.createElement('div');
                cell.element = cellDiv;
                cellDiv.jsCell = cell;
                cellDiv.classList.add('cell');
                cellDiv.classList.add(cell.color);

                // Add piece visually
                if (cell.piece) {
                    this.renderPiece(cellDiv);
                }
                boardDiv.appendChild(cellDiv);
            }
        }
        document.body.appendChild(boardDiv)
        return boardDiv
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
            cell.element.lastElementChild.remove()
        }
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


const startposition = [
  [
    new Rook(topColor),   new Knight(topColor), new Bishop(topColor), new Queen(topColor),
    new King(topColor),   new Bishop(topColor), new Knight(topColor), new Rook(topColor)
  ],
  [

    new Pawn(topColor),   new Pawn(topColor),   new Pawn(topColor),   new Pawn(topColor),
    new Pawn(topColor),   new Pawn(topColor),   new Pawn(topColor),   new Pawn(topColor)
  ],
  [ null, null, null, null, null, null, null, null ],
  [ null, null, null, null, null, null, null, null ],

  [ null, null, null, null, null, null, null, null ],
  [ null, null, null, null, null, null, null, null ],
  [
    new Pawn(bottomColor),   new Pawn(bottomColor),   new Pawn(bottomColor),   new Pawn(bottomColor),
    new Pawn(bottomColor),   new Pawn(bottomColor),   new Pawn(bottomColor),   new Pawn(bottomColor)
  ],
  [
    new Rook(bottomColor),   new Knight(bottomColor), new Bishop(bottomColor), new Queen(bottomColor),
    new King(bottomColor),   new Bishop(bottomColor), new Knight(bottomColor), new Rook(bottomColor)
  ]
];

