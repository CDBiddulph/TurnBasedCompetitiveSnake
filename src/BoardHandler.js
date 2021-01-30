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

function Update(state, key, player) {
    const playerI = player - 1;
    let board = state.board.slice();
    let head = state.players[playerI].head;
    let toCellCoords;
    switch (key) {
        case "ArrowLeft":
            toCellCoords = {x: head.x - 1, y: head.y};
            break;
        case "ArrowRight":
            toCellCoords = {x: head.x + 1, y: head.y};
            break;
        case "ArrowUp":
            toCellCoords = {x: head.x, y: head.y - 1};
            break;
        case "ArrowDown":
            toCellCoords = {x: head.x, y: head.y + 1};
            break;
        default:
            return {}; //don't change the state
    }
    const toCell = getCell(state.board, toCellCoords.x, toCellCoords.y);
    if (!toCell)
        return {};
    const toCellColor = toCell.color;
    if (toCellColor !== emptyColor && toCellColor !== fruitColor)
        return {};
    getCell(board, head.x, head.y).color = emptyColor;
    head = toCellCoords;
    getCell(board, head.x, head.y).color = playerColors[playerI];

    let newState = {board: board};
    newState.players = [...state.players];
    newState.players[playerI].head = head;
    if (toCellColor === fruitColor) {
        newState.players[playerI].numFruit += 1;
        findEmptyCell(board).color = fruitColor;
    }
    
    return newState;
};

export { Initialize, Update };