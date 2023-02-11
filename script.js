const gameBoard = (function () {
  let board = ["", "", "", "", "", "", "", "", ""];
  let currentGameMode = null;
  let gameOver = false;
  let gameInit = false;
  let winner = null;
  const winCondition = [
    ["0", "1", "2"],
    ["3", "4", "5"],
    ["6", "7", "8"],
    ["0", "3", "6"],
    ["1", "4", "7"],
    ["2", "5", "8"],
    ["0", "4", "8"],
    ["2", "4", "6"],
  ];
  

  function valueOnBoard(index, value) {
      return board[index] = value;
  }

  function defaultGame() {
    for (let i = 0; i < board.length; i++) {
      field[i].textContent = "";
    }
    board = ["", "", "", "", "", "", "", "", ""];
    currentGameMode = null;
    gameOver = false;
    gameInit = false;
    winner = null;
    round = 0;
    playerXName.value = "";
    playerOName.value = "";
    displayController.playersTurnText.textContent = "";
    playerButton.style.visibility = "visible";
    aiButton.style.visibility = "visible";
    aiButton.style.border = "";
    playerButton.style.border = "";
    playButton.textContent = "Play";
  }

  const aiButton = document.getElementById("ai-mode");

  aiButton.addEventListener("click", () => {
    displayController.displayCurrentGameMode();
    currentGameMode = "pve";
    playerXName.style.visibility = "hidden";
    playerOName.style.visibility = "hidden";
    displayController.displayCurrentGameMode();
    return currentGameMode;

  });

  const playerButton = document.getElementById("player-mode");

  playerButton.addEventListener("click", () => {
    currentGameMode = "pvp";
    displayController.displayCurrentGameMode();
    playerXName.style.visibility = "visible";
    playerOName.style.visibility = "visible";
    return currentGameMode;
  });

  const playerXName = document.getElementById("player-x-name");
  const playerOName = document.getElementById("player-o-name");
  playerXName.style.visibility = "hidden";
  playerOName.style.visibility = "hidden";

  const newPlayers = () => {
    const playerX = playerXName.value;
    const playerO = playerOName.value;
    return { playerX, playerO };
  };

  function getCurrentGameMode() {
    return currentGameMode;
  }

  let round = 0;
  function roundCount() {
    return round++;
  }

  function getRound() {
    return round;
  }

  function getCurrentPlayer() {
    if (getRound() % 2 === 0) {
      return "X";
    } else {
      return "O";
    }
  }

  function CheckForWin(currentPlayer) {
    return winCondition.some((combination) => {
      return combination.every((index) => {
        return board[index] == currentPlayer;
      });
    });
  }

  function getWinner() {
    return winner;
  }

  function checkForTie() {
    if (getRound() === 9 && !gameOver) {
      displayController.playersTurnText.textContent = "The game is tied";
      winner = "tie";
      displayController.displayPlayAgainButton();
    }
  }

  function basicAi() {
    let randomNumber = Math.floor(Math.random() * 9);
    if (board[randomNumber] !== "") {
      return basicAi();
    } else {
      valueOnBoard(randomNumber, "O");
      field[randomNumber].textContent = "O";
      roundCount();
      checkForTie();
      return;
    }
  }

  const playButton = document.getElementById("play-button");
  playButton.addEventListener("click", () => {
    if (playButton.textContent === "Play") {
      if (getCurrentGameMode() === null) {
        return;
      }
      if (playButton.textContent === "Play") {
        if (getCurrentGameMode() === "pvp" && (playerXName.value == "" || playerOName.value == "")) {
          return alert("Players name must not be empty");
        }
        playerXName.style.visibility = "hidden";
        playerOName.style.visibility = "hidden";
        playerButton.style.visibility = "hidden";
        aiButton.style.visibility = "hidden";
        displayController.playersInfo.style.visibility = "hidden";
        playButton.style.visibility = "hidden";
        gameInit = true;
        displayController.displayPlayersTurn()
        if (getCurrentGameMode() === "pvp") {
          newPlayers();
        }
        return gameInit;
      } 
    } else {
      defaultGame();
    }
  })

  function getGameInit() {
    return gameInit;
  }


  const field = Array.from(document.querySelectorAll(".field"));
  field.forEach((element) => {
    element.addEventListener("click", (e) => {
      if (!gameInit) {
        return;
      }
      if (gameOver) {
        return;
      }
      if (e.target.textContent !== "") {
        return;
      }
      if (getCurrentGameMode() === "pvp") {
        if (getRound() % 2 === 0) {
          valueOnBoard(e.target.dataset.index, "X");
          e.target.textContent = "X";
          if (CheckForWin("X")) {
            winner = newPlayers().playerX;
            displayController.displayPlayAgainButton();
            displayController.displayWinnerName();
            return gameOver = true;
          }
          roundCount();
          displayController.displayPlayersTurn()
          checkForTie();
        } else if (getRound() % 2 !== 0) {
          valueOnBoard(e.target.dataset.index, "O");
          e.target.textContent = "O";
          if (CheckForWin("O")) {
            winner = newPlayers().playerO;
            displayController.displayPlayAgainButton();
            displayController.displayWinnerName();
            return gameOver = true;
          }
          roundCount();
          displayController.displayPlayersTurn()
          checkForTie();
        }
      }
      if (getCurrentGameMode() === "pve") {
        if (getRound() % 2 === 0) {
          valueOnBoard(e.target.dataset.index, "X");
          e.target.textContent = "X";
          if (CheckForWin("X")) {
            winner = "Player";
            displayController.displayPlayAgainButton();
            displayController.displayWinnerName();
            return gameOver = true;
          }
          roundCount();
          checkForTie();
        } if (getRound() % 2 !== 0) {  
          basicAi();
          if (CheckForWin("O")) {
            winner = "Computer";
            displayController.displayPlayAgainButton();
            displayController.displayWinnerName();
            return gameOver = true;
          }
        }
      }
    });
  });
  return { board, valueOnBoard, getCurrentGameMode, roundCount, getRound, getCurrentPlayer, CheckForWin, basicAi, aiButton, playerButton, playButton, getGameInit, newPlayers, playerXName, playerOName, getWinner, };
})();

