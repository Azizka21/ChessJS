window.onload = function() {
    Board = new Board();
    boardDiv = Board.renderBoard();
    boardDiv.addEventListener('click', (ev) => {
        const cell = ev.target.closest('.cell')
        if (cell) {
            if (Board.picked) {
                Board.putPiece(cell)
            } else {
                if (cell.jsCell.piece) {
                    Board.takePiece(cell)
                }
            }
        }
    })
}


document.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        console.log("Нажат Enter!");
        Board.movePiece("a1","c2")
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
    };
    getPossibleTurns() {
        let possibleTurns = [];
        return possibleTurns
    }
}

class Pawn extends Piece {
    constructor(color, pieceType = "Pawn") {
        super(color, pieceType)
    }
    getPossibleTurns(cell, board) {
        let possibleTurns = [];
        if (this.color == topColor) {
            if (! board.rows[cell.row + 1].cells[cell.col].piece)
            {
                possibleTurns.push(coordsToChess(cell.row + 1, cell.col))
            }
            if (board.rows[cell.row + 1].cells[cell.col - 1] && board.rows[cell.row + 1].cells[cell.col - 1].piece && board.rows[cell.row + 1].cells[cell.col - 1].piece.color == bottomColor)
            {
                possibleTurns.push(coordsToChess(cell.row + 1, cell.col - 1))
            }
            if (board.rows[cell.row + 1].cells[cell.col + 1] && board.rows[cell.row + 1].cells[cell.col + 1].piece && board.rows[cell.row + 1].cells[cell.col + 1].piece.color == bottomColor)
            {
                possibleTurns.push(coordsToChess(cell.row + 1, cell.col + 1))
            }
        } else {
            if (!board.rows[cell.row - 1].cells[cell.col].piece) {
                console.log(cell)
                possibleTurns.push(coordsToChess(cell.row - 1, cell.col))
            }
            if (board.rows[cell.row - 1].cells[cell.col - 1] && board.rows[cell.row - 1].cells[cell.col - 1].piece && board.rows[cell.row - 1].cells[cell.col - 1].piece.color == topColor) {
                possibleTurns.push(coordsToChess(cell.row - 1, cell.col - 1))
            }
            if (board.rows[cell.row - 1].cells[cell.col + 1] && board.rows[cell.row - 1].cells[cell.col + 1].piece && board.rows[cell.row - 1].cells[cell.col + 1].piece.color == topColor) {
                possibleTurns.push(coordsToChess(cell.row - 1, cell.col + 1))
            }
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
                    possibleTurns.push(coordsToChess(y,x))
                    break
                }
                possibleTurns.push(coordsToChess(y,x))
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
    getPossibleTurns(cell) {
        let possibleTurns = [];
        possibleTurns.push(coordsToChess(cell.row + 2, cell.col + 1));
        possibleTurns.push(coordsToChess(cell.row + 2, cell.col - 1));
        possibleTurns.push(coordsToChess(cell.row + 1, cell.col - 2));
        possibleTurns.push(coordsToChess(cell.row + 1, cell.col + 2));
        possibleTurns.push(coordsToChess(cell.row - 1, cell.col - 2));
        possibleTurns.push(coordsToChess(cell.row - 1, cell.col + 2));
        possibleTurns.push(coordsToChess(cell.row - 2, cell.col - 1));
        possibleTurns.push(coordsToChess(cell.row - 2, cell.col + 1))
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
                    possibleTurns.push(coordsToChess(y,x))
                    break
                }
                possibleTurns.push(coordsToChess(y,x))
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
    getPossibleTurns(cell) {
        let possibleTurns = [];
        possibleTurns.push(coordsToChess(cell.row + 1, cell.col));
        possibleTurns.push(coordsToChess(cell.row + 1, cell.col + 1));
        possibleTurns.push(coordsToChess(cell.row, cell.col + 1));
        possibleTurns.push(coordsToChess(cell.row - 1, cell.col + 1));
        possibleTurns.push(coordsToChess(cell.row - 1, cell.col));
        possibleTurns.push(coordsToChess(cell.row - 1, cell.col - 1));
        possibleTurns.push(coordsToChess(cell.row, cell.col - 1));
        possibleTurns.push(coordsToChess(cell.row + 1, cell.col - 1));
        return possibleTurns;
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
                    possibleTurns.push(coordsToChess(y,x))
                    break
                }
                possibleTurns.push(coordsToChess(y,x))
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
        this.position = coordsToChess(row,column);
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
        this.possibleTurns = this.picked.getPossibleTurns(cell.jsCell, this)
        console.log(this.possibleTurns)
        cell.jsCell.piece = null;
        cell.innerHTML = "";
    }

    putPiece(cell) {
        let jsCell = cell.jsCell
        if (this.possibleTurns.includes(coordsToChess(jsCell.row, jsCell.col))) {
            if (this.picked.pieceType == "Pawn" && (jsCell.row == 0 || jsCell.row == 7)) {
                this.picked = new Queen(this.picked.color)
            }
            jsCell.piece = this.picked;
            this.renderPiece(cell);
            this.picked = null;
        }
    }

    getCellByCoords(x, y) {
        return this.rows[y].cells[x]
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
}

function coordsToChess(row, column) {
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

