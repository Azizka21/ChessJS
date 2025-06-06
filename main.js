import { Board, chessToCoords, coordsToChess } from "./src/chess.js"

window.onload = function() {
    let board = new Board(startPosition);
    let boardDiv = document.createElement('div');
    renderBoard(board, boardDiv)
    let oldCell = null
    boardDiv.addEventListener('click', (ev) => {
        const cell = ev.target.closest('.cell')
        if (cell) {
            if (! oldCell) {
                if (cell.jsCell.piece && cell.jsCell.piece.color === board.turnColor) {
                    takePiece(cell, board)
                    oldCell = cell
                }
            } else {
                if (putPiece(oldCell, cell, board, boardDiv)) {
                    oldCell = null
                }
            }
        }
    })
}

function renderBoard(board, boardDiv) {
    boardDiv.innerHTML = ""
    boardDiv.className = "board";
    for (let row of board.cells) {
        for (let cell of row){
            let cellDiv = document.createElement('div');
            cell.element = cellDiv;
            cellDiv.jsCell = cell;
            cellDiv.classList.add('cell');
            cellDiv.classList.add(cell.color);
            if (cell.piece) {
                renderPiece(cellDiv);
            }
            boardDiv.appendChild(cellDiv);
            }
        }
    document.body.appendChild(boardDiv)
    return boardDiv
}

function renderPiece(cell) {
    const piece = cell.jsCell.piece
    const img = document.createElement("img");
    if (piece.color === "white") {
        const piecesPNG = {
            Pawn: "https://upload.wikimedia.org/wikipedia/commons/0/04/Chess_plt60.png",
            Rook: "https://upload.wikimedia.org/wikipedia/commons/5/5c/Chess_rlt60.png",
            Knight: "https://upload.wikimedia.org/wikipedia/commons/2/28/Chess_nlt60.png",
            Bishop: "https://upload.wikimedia.org/wikipedia/commons/9/9b/Chess_blt60.png",
            King: "https://upload.wikimedia.org/wikipedia/commons/3/3b/Chess_klt60.png",
            Queen: "https://upload.wikimedia.org/wikipedia/commons/4/49/Chess_qlt60.png",
        };
        img.src = piecesPNG[piece.pieceType]
    } else {
        const piecesPNG = {
            Pawn: "https://upload.wikimedia.org/wikipedia/commons/c/cd/Chess_pdt60.png",
            Rook: "https://upload.wikimedia.org/wikipedia/commons/a/a0/Chess_rdt60.png",
            Knight: "https://upload.wikimedia.org/wikipedia/commons/f/f1/Chess_ndt60.png",
            Bishop: "https://upload.wikimedia.org/wikipedia/commons/8/81/Chess_bdt60.png",
            King: "https://upload.wikimedia.org/wikipedia/commons/e/e3/Chess_kdt60.png",
            Queen: "https://upload.wikimedia.org/wikipedia/commons/a/af/Chess_qdt60.png",
        };
        img.src = piecesPNG[piece.pieceType]
    }
    cell.replaceChildren(img);
}

function takePiece(cell, board) {
    board.oldCell = cell.jsCell;
    board.possibleTurns = cell.jsCell.piece.getPossibleTurns(cell.jsCell, board);
    board.possibleTurns.push(cell.jsCell.position);
    cell.innerHTML = "";
    renderPossibleTurns(board, board.possibleTurns);
}

function putPiece(oldCell, newCell, board, boardDiv) {
    if (board.makeMove(oldCell.jsCell, newCell.jsCell)) {
        renderBoard(board, boardDiv)
        return true
    }
    return false
}

function renderPossibleTurns(board, possibleTurns) {
    for (let position of possibleTurns) {
        let coords = chessToCoords(position)
        let cell = board.getCellByCoords(coords[1], coords[0])
        cell.element.insertAdjacentHTML('beforeend', '<p>•</p>');
        }
}

const startPosition = [
  [
    ["black", "Rook"],
    ["black", "Knight"],
    ["black", "Bishop"],
    ["black", "Queen"],
    ["black", "King"],
    ["black", "Bishop"],
    ["black", "Knight"],
    ["black", "Rook"]
  ],
  [
    ["black", "Pawn"],
    ["black", "Pawn"],
    ["black", "Pawn"],
    ["black", "Pawn"],
    ["black", "Pawn"],
    ["black", "Pawn"],
    ["black", "Pawn"],
    ["black", "Pawn"]
  ],
  [ null, null, null, null, null, null, null, null ],
  [ null, null, null, null, null, null, null, null ],
  [ null, null, null, null, null, null, null, null ],
  [ null, null, null, null, null, null, null, null ],
  [
    ["white", "Pawn"],
    ["white", "Pawn"],
    ["white", "Pawn"],
    ["white", "Pawn"],
    ["white", "Pawn"],
    ["white", "Pawn"],
    ["white", "Pawn"],
    ["white", "Pawn"]
  ],
  [
    ["white", "Rook"],
    ["white", "Knight"],
    ["white", "Bishop"],
    ["white", "Queen"],
    ["white", "King"],
    ["white", "Bishop"],
    ["white", "Knight"],
    ["white", "Rook"]
  ]
]