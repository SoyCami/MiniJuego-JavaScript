document.addEventListener("DOMContentLoaded", () => {
    const gameBoard = document.getElementById("game-board");
    const scoreElement = document.getElementById("score");

    const rows = 20;
    const columns = 10;
    const squareSize = 30;

    const tetrominoes = [
        [[1, 1, 1, 1]],        // I
        [[1, 1], [1, 1]],    // O
        [[1, 1, 1], [0, 1, 0]], // T
        [[1, 1, 1], [1, 0, 0]], // L
        [[1, 1, 1], [0, 0, 1]], // J
        [[0, 1, 1], [1, 1, 0]], // S
        [[1, 1, 0], [0, 1, 1]]  // Z
    ];

    let score = 0;
    let gameInterval;
    let currentTetromino;
    let currentTetrominoPosition;

    function createGameBoard() {
        gameBoard.innerHTML = "";
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < columns; col++) {
                const square = document.createElement("div");
                square.style.width = square.style.height = squareSize + "px";
                square.style.top = row * squareSize + "px";
                square.style.left = col * squareSize + "px";
                square.classList.add("square");
                gameBoard.appendChild(square);
            }
        }
    }

    function createTetromino() {
        const randomTetromino = tetrominoes[Math.floor(Math.random() * tetrominoes.length)];
        const tetromino = [];
        for (let row = 0; row < randomTetromino.length; row++) {
            tetromino[row] = [];
            for (let col = 0; col < randomTetromino[row].length; col++) {
                if (randomTetromino[row][col]) {
                    const square = document.createElement("div");
                    square.style.width = square.style.height = squareSize + "px";
                    square.style.top = row * squareSize + "px";
                    square.style.left = col * squareSize + "px";
                    square.classList.add("tetromino");
                    gameBoard.appendChild(square);
                    tetromino[row][col] = square;
                }
            }
        }
        return tetromino;
    }

    function moveTetrominoDown() {
        const canMoveDown = currentTetrominoPosition.row + currentTetromino.length < rows;
        if (canMoveDown) {
            eraseTetromino();
            currentTetrominoPosition.row++;
            drawTetromino();
        } else {
            checkRows();
            currentTetromino = createTetromino();
            currentTetrominoPosition = { row: 0, col: Math.floor(columns / 2) - 1 };
        }
    }

    function drawTetromino() {
        for (let row = 0; row < currentTetromino.length; row++) {
            for (let col = 0; col < currentTetromino[row].length; col++) {
                if (currentTetromino[row][col]) {
                    const x = currentTetrominoPosition.col + col;
                    const y = currentTetrominoPosition.row + row;
                    const square = currentTetromino[row][col];
                    square.style.left = x * squareSize + "px";
                    square.style.top = y * squareSize + "px";
                }
            }
        }
    }

    function eraseTetromino() {
        for (let row = 0; row < currentTetromino.length; row++) {
            for (let col = 0; col < currentTetromino[row].length; col++) {
                if (currentTetromino[row][col]) {
                    gameBoard.removeChild(currentTetromino[row][col]);
                }
            }
        }
    }

    function checkRows() {
        for (let row = rows - 1; row >= 0; row--) {
            const isRowFull = Array.from(gameBoard.querySelectorAll(`.square[data-row="${row}"]`)).every(square => square.classList.contains("taken"));
            if (isRowFull) {
                removeRow(row);
                row++;
                score += 100;
                scoreElement.textContent = score;
            }
        }
    }

    function removeRow(row) {
        const squares = Array.from(gameBoard.querySelectorAll(`.square[data-row="${row}"]`));
        squares.forEach(square => {
            square.classList.remove("taken");
            square.classList.remove("tetromino");
        });

        const squaresAbove = Array.from(gameBoard.querySelectorAll(`.square[data-row="${row - 1}"]`));
        squaresAbove.forEach(square => {
            if (square.classList.contains("tetromino")) {
                square.classList.remove("tetromino");
                gameBoard.removeChild(square);
            }
        });

        for (let currentRow = row - 1; currentRow >= 0; currentRow--) {
            const squaresToMoveDown = Array.from(gameBoard.querySelectorAll(`.square[data-row="${currentRow}"]`));
            squaresToMoveDown.forEach(square => {
                square.dataset.row = currentRow + 1;
                square.style.top = (currentRow + 1) * squareSize + "px";
            });
        }
    }

    function checkGameOver() {
        const squares = Array.from(gameBoard.querySelectorAll(`.square[data-row="0"]`));
        if (squares.some(square => square.classList.contains("taken"))) {
            clearInterval(gameInterval);
            alert("Game Over. Puntaje final: " + score);
            resetGame();
        }
    }

    function resetGame() {
        gameBoard.innerHTML = "";
        score = 0;
        scoreElement.textContent = score;
        createGameBoard();
        currentTetromino = createTetromino();
        currentTetrominoPosition = { row: 0, col: Math.floor(columns / 2) - 1 };
        gameInterval = setInterval(moveTetrominoDown, 500);
    }

    createGameBoard();
    currentTetromino = createTetromino();
    currentTetrominoPosition = { row: 0, col: Math.floor(columns / 2) - 1 };
    gameInterval = setInterval(moveTetrominoDown, 500);
});
