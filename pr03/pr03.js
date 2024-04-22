$(document).ready(function () {
  toastr.options = {
    debug: false,
    positionClass: "toast-bottom-right",
    onclick: null,
    fadeIn: 300,
    fadeOut: 1000,
    timeOut: 5000,
    extendedTimeOut: 1000
  };
});

document.addEventListener("DOMContentLoaded", () => {
  const boardElement = document.getElementById("board");
  const mineCountElement = document.getElementById("mineCount");
  const resetButton = document.getElementById("resetButton");
  const difficultyRadios = document.querySelectorAll(
    'input[name="difficulty"]'
  );
  let boardSize, mineTotal;
  let board;
  const timerElement = document.getElementById("timer");
  let timerId = null;
  let secondsPassed = 0;
  const bestTimeElement = document.getElementById("bestTime");
  let bestTime = 0;
  bestTimeElement.textContent = `Best Time: ${bestTime} s`;
  let gameOver = false;

  function updateBestTime() {
    if (bestTime === 0 || secondsPassed < bestTime) {
      bestTime = secondsPassed;
      bestTimeElement.textContent = `Best Time: ${bestTime} s`;
    }
  }

  function displayBestTime() {
    bestTimeElement.textContent = `Best Time: ${
      bestTime > 0 ? bestTime + " s" : "-- s"
    }`;
  }

  function startTimer() {
    if (timerId !== null) return;
    timerId = setInterval(() => {
      secondsPassed++;
      timerElement.textContent = `Time: ${secondsPassed}s`;
    }, 1000);
  }

  function stopTimer() {
    clearInterval(timerId);
    timerId = null;
    if (checkWin()) {
      updateBestTime();
    }
  }

  function setDifficulty() {
    const selectedDifficulty = document.querySelector(
      'input[name="difficulty"]:checked'
    ).value;
    if (selectedDifficulty === "easy") {
      boardSize = 9;
      mineTotal = 10;
    } else if (selectedDifficulty === "medium") {
      boardSize = 16;
      mineTotal = 40;
    }
    resetBestTime();
    resetGame();
  }

  function resetBestTime() {
    bestTime = 0;
    bestTimeElement.textContent = `Best Time: -- s`;
  }

  difficultyRadios.forEach((radio) => {
    radio.addEventListener("change", function () {
      if (this.checked) {
        setDifficulty();
      }
    });
  });

  function resetGame() {
    createBoard();
    secondsPassed = 0;
    if (timerId !== null) {
      clearInterval(timerId);
      timerId = null;
    }
    timerElement.textContent = "Time: 0s";
    gameOver = false;
  }

  function resetBestTime() {
    bestTime = 0;
    bestTimeElement.textContent = `Best Time: -- s`;
    secondsPassed = 0;
    if (timerId !== null) {
      clearInterval(timerId);
      timerId = null;
      timerElement.textContent = "Time: 0s";
    }
  }

  // Create the board
  function createBoard() {
    boardElement.innerHTML = "";
    boardElement.style.gridTemplateColumns = `repeat(${boardSize}, 30px)`;
    boardElement.style.gridTemplateRows = `repeat(${boardSize}, 30px)`;
    mineCount = mineTotal;
    mineCountElement.textContent = `Mines left: ${mineCount}`;
    board = Array.from({ length: boardSize }, () =>
      Array.from({ length: boardSize }, () => ({
        mine: false,
        revealed: false,
        marked: false,
        adjacentMines: 0
      }))
    );

    let positions = [];
    for (let i = 0; i < boardSize; i++) {
      for (let j = 0; j < boardSize; j++) {
        positions.push({ x: i, y: j });
      }
    }

    // Randomly place the mines
    shuffle(positions);
    for (let i = 0; i < mineTotal; i++) {
      const { x, y } = positions[i];
      board[x][y].mine = true;

      // Update adjacent counts
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx >= 0 && nx < boardSize && ny >= 0 && ny < boardSize) {
            board[nx][ny].adjacentMines += 1;
          }
        }
      }
    }

    // Create the html for the board
    board.forEach((row, x) => {
      row.forEach((cell, y) => {
        const cellElement = document.createElement("div");
        cellElement.className = "cell";
        cellElement.addEventListener("click", () => openCell(x, y));
        cellElement.addEventListener("contextmenu", (e) => {
          e.preventDefault();
          markCell(x, y);
        });
        boardElement.appendChild(cellElement);
      });
    });
  }

  function revealMines() {
    board.forEach((row, x) => {
      row.forEach((cell, y) => {
        if (cell.mine) {
          const index = x * boardSize + y;
          const cellElement = boardElement.children[index];
          cellElement.classList.add("mine");
          cellElement.textContent = "💣";
        }
      });
    });
  }

  function checkWin() {
    for (let x = 0; x < boardSize; x++) {
      for (let y = 0; y < boardSize; y++) {
        const cell = board[x][y];
        if (!cell.mine && !cell.revealed) {
          return false;
        }
      }
    }
    return true;
  }

  function openCell(x, y) {
    const cell = board[x][y];
    const index = x * boardSize + y;
    const cellElement = boardElement.children[index];
    if (cell.revealed || cell.marked || gameOver) return;

    if (timerId === null) startTimer();

    cell.revealed = true;
    cellElement.classList.add("open");
    cellElement.textContent = cell.adjacentMines || "";

    if (cell.mine) {
      cellElement.classList.add("mine");
      revealMines();
      stopTimer();
      toastr.error("Game Over! You hit a mine.");
      gameOver = true;
    } else {
      if (cell.adjacentMines === 0) {
        // Recursively open adjacent cells
        for (let dx = -1; dx <= 1; dx++) {
          for (let dy = -1; dy <= 1; dy++) {
            const nx = x + dx;
            const ny = y + dy;
            if (
              nx >= 0 &&
              nx < boardSize &&
              ny >= 0 &&
              ny < boardSize &&
              !board[nx][ny].revealed
            ) {
              openCell(nx, ny);
            }
          }
        }
      } else {
        // Set text color based on adjacent mines
        cellElement.textContent = cell.adjacentMines;
        if (cell.adjacentMines === 1) {
          cellElement.style.color = "blue";
        } else if (cell.adjacentMines === 2) {
          cellElement.style.color = "green";
        } else if (cell.adjacentMines === 3) {
          cellElement.style.color = "red";
        } else if (cell.adjacentMines === 4) {
          cellElement.style.color = "purple";
        } else {
          cellElement.style.color = "black";
        }
      }

      if (checkWin()) {
        stopTimer();
        revealMines();
        toastr.success("Contratulations! You won!");
      }
    }
  }

  function markCell(x, y) {
    const cell = board[x][y];
    const index = x * boardSize + y;
    const cellElement = boardElement.children[index];
    if (cell.revealed || gameOver) return;

    if (!cell.marked) {
      cell.marked = true;
      cellElement.classList.add("marked");
      mineCount--;
    } else {
      cell.marked = false;
      cellElement.classList.remove("marked");
      mineCount++;
    }
    mineCountElement.textContent = `Mines left: ${mineCount}`;
  }

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  resetButton.addEventListener("click", function () {
    resetGame();
  });

  setDifficulty();
  displayBestTime();
});
