const emptyColor = "white";
const playerColors = ["green", "blue"];
const fruitColor = "red";
const numFruit = 1;

function Initialize(boardSize) {
    let board = [];
    for (var i = 0; i < boardSize; i++) {
        let row = [];
        for (var j = 0; j < boardSize; j++) {
            row.push({ color: emptyColor, toward: null });
        }
        board.push(row);
    }
    
    getCell(board, 0, boardSize - 1).color = playerColors[0];
    getCell(board, boardSize - 1, 0).color = playerColors[1];

    for (let i = 0; i < numFruit; i++) {
        findEmptyCell(board).color = fruitColor;
    }

    return {
        boardSize: boardSize,
        board: board,
        players: [{
            head: { x: 0, y: boardSize - 1 },
            tail: { x: 0, y: boardSize - 1 },
            color: playerColors[0],
            toGrow: 0,
        }, {
            head: { x: boardSize - 1, y: 0 },
            tail: { x: boardSize - 1, y: 0 },
            color: playerColors[1],
            toGrow: 0,
        }],
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
    } while (result.color !== emptyColor);
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

function Update(state, key, player) {
    const playerI = player - 1;
    let board = state.board.slice();
    let head = state.players[playerI].head;
    let tail = state.players[playerI].tail;
    // slice off the "Arrow" part of the key
    let direction = key.slice(5);
    let toCellCoords = cellInDirection(head, direction);
    // the cell the snake is trying to move to
    const toCell = getCell(state.board, toCellCoords.x, toCellCoords.y);
    // make sure it isn't bumping into anything
    if (!toCell)
        return {};
    const toCellColor = toCell.color;
    if (toCellColor !== emptyColor && toCellColor !== fruitColor)
        return {};
    // set the direction of the last cell to be the head
    // so we know where the tail should go later on
    getCell(board, head.x, head.y).toward = direction;
    // retract the tail
    if (toCellColor !== fruitColor) {
        let oldTailCell = getCell(board, tail.x, tail.y);
        oldTailCell.color = emptyColor;
        tail = cellInDirection(tail, oldTailCell.toward);
    }
    // advance the head
    head = toCellCoords;
    getCell(board, head.x, head.y).color = playerColors[playerI];

    let newState = {board: board};
    newState.players = [...state.players];
    newState.players[playerI].head = head;
    newState.players[playerI].tail = tail;
    if (toCellColor === fruitColor) {
        newState.players[playerI].numFruit += 1;
        findEmptyCell(board).color = fruitColor;
    }
    
    return newState;
};

export { Initialize, Update };