const CellContents = Object.freeze({"EMPTY":0, "PLAYER1":1, "PLAYER2":2, "FRUIT":3}) 
const numFruit = 2;
const directions = ["Up", "Down", "Left", "Right"]

function Initialize(boardSize, startingPlayerI = 0, roundsWon = [0, 0]) {
    let board = [];
    for (var i = 0; i < boardSize; i++) {
        let row = [];
        for (var j = 0; j < boardSize; j++) {
            row.push({ contents: CellContents.EMPTY, toward: null });
        }
        board.push(row);
    }
    
    getCell(board, 0, boardSize - 1).contents = CellContents.PLAYER1;
    getCell(board, boardSize - 1, 0).contents = CellContents.PLAYER2;

    for (let i = 0; i < numFruit; i++) {
        findEmptyCell(board).contents = CellContents.FRUIT;
    }

    return {
        boardSize: boardSize,
        board: board,
        players: [{
            head: { x: 0, y: boardSize - 1 },
            tail: { x: 0, y: boardSize - 1 },
            contentsId: CellContents.PLAYER1,
            toGrow: 0,
            fruitEaten: 0,
            roundsWon: roundsWon[0],
        }, {
            head: { x: boardSize - 1, y: 0 },
            tail: { x: boardSize - 1, y: 0 },
            contentsId: CellContents.PLAYER2,
            toGrow: 0,
            fruitEaten: 0,
            roundsWon: roundsWon[1],
        }],
        startingPlayerI: startingPlayerI,
        playerTurn: startingPlayerI,
    };
};

function getCell(board, x, y) {
    if (x < 0 || y < 0 || x >= board[0].length || y >= board.length)
        return null;
    return board[y][x];
}

function findEmptyCell(board) {
    let result;
    do {
        let x = Math.floor(Math.random() * board[0].length);
        let y = Math.floor(Math.random() * board.length);
        result = getCell(board, x, y);
    } while (result.contents !== CellContents.EMPTY);
    return result;
}

function cellInDirection(startCell, direction) {
    switch (direction) {
        case "Left":
            return {x: startCell.x - 1, y: startCell.y};
        case "Right":
            return {x: startCell.x + 1, y: startCell.y};
        case "Up":
            return {x: startCell.x, y: startCell.y - 1};
        case "Down":
            return {x: startCell.x, y: startCell.y + 1};
        default:
            return null; 
    }
}

function Update(state, key) {
    const playerI = state.playerTurn;
    let board = state.board.slice();
    let head = state.players[playerI].head;
    let tail = state.players[playerI].tail;
    // slice off the "Arrow" part of the key
    console.log(key);
    let tryDir = key.slice(5);
    // toCell is the cell the snake is trying to move to
    let toCellCoords = cellInDirection(head, tryDir);
    if (toCellCoords == null)
        return {};
    const toCell = getCell(state.board, toCellCoords.x, toCellCoords.y);
    // make sure it isn't bumping into anything
    if (!toCell)
        return {};
    const toCellContents = toCell.contents;
    if (toCellContents !== CellContents.EMPTY && toCellContents !== CellContents.FRUIT)
        return {};
    // set the direction of the last cell to be the head
    // so we know where the tail should go later on
    getCell(board, head.x, head.y).toward = tryDir;
    // retract the tail
    if (toCellContents !== CellContents.FRUIT) {
        let oldTailCell = getCell(board, tail.x, tail.y);
        oldTailCell.contents = CellContents.EMPTY;
        tail = cellInDirection(tail, oldTailCell.toward);
    }
    // advance the head
    head = toCellCoords;
    getCell(board, head.x, head.y).contents = CellContents["PLAYER" + (playerI + 1)];
    // check for trapped state of next player
    const otherP = state.players[(playerI + 1) % state.players.length];
    let trapped = true;
    for (const d of directions) {
        const nCellCoords = cellInDirection(otherP.head, d);
        if (nCellCoords) {
            const nCell = getCell(board, nCellCoords.x, nCellCoords.y);
            if (nCell && (nCell.contents === CellContents.EMPTY || nCell.contents === CellContents.FRUIT)) {
                trapped = false;
                break;
            }
        }
    }
    if (trapped) {
        let roundsWon = [state.players[0].roundsWon, state.players[1].roundsWon];
        let winnerI = playerI;
        let startingPlayer = state.startingPlayer === 0 ? 1 : 0;
        roundsWon[winnerI] += 1;
        return Initialize(state.boardSize, startingPlayer, roundsWon);
    }
    // make the new state
    let newState = {board: board};
    newState.players = [...state.players];
    newState.players[playerI].head = head;
    newState.players[playerI].tail = tail;
    newState.playerTurn = state.playerTurn === 0 ? 1 : 0; 
    if (toCellContents === CellContents.FRUIT) {
        newState.players[playerI].fruitEaten += 1;
        findEmptyCell(board).contents = CellContents.FRUIT;
    }
    
    return newState;
};

export { Initialize, Update };