const displayController = (function () {

const playersTurnText = document.getElementById("control-display");

  const playersInfo = document.querySelector(".opponent");

  function displayCurrentGameMode() {
    if (gameBoard.getCurrentGameMode() === "pve") {
      gameBoard.aiButton.style.border = "4px #fffcf2 solid";
      gameBoard.playerButton.style.border = "";
    } else if (gameBoard.getCurrentGameMode() === "pvp") {
      gameBoard.playerButton.style.border = "4px #fffcf2 solid";
      gameBoard.aiButton.style.border = "";
    } 
  }

  function displayPlayersTurn() {
    if (gameBoard.getCurrentPlayer() === "X" && gameBoard.getCurrentGameMode() === "pvp") {
      displayController.playersTurnText.textContent = `${gameBoard.newPlayers().playerX} Turn`;
    } else if (gameBoard.getCurrentPlayer() === "O" && gameBoard.getCurrentGameMode() === "pvp") {
      displayController.playersTurnText.textContent = `${gameBoard.newPlayers().playerO} Turn`;
    }
  }

  function displayWinnerName() {
    playersTurnText.textContent = `${gameBoard.getWinner()} won the game!`
  }

  function displayPlayAgainButton() {
    if (gameBoard.getWinner() !== null || gameBoard.getWinner() === "tie") {
      gameBoard.playButton.style.visibility = "visible";
      gameBoard.playButton.textContent = "Play Again";
    }
  }


  return {displayCurrentGameMode, playersTurnText, displayPlayersTurn, playersInfo, displayWinnerName, displayPlayAgainButton}
})